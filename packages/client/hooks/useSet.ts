import { Item, Set, newSet } from "@kcm/shared/src/types";
import React from "react";
import { getItem, getItems } from "../api/item";
import { downloadItemsAsCsv, downloadSetAsCsv } from "../helpers/csv";

type State = {
  error: string;
  lastItem: Item | null;
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
  | { type: "ADD_SHELF"; payload: number }
  | { type: "REMOVE_ITEM"; payload: [number, number] };

const initialState: State = {
  error: "",
  lastItem: null,
  status: "pending",
  set: newSet(),
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_ITEM_LOADING":
      return { ...state, error: "", status: "loading" };
    case "ADD_ITEM_FAILURE":
      return { ...state, error: action.payload.message, status: "failure" };
    case "ADD_ITEM_SUCCESS":
      return {
        ...state,
        lastItem: action.payload.item,
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
    case "REMOVE_ITEM":
      return {
        ...state,
        set: {
          ...state.set,
          items: [
            ...state.set.items.slice(0, action.payload[0]),
            [
              ...state.set.items[action.payload[0]].slice(0, action.payload[1]),
              ...state.set.items[action.payload[0]].slice(
                action.payload[1] + 1
              ),
            ],
            ...state.set.items.slice(action.payload[0] + 1),
          ],
        },
      };
    default:
      return { ...state };
  }
};

type DownloadMissingItemsProps =
  | never
  | { classDesc: string; subClassDescription?: never }
  | { classDesc?: never; subClassDescription: string };

type Actions = {
  addItem: (identifier: string, location: [number, number]) => Promise<void>;
  addShelf: (shelf: number) => void;
  downloadAsCsv: (key: keyof Item) => void;
  downloadMissingItems: (props?: DownloadMissingItemsProps) => void;
  removeItem: (location: [number, number]) => void;
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

  const downloadAsCsv = React.useCallback(
    (key: keyof Item) => {
      downloadSetAsCsv(
        `${state.set.store}-${state.set.name}-${Date.now()}.csv`,
        state.set.items,
        key
      );
    },
    [state.set.items, state.set.name, state.set.store]
  );

  const downloadMissingItems = React.useCallback(
    (props?: DownloadMissingItemsProps) => {
      let items = Object.keys(cache.current).reduce<Item[]>((prev, curr) => {
        if (prev.some((i) => i.itemCode === cache.current[curr].itemCode)) {
          return [...prev];
        }

        if (
          state.set.items
            .flat()
            .some((i) => i.itemCode === cache.current[curr].itemCode)
        ) {
          return [...prev];
        }

        return [...prev, cache.current[curr]];
      }, []);
      let fileName = `${state.set.store}-${state.set.name}-${Date.now()}`;

      if (props?.classDesc) {
        items = items.filter((i) => i.classDesc === props.classDesc);
        fileName = `${fileName}-${props.classDesc}.csv`;
      }

      if (props?.subClassDescription) {
        items = items.filter(
          (i) => i.subClassDescription === props.subClassDescription
        );
        fileName = `${fileName}-${items[0].classDesc}-${props.subClassDescription}.csv`;
      }

      downloadItemsAsCsv(fileName, items);
    },
    [state.set.store, state.set.name, state.set.items]
  );

  const removeItem = React.useCallback((location: [number, number]) => {
    dispatch({ type: "REMOVE_ITEM", payload: location });
  }, []);

  const actions: Actions = {
    addItem,
    addShelf,
    downloadMissingItems,
    downloadAsCsv,
    removeItem,
  };

  return [state, actions];
}

export default useSet;
