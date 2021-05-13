import Image from "next/image";
import React from "react";

import { useAuth } from "../../contexts/Auth";
import UnAuthGaurd from "../../hocs/UnAuthGuard";

type Credentials = {
  username: string;
  password: string;
};

const SignIn: React.FC = () => {
  const [credentials, setCredentials] = React.useState<Credentials>({
    username: "",
    password: "",
  });

  const [{ status }, authActions] = useAuth();

  const handleCredentialsChange =
    (key: keyof Credentials) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCredentials({ ...credentials, [key]: event.target.value });
    };

  const handleSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
    await authActions.signIn(credentials.username, credentials.password);
  };

  return (
    <UnAuthGaurd>
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-gray-900 bg-gray-50">
        <div className="flex flex-col items-center justify-center space-y-4 ">
          <Image
            alt="Karns Foods Logo"
            height={64}
            width={64}
            src="/logo.png"
          />

          <h2 className="text-2xl font-bold tracking-tight ">
            Sign in to your account
          </h2>

          <form
            className="p-8 space-y-4 bg-white border rounded-md shadow-sm"
            onSubmit={handleSubmit}
          >
            <label className="block text-sm" htmlFor="username">
              Username
              <input
                className="block w-64 px-2 py-1 text-sm font-normal border border-gray-200 rounded-md"
                autoComplete="username"
                id="username"
                name="username"
                type="text"
                value={credentials.username}
                onChange={handleCredentialsChange("username")}
              />
            </label>

            <label className="block text-sm" htmlFor="password">
              Password
              <input
                className="block w-64 px-2 py-1 text-sm border border-gray-200 rounded-md"
                autoComplete="password"
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleCredentialsChange("password")}
              />
            </label>

            <button
              className="w-full px-2 py-1 text-sm font-semibold text-white border-none rounded-md outline-none bg-karns-blue"
              type="submit"
            >
              {status === "loading" ? "Loading..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </UnAuthGaurd>
  );
};

export default SignIn;
