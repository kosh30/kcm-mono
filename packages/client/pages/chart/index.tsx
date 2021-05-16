import classNames from "classnames";
import React from "react";

import upload from "../../api/upload";
import Header from "../../components/Header";
import { useBook } from "../../contexts/Book";
import AuthGuard from "../../hocs/AuthGuard";
import useSet from "../../hooks/useSet";

const Chart: React.FC = () => {
  const identifierInputRef = React.useRef<HTMLInputElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [bookCard, setBookCard] =
    React.useState<"current" | "upload">("current");
  const [file, setFile] = React.useState<File>();
  const [identifier, setIdentifier] = React.useState<string>("");
  const [currentShelf, setCurrentShelf] = React.useState<number>(0);
  const [uploadError, setUploadError] = React.useState<string>("");
  const [uploadLoading, setUploadLoading] = React.useState<boolean>(false);

  const [{ book }] = useBook();
  const [
    setState,
    { addItem, addShelf, downloadAsCsv, downloadMissingItems, removeItem },
  ] = useSet();

  const handleAddFileClick = () => {
    inputRef.current?.click();
  };

  const handleAddItemSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
    await addItem(identifier, [
      currentShelf,
      setState.set.items[currentShelf].length,
    ]);
    setIdentifier("");
    identifierInputRef.current?.focus();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setFile(event.target.files.item(0));
    setUploadError("");
  };

  const handleAddShelfClick = () => {
    addShelf(currentShelf);
    setCurrentShelf((s) => s + 1);
    identifierInputRef.current?.focus();
  };

  const handleSwapBookCardClick = () => {
    setBookCard((b) => (b === "current" ? "upload" : "current"));
  };

  const handleUploadFormSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
    setUploadError("");
    setUploadLoading(true);

    try {
      await upload(file);
      setFile(undefined);
      // eslint-disable-next-line no-alert
      alert("Master Price Book successfully uploaded!");
    } catch (e) {
      setUploadError((e as Error).message);
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="grid flex-1 grid-cols-12 gap-8 px-6 py-4">
          <div className="col-span-9 space-y-4">
            <div className="px-6 py-4 border rounded-md shadow-sm">
              <div className="space-y-4">
                <h2 className="font-medium">Add Items</h2>

                <form
                  className="flex items-center space-x-4"
                  onSubmit={handleAddItemSubmit}
                >
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-500"
                      htmlFor="identifier"
                    >
                      Identifier
                      <input
                        className="block text-gray-900 border-0 border-b outline-none w-28 ring-0 focus:ring-0 focus:outline-none"
                        id="identifier"
                        maxLength={12}
                        name="identifier"
                        ref={identifierInputRef}
                        required
                        value={identifier}
                        onChange={(event) => setIdentifier(event.target.value)}
                      />
                    </label>
                    <span className="text-xs text-gray-500">SVIC or UPC</span>
                  </div>

                  <div className="">
                    <button
                      className="text-sm text-karns-blue"
                      disabled={setState.status === "loading"}
                      type="submit"
                    >
                      Add
                    </button>
                  </div>

                  <div>
                    <button
                      className="text-sm text-karns-blue"
                      type="button"
                      onClick={handleAddShelfClick}
                    >
                      Add Shelf
                    </button>
                  </div>
                </form>

                <div className="space-y-4">
                  {setState.set.items.map((shelf, shelfIndex) => (
                    <div
                      // eslint-disable-next-line react/no-array-index-key
                      key={shelfIndex}
                      className="space-y-4 overflow-scroll"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          setCurrentShelf(shelfIndex);
                        }
                      }}
                      onClick={() => {
                        setCurrentShelf(shelfIndex);
                      }}
                    >
                      <div className="flex items-center space-x-4">
                        {shelf.map((item, itemIndex) => (
                          <div
                            className="flex items-end justify-between flex-shrink-0 p-4 space-x-2 text-sm border rounded-md"
                            // eslint-disable-next-line react/no-array-index-key
                            key={itemIndex}
                          >
                            <div>
                              <p>{item.brand}</p>
                              <p>{item.description}</p>
                              <p>{item.itemCode}</p>
                              <p>
                                {item.upc}
                                {item.restrictPfInd}
                              </p>
                              <p>{item.size}</p>
                              <p>{item.pack}</p>
                              <p>{item.classDesc}</p>
                              <p>{item.subClassDescription}</p>
                            </div>

                            <div className="space-y-2">
                              <button
                                className="block text-gray-500 hover:text-karns-blue"
                                type="button"
                                onClick={async () => {
                                  await addItem(item.itemCode, [
                                    shelfIndex,
                                    itemIndex + 1,
                                  ]);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-5 h-5 "
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                                  <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                                </svg>
                              </button>

                              <button
                                className="block text-gray-500 hover:text-red-500"
                                type="button"
                                onClick={() => {
                                  removeItem([shelfIndex, itemIndex]);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-5 h-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div
                        className={classNames("w-full h-px bg-gray-300", {
                          "bg-karns-blue": shelfIndex === currentShelf,
                        })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {setState.set.items.flat().length > 0 && (
              <div className="px-6 py-4 border rounded-md shadow-sm">
                <div className="space-y-4">
                  <h2 className="font-medium">Missing Items</h2>

                  <div className="flex justify-between px-3 py-2 border rounded-md">
                    <span className="text-sm text-gray-500">
                      All missing items
                    </span>

                    <div>
                      <button
                        className="text-sm text-gray-500 hover:text-karns-blue"
                        type="button"
                        onClick={() => {
                          downloadMissingItems();
                        }}
                      >
                        Download
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm ">Missing items by class desc</h3>

                    <div className="border rounded-md">
                      {[
                        ...new Set(
                          setState.set.items.flat().map((i) => i.classDesc)
                        ),
                      ].map((classDesc: string, index) => (
                        <div
                          className={classNames(
                            "flex justify-between px-3 py-2",
                            {
                              "border-b": index > 0,
                            }
                          )}
                          key={classDesc}
                        >
                          <span className="text-sm text-gray-500">
                            {classDesc.toLowerCase()}
                          </span>
                          <div>
                            <button
                              className="text-sm text-gray-500 hover:text-karns-blue"
                              type="button"
                              onClick={() => {
                                downloadMissingItems({ classDesc });
                              }}
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm ">
                      Missing items by subclass description
                    </h3>

                    <div className="border rounded-md">
                      {[
                        ...new Set(
                          setState.set.items
                            .flat()
                            .map((i) => i.subClassDescription)
                        ),
                      ].map((subClassDescription: string, index) => (
                        <div
                          className={classNames(
                            "flex justify-between px-3 py-2",
                            {
                              "border-b": index > 0,
                            }
                          )}
                          key={subClassDescription}
                        >
                          <span className="text-sm text-gray-500">
                            {subClassDescription.toLowerCase()}
                          </span>
                          <div>
                            <button
                              className="text-sm text-gray-500 hover:text-karns-blue"
                              type="button"
                              onClick={() => {
                                downloadMissingItems({ subClassDescription });
                              }}
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {setState.set.items.flat().length > 0 && (
              <div className="px-6 py-4 border rounded-md shadow-sm">
                <div className="space-y-4">
                  <h2 className="font-medium">Actions</h2>

                  <div className="flex items-center space-x-4">
                    <button
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md text-karns-blue hover:border-karns-blue"
                      type="button"
                      onClick={() => {
                        downloadAsCsv("itemCode");
                      }}
                    >
                      Download as CSV (SVIC)
                    </button>

                    <button
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md text-karns-blue hover:border-karns-blue"
                      type="button"
                      onClick={() => {
                        downloadAsCsv("upc");
                      }}
                    >
                      Download as CSV (UPC)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="col-span-3 space-y-4">
            <div className="px-6 py-4 border rounded-md shadow-sm">
              {bookCard === "upload" && (
                <form className="space-y-4" onSubmit={handleUploadFormSubmit}>
                  <div className="flex items-center justify-between">
                    <h2 className="font-medium">Update Master Price Book</h2>
                    <button
                      className="text-sm text-gray-500 hover:text-gray-900"
                      type="button"
                      onClick={handleSwapBookCardClick}
                    >
                      Current
                    </button>
                  </div>

                  <button
                    className="flex items-center justify-center w-full h-32 text-gray-200 border border-gray-200 border-dashed rounded-md shadow-sm hover:text-karns-blue hover:border-karns-blue"
                    type="button"
                    onClick={handleAddFileClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-16 h-16"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  <input
                    accept="text/csv"
                    hidden
                    ref={inputRef}
                    type="file"
                    onChange={handleFileChange}
                  />

                  <div className="flex items-center justify-between">
                    <span className="overflow-hidden text-sm overflow-ellipsis">
                      {file && file.name}
                    </span>

                    <button
                      className="flex items-center px-3 py-2 space-x-1 text-sm text-white rounded-md bg-karns-blue"
                      disabled={file === undefined}
                      type="submit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm">
                        {uploadLoading ? "Loading..." : "Upload"}
                      </span>
                    </button>
                  </div>

                  {uploadError && (
                    <span className="text-sm text-red-500">{uploadError}</span>
                  )}
                </form>
              )}

              {bookCard === "current" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-medium">Current Master Price Book</h2>
                    <button
                      className="text-sm text-gray-500 hover:text-gray-900"
                      type="button"
                      onClick={handleSwapBookCardClick}
                    >
                      Upload
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <h3 className="text-sm font-medium text-gray-500">
                        File name
                      </h3>
                      <span className="text-sm">{book?.fileName}</span>
                    </div>

                    <div className="col-span-1">
                      <h3 className="text-sm font-medium text-gray-500">
                        Run date
                      </h3>
                      <span className="text-sm">{book?.runDate}</span>
                    </div>

                    <div className="col-span-1">
                      <h3 className="text-sm font-medium text-gray-500">
                        File size
                      </h3>
                      <span className="text-sm">{book?.fileSize}</span>
                    </div>

                    <div className="col-span-1">
                      <h3 className="text-sm font-medium text-gray-500">
                        Item count
                      </h3>
                      <span className="text-sm">{book?.itemCount}</span>
                    </div>

                    <div className="col-span-1">
                      <h3 className="text-sm font-medium text-gray-500">
                        Class descs
                      </h3>
                      <span className="text-sm">{book?.classDescs.length}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border rounded-md shadow-sm">
              <div className="space-y-4">
                <h2 className="font-medium">Last added item</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <h3 className="text-sm font-medium text-gray-500">SVIC</h3>
                    <span className="text-sm">
                      {setState.lastItem?.itemCode}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <h3 className="text-sm font-medium text-gray-500">Upc</h3>
                    <span className="text-sm">
                      {setState.lastItem?.upc}
                      {setState.lastItem?.restrictPfInd}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <h3 className="text-sm font-medium text-gray-500">Brand</h3>
                    <span className="text-sm">{setState.lastItem?.brand}</span>
                  </div>
                  <div className="col-span-1">
                    <h3 className="text-sm font-medium text-gray-500">
                      Description
                    </h3>
                    <span className="text-sm">
                      {setState.lastItem?.description}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <h3 className="text-sm font-medium text-gray-500">Size</h3>
                    <span className="text-sm">{setState.lastItem?.size}</span>
                  </div>
                  <div className="col-span-1">
                    <h3 className="text-sm font-medium text-gray-500">Pack</h3>
                    <span className="text-sm">{setState.lastItem?.pack}</span>
                  </div>
                  <div className="col-span-1">
                    <h3 className="text-sm font-medium text-gray-500">
                      Class Desc
                    </h3>
                    <span className="text-sm">
                      {setState.lastItem?.classDesc}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <h3 className="text-sm font-medium text-gray-500">
                      Subclass Description
                    </h3>
                    <span className="text-sm">
                      {setState.lastItem?.subClassDescription}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default Chart;
