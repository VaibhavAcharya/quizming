import { useRouter } from "next/router";

import useUser from "../../components/firebase/useUser";
import Layout from "../../components/Layout";

export default function QuizIndex() {
  const Router = useRouter();
  const { initialized } = useUser();

  if (initialized) {
    Router.push("/");
  }

  return <Layout></Layout>;
}
