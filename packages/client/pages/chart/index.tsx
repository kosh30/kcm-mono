import React from "react";

import Header from "../../components/Header";
import AuthGuard from "../../hocs/AuthGuard";

const Chart: React.FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [file, setFile] = React.useState<File>();

  const handleAddFileClick = () => {
    inputRef.current?.click();
  };

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="grid flex-1 grid-cols-12 gap-8 px-6 py-4">
          <div className="h-full col-span-9 space-y-4">
            <div className="h-full border rounded-md shadow-sm" />
          </div>

          <div className="col-span-3 space-y-4">
            <div className="px-6 py-4 space-y-4 border rounded-md shadow-sm">
              <div>
                <h2 className="font-medium">Update Master Price Book</h2>
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

              <div className="flex items-center justify-end">
                <button
                  className="px-3 py-2 text-sm text-white rounded-md bg-karns-blue"
                  type="submit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
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
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default Chart;
