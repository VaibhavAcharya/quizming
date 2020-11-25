import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import firebase from "./../../lib/firebase";

import useUser from "../../components/firebase/useUser";
import Layout from "../../components/Layout";

import QuizProfile from "../../components/dashboard/QuizProfile";

export default function Dashboard() {
  const Router = useRouter();
  const { user, initialized } = useUser();

  const [quizzes, setQuizzes] = useState(undefined);

  useEffect(
    function () {
      if (initialized) {
        if (!user) {
          Router.push("/");
        } else {
          return firebase
            .firestore()
            .collection("quizzes")
            .where("userId", "==", user.uid)
            .onSnapshot(function (snap) {
              let data = [];
              snap.forEach((doc) => {
                data = [...data, { uid: doc.id, ...doc.data() }];
              });
              setQuizzes(data);
            });
        }
      }
    },
    [user]
  );

  return (
    <Layout actionData={{ label: "Create Quiz", to: "/dashboard/new" }}>
      {quizzes !== undefined
        ? quizzes.length < 1
          ? "You currently have no quizzes! Create one to get started."
          : quizzes.map(function (quiz) {
              return <QuizProfile key={quiz.uid} {...quiz} />;
            })
        : "Loading... Please wait."}
    </Layout>
  );
}
