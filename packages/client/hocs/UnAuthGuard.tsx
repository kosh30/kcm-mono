import { useRouter } from "next/router";
import React from "react";

import { useAuth } from "../contexts/Auth";

const UnAuthGaurd: React.FC = (props) => {
  const [{ status, user }] = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    async function goHome() {
      await router.push("/");
    }

    if (user) {
      goHome();
    }
  }, [status, router, user]);

  if (user) {
    return <></>;
  }

  return <>{props.children}</>;
};

export default UnAuthGaurd;
