import { Item, Set, newSet } from "@kcm/shared/src/types";
import React from "react";
import { getItem, getItems } from "../api/item";

type State = {
  error: string;
  status: "pending" | "loading" | "failure" | "success";
  set: Set;
};

type Action =
  | { type: "ADD_ITEM_LOADING" }
  | { type: "ADD_ITEM_FAILURE"; payload: Error }
  | {
      type: "ADD_ITEM_SUCCESS";
      payload: { item: Item; location: [number, number] };
    }
  | { type: "ADD_SHELF"; payload: number };

const initialState: State = { error: "", status: "pending", set: newSet() };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_ITEM_LOADING":
      return { ...state, error: "", status: "loading" };
    case "ADD_ITEM_FAILURE":
      return { ...state, error: action.payload.message, status: "failure" };
    case "ADD_ITEM_SUCCESS":
      return {
        ...state,
        status: "success",
        set: {
          ...state.set,
          items: [
            ...state.set.items.slice(0, action.payload.location[0]),
            [
              ...state.set.items[action.payload.location[0]].slice(
                0,
                action.payload.location[1]
              ),
              action.payload.item,
              ...state.set.items[action.payload.location[0]].slice(
                action.payload.location[1]
              ),
            ],
            ...state.set.items.slice(action.payload.location[0] + 1),
          ],
        },
      };
    case "ADD_SHELF":
      return {
        ...state,
        set: {
          ...state.set,
          items: [
            ...state.set.items.slice(0, action.payload + 1),
            [],
            ...state.set.items.slice(action.payload + 1),
          ],
        },
      };
    default:
      return { ...state };
  }
};

type Actions = {
  addItem: (identifier: string, location: [number, number]) => Promise<void>;
  addShelf: (shelf: number) => void;
};

function transformUpc(upc: string): string {
  return `00${upc[0]}-${upc.slice(1, 6)}-${upc.slice(6, 11)}`;
}

function useSet(set?: Set): [State, Actions] {
  const cache = React.useRef<{ [key: string]: Item }>({});

  const [state, dispatch] = React.useReducer(reducer, {
    ...initialState,
    set: { ...initialState.set, ...set },
  });

  const addItem = React.useCallback(
    async (identifier: string, location: [number, number]) => {
      if (identifier.length < 7 || location[0] < 0 || location[1] < 0) {
        return;
      }

      if (cache.current[identifier.slice(0, 7)]) {
        dispatch({
          type: "ADD_ITEM_SUCCESS",
          payload: { item: cache.current[identifier.slice(0, 7)], location },
        });
        return;
      }

      if (cache.current[transformUpc(identifier)]) {
        dispatch({
          type: "ADD_ITEM_SUCCESS",
          payload: { item: cache.current[transformUpc(identifier)], location },
        });
        return;
      }

      dispatch({ type: "ADD_ITEM_LOADING" });

      let item: Item;

      try {
        try {
          item = await getItem({ itemCode: identifier.slice(0, 7) });
        } catch (e) {
          if (identifier.length < 12) {
            throw e;
          }

          item = await getItem({
            upc: transformUpc(identifier),
          });
        }
      } catch (e) {
        dispatch({ type: "ADD_ITEM_FAILURE", payload: e as Error });
        return;
      }

      dispatch({ type: "ADD_ITEM_SUCCESS", payload: { item, location } });

      try {
        const items = await getItems(item.classDesc);

        items.forEach((i) => {
          cache.current[i.itemCode] = i;
          cache.current[i.upc] = i;
        });
        // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    []
  );

  const addShelf = React.useCallback((shelf: number) => {
    dispatch({ type: "ADD_SHELF", payload: shelf });
  }, []);

  const actions: Actions = { addItem, addShelf };

  return [state, actions];
}

export default useSet;
