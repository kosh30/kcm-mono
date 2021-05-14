import { Item } from "@kcm/shared/src/types";
import axios from "axios";

type IdentifierChoice =
  | {
      itemCode: string;
      upc?: never;
    }
  | { itemCode?: never; upc: string };

export const getItem = async ({
  itemCode,
  upc,
}: IdentifierChoice): Promise<Item> => {
  const response = await axios.get(
    `/item?${itemCode ? `itemCode=${itemCode}` : `upc=${upc}`}`
  );
  return response.data as Item;
};

export const getItems = async (classDesc: string): Promise<Item[]> => {
  const response = await axios.get(`/items?classDesc=${classDesc}`);
  return response.data as Item[];
};
