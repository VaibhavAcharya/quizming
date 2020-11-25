import { useEffect, useState } from "react";

import firebase from "./../../lib/firebase";

import { Divider, Text } from "@geist-ui/react";
import Layout from "./../../components/Layout";
import QuizDraft from "../../components/q/Draft";
import QuizStarted from "../../components/q/Started";
import QuizResult from "../../components/q/Result";

export default function Quiz({ uid }) {
  const [quiz, setQuiz] = useState(undefined);

  useEffect(function () {
    const UnsubscribeQuizzes = firebase
      .firestore()
      .collection("quizzes")
      .doc(uid)
      .onSnapshot(function (snap) {
        const data = snap.data();
        setQuiz(data ? { ...data, uid: uid } : null);
      });
    return function () {
      UnsubscribeQuizzes()
    }
  }, []);

  return (
    <Layout showAction={quiz?.status === "finished"}>
      {quiz !== undefined ? (
        quiz ? (
          <>
            <Text h3>{quiz.title}</Text>
            <Divider y />
            {quiz.status === "draft" ? (
              <QuizDraft quiz={quiz} />
            ) : quiz.status === "started" ? (
              <QuizStarted quiz={quiz} />
            ) : (
              <QuizResult quiz={quiz} />
            )}
          </>
        ) : (
          "This quiz does not exist!"
        )
      ) : (
        "Fetching data... Please wait."
      )}
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  return {
    props: { uid: query.uid },
  };
}
