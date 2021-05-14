import Auth from "@aws-amplify/auth";
import axios from "axios";
import { AppProps } from "next/app";
import { SWRConfig } from "swr";

import { getClientId, getUserPoolId } from "../amplify";
import { AuthProvider } from "../contexts/Auth";
import { BookProvider } from "../contexts/Book";

import "../styles/globals.css";
import "tailwindcss/tailwind.css";

Auth.configure({
  region: "us-east-1",
  userPoolWebClientId: getClientId(),
  userPoolId: getUserPoolId(),
  ssr: true,
});

axios.defaults.baseURL =
  "https://u6iw2dlwk9.execute-api.us-east-1.amazonaws.com";

axios.interceptors.request.use(async (config) => {
  const bearerToken = `Bearer ${(await Auth.currentSession())
    .getAccessToken()
    .getJwtToken()}`;

  // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-unsafe-member-access
  config.headers.Authorization = bearerToken;

  return config;
});

function fetcher<T>(url: string): Promise<T> {
  return axios.get(url).then((res) => res.data as T);
}

const MyApp: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => (
  <SWRConfig
    value={{
      revalidateOnFocus: false,
      fetcher,
    }}
  >
    <AuthProvider>
      <BookProvider>
        <Component {...pageProps} />
      </BookProvider>
    </AuthProvider>
  </SWRConfig>
);

export default MyApp;
