import { useRouter } from "next/router";
import React from "react";

import { useAuth } from "../contexts/Auth";

const AuthGuard: React.FC = (props) => {
  const [{ status, user }] = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    async function goSignin() {
      await router.push("/signin");
    }

    if ((status === "success" || status === "failure") && !user) {
      goSignin();
    }
  }, [status, router, user]);

  if (!user) {
    return <></>;
  }

  return <>{props.children}</>;
};

export default AuthGuard;
