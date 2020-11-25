import { useRouter } from "next/router";
import { useEffect } from "react";

import useUser from "../../components/firebase/useUser";
import Layout from "../../components/Layout";

export default function QuizIndex() {
  const Router = useRouter();
  const { initialized } = useUser();

  useEffect(function () {
    if (initialized) {
      Router.push("/");
    }
  }, [])

  return <Layout></Layout>;
}
