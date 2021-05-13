import { useRouter } from "next/router";
import React from "react";

import { useAuth } from "../contexts/Auth";

const AuthGuard: React.FC = (props) => {
  const { children } = props;

  const [{ status, user }] = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    async function goSignin() {
      await router.push("/signin");
    }

    if ((status === "success" || status === "failure") && !user) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      goSignin();
    }
  }, [status, router, user]);

  if (!user) {
    return <></>;
  }

  return <>{children}</>;
};

export default AuthGuard;
