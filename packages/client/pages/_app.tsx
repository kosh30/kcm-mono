import Auth from "@aws-amplify/auth";
import { AppProps } from "next/app";

import { getClientId, getUserPoolId } from "../amplify";
import { AuthProvider } from "../contexts/Auth";

import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import axios from "axios";

Auth.configure({
  region: "us-east-1",
  userPoolWebClientId: getClientId(),
  userPoolId: getUserPoolId(),
  ssr: true,
});

axios.defaults.baseURL =
  "https://u6iw2dlwk9.execute-api.us-east-1.amazonaws.com";

axios.interceptors.request.use(async function (config) {
  const bearerToken = `Bearer ${(await Auth.currentSession())
    .getAccessToken()
    .getJwtToken()}`;

  config.headers.Authorization = bearerToken;

  return config;
});

const MyApp: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
};

export default MyApp;
