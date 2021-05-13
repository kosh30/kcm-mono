import Auth, { CognitoUser } from "@aws-amplify/auth";
import React from "react";

export type State = {
  error: string | null;
  status: "pending" | "loading" | "success" | "failure";
  user: CognitoUser | null;
};

const initalState: State = { error: null, status: "pending", user: null };

export type Action =
  | { type: "SIGNIN_LOADING" }
  | { type: "SIGNIN_SUCCESS"; payload: CognitoUser }
  | { type: "SIGNIN_FAILURE"; payload: string }
  | { type: "SIGNOUT_LOADING" }
  | { type: "SIGNOUT_SUCCESS" }
  | { type: "SIGNOUT_FAILURE"; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SIGNIN_LOADING":
      return { ...state, status: "loading" };
    case "SIGNIN_SUCCESS":
      return {
        ...state,
        error: null,
        status: "success",
        user: action.payload,
      };
    case "SIGNIN_FAILURE":
      return {
        ...state,
        error: action.payload,
        status: "failure",
        user: null,
      };

    case "SIGNOUT_LOADING":
      return { ...state, status: "loading" };
    case "SIGNOUT_SUCCESS":
      return { ...state, error: null, status: "success", user: null };
    case "SIGNOUT_FAILURE":
      return {
        ...state,
        error: action.payload,
        status: "failure",
      };
    default:
      return state;
  }
};

type Actions = {
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthContextType = [state: State, actions: Actions] | null;
const AuthContext = React.createContext<AuthContextType>(null);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useAuth = (): [State, Actions] => React.useContext(AuthContext)!;

export const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initalState);

  const signIn = React.useCallback(
    async (username: string, password: string) => {
      dispatch({ type: "SIGNIN_LOADING" });

      try {
        const cognitoUser = (await Auth.signIn(
          username,
          password
        )) as CognitoUser;
        dispatch({ type: "SIGNIN_SUCCESS", payload: cognitoUser });
      } catch (error) {
        dispatch({ type: "SIGNIN_FAILURE", payload: (error as Error).message });
      }
    },
    []
  );

  const signOut = React.useCallback(async () => {
    dispatch({ type: "SIGNIN_LOADING" });

    try {
      await Auth.signOut();
      dispatch({ type: "SIGNOUT_SUCCESS" });
    } catch (error) {
      dispatch({ type: "SIGNOUT_FAILURE", payload: (error as Error).message });
    }
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      try {
        const cognitoUser =
          (await Auth.currentAuthenticatedUser()) as CognitoUser;
        dispatch({ type: "SIGNIN_SUCCESS", payload: cognitoUser });
      } catch (error) {
        dispatch({ type: "SIGNIN_FAILURE", payload: (error as Error).message });
      }
    })();
  }, []);

  if (state.status === "pending") {
    return <></>;
  }

  return (
    <AuthContext.Provider value={[state, { signIn, signOut }]}>
      {children}
    </AuthContext.Provider>
  );
};
