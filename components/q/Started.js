import { useReducer, useState } from "react";
import { useRouter } from "next/router";

import firebase from "./../../lib/firebase";

import {
  Button,
  Card,
  Code,
  Col,
  Description,
  Divider,
  Input,
  Row,
  Select,
  Spacer,
  useToasts,
} from "@geist-ui/react";

function isNotNull(text) {
  return text && text.length >= 1;
}

const actions = {
  changeMeta: "MUTATE_META_DATA",
  changeChoice: "CHANGE_ANSWER_CHOICE",
};

function candidateReducer(state, action) {
  switch (action.type) {
    case actions.changeMeta:
      return { ...state, [action.field]: action.value };
    case actions.changeChoice:
      return {
        ...state,
        answers: state.answers.map(function (answer) {
          if (answer.id === action.id) {
            return { ...answer, choice: action.value };
          }
          return answer;
        }),
      };
  }
}

export default function QuizStarted({ quiz }) {
  const Router = useRouter();
  const [, setToasts] = useToasts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [candidate, dispatch] = useReducer(candidateReducer, {
    email: "",
    name: "",
    classification: "",
    answers: quiz.questions.map(function (question) {
      return { id: question.id, choice: "1" };
    }),
  });

  function submit() {
    if (
      isNotNull(candidate.email) &&
      isNotNull(candidate.name) &&
      isNotNull(candidate.classification)
    ) {
      if (
        !(quiz.candidates || [])
          .map(function (candidate) {
            return candidate.email;
          })
          .includes(candidate.email)
      ) {
        setIsSubmitting(true);
        firebase
          .firestore()
          .collection("quizzes")
          .doc(quiz.uid)
          .update({
            candidates: [...(quiz.candidates || []), candidate],
          })
          .then(function () {
            Router.push("/postsubmit");
          })
          .catch(function (e) {
            setToasts({ text: "Unexpected error happened!", type: "error" });
            console.log(e);
          });
      } else {
        setToasts({
          text: "A candidate with this email has already submitted!",
          type: "error",
        });
      }
    } else {
      setToasts({
        text: "Please check for empty fields (email, name, class)!",
        type: "error",
      });
    }
  }

  return (
    <>
      <Input
        width="100%"
        size="large"
        placeholder="Eg. your@gmail.com"
        value={candidate.email}
        onChange={function ({ target }) {
          dispatch({
            type: actions.changeMeta,
            field: "email",
            value: target.value,
          });
        }}
      >
        Email
      </Input>
      <Spacer y />
      <Input
        width="100%"
        size="large"
        placeholder="Eg. Your Name"
        value={candidate.name}
        onChange={function ({ target }) {
          dispatch({
            type: actions.changeMeta,
            field: "name",
            value: target.value,
          });
        }}
      >
        Name
      </Input>
      <Spacer y />
      <Input
        width="100%"
        size="large"
        placeholder="Eg. BCA 1"
        value={candidate.classification}
        onChange={function ({ target }) {
          dispatch({
            type: actions.changeMeta,
            field: "classification",
            value: target.value,
          });
        }}
      >
        Classification
      </Input>
      <Divider>Questions</Divider>
      {quiz.questions.map(function (question) {
        return (
          <Card key={question.id} style={{ marginBottom: "2vh" }}>
            <Description title={`Q. ${question.id}`} content={question.label} />
            <Divider />
            {question.options.map(function (option) {
              return (
                <Row key={option.id} style={{ marginBottom: "2vh" }}>
                  <Col span="100%">
                    <Code>{`${option.id}`}</Code>
                  </Col>
                  <Col offset={0.5}>{option.label}</Col>
                </Row>
              );
            })}
            <Divider type="success" align="left">
              Your Choice
            </Divider>
            <Select
              initialValue="1"
              onChange={function (value) {
                dispatch({
                  type: actions.changeChoice,
                  id: question.id,
                  value: value,
                });
              }}
            >
              {question.options.map(function (option) {
                return (
                  <Select.Option key={option.id} value={String(option.id)}>
                    Option <Code>{option.id}</Code>
                  </Select.Option>
                );
              })}
            </Select>
          </Card>
        );
      })}
      <Divider volume={2} />
      <Row align="middle" justify="center">
        <Button
          size="large"
          type="success"
          loading={isSubmitting}
          onClick={submit}
        >
          Submit
        </Button>
      </Row>
      <Divider volume={2} />
    </>
  );
}
