import { Item } from "@kcm/shared/src/types";

// eslint-disable-next-line import/prefer-default-export
export function downloadItemsAsCsv(filename: string, items: Item[]): void {
  const csvString = items.reduce<string>(
    (prev, curr) =>
      `${prev}${curr.itemCode},${curr.upc},${curr.restrictPfInd},${curr.brand},${curr.description},${curr.size},${curr.size},${curr.classDesc},${curr.subClassDescription}\n`,
    "itemCode,upc,restrictPfInd,brand,description,size,pack,classDesc,subClassDescription\n"
  );

  const element = document.createElement("a");
  element.setAttribute(
    "href",
    `data:text/plain;charset=utf-8,${encodeURIComponent(csvString)}`
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export function downloadSetAsCsv<T>(
  filename: string,
  items: T[][],
  key: keyof T
): void {
  const csvString = items.reduce<string>(
    (prevItems, currItems) =>
      `${prevItems}${currItems.reduce<string>(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        (prevItem, currItem) => `${prevItem}${currItem[key]},`,
        ""
      )}\n`,
    ""
  );

  const element = document.createElement("a");
  element.setAttribute(
    "href",
    `data:text/plain;charset=utf-8,${encodeURIComponent(csvString)}`
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
