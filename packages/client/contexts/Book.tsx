import React from "react";
import useSwr from "swr";

import { Book } from "@kcm/shared/src/types";
import { useAuth } from "./Auth";

type State = {
  book: Book;
  isLoading: boolean;
  isError: boolean;
};

type BookContextType = [state: State] | null;
const BookContext = React.createContext<BookContextType>(null);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useBook = (): [State] => React.useContext(BookContext)!;

export const BookProvider: React.FC = ({ children }) => {
  const [authState] = useAuth();
  const { data, error } = useSwr<Book, Error>(() => authState.user && "/book");

  return (
    <BookContext.Provider
      value={[{ book: data, isLoading: !error && !data, isError: !!error }]}
    >
      {children}
    </BookContext.Provider>
  );
};
