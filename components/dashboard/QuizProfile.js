import { useState } from "react";

import firebase from "./../../lib/firebase";

import {
  Button,
  Dot,
  Fieldset,
  Link,
  Row,
  Spacer,
  useClipboard,
  useToasts,
} from "@geist-ui/react";
import { Clipboard } from "@geist-ui/react-icons";
import getBaseURL from "../../utilities/getBaseURL";

function changeQuizState(uid, newState, setLoading) {
  setLoading(true);
  try {
    const ref = firebase.firestore().collection("quizzes").doc(uid);
    if (!(newState === "deleted")) {
      ref.update({
        status: newState,
      });
    } else {
      ref.delete();
    }
  } catch (e) {
    console.log(e);
  } finally {
    setLoading(false);
  }
}

const statuses = {
  draft: { type: "default", message: "Not Started" },
  started: { type: "warning", message: "In Progress" },
  finished: { type: "error", message: "Completed" },
};
const actions = {
  draft: {
    type: "success",
    message: "Start",
    callback: function (uid, setLoading) {
      changeQuizState(uid, "started", setLoading);
    },
  },
  started: {
    type: "warning",
    message: "Finish",
    callback: function (uid, setLoading) {
      changeQuizState(uid, "finished", setLoading);
    },
  },
  finished: {
    type: "error",
    message: "Delete",
    callback: function (uid, setLoading) {
      changeQuizState(uid, "deleted", setLoading);
    },
  },
};

function StatusDot({ type, message }) {
  return <Dot type={type}>{message}</Dot>;
}
function Action({ uid, type, message, callback }) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      auto
      size="mini"
      type={type}
      loading={loading}
      onClick={function () {
        callback(uid, setLoading);
      }}
    >
      {message}
    </Button>
  );
}

export default function QuizProfile({ uid, title, status }) {
  const { copy } = useClipboard();
  const [, setToasts] = useToasts();

  return (
    <Fieldset style={{ marginBottom: "2vh" }}>
      <Fieldset.Title>
        <Row align="middle" justify="start">
          <Button
            auto
            size="mini"
            icon={<Clipboard />}
            onClick={function () {
              copy(`${getBaseURL()}/q/${uid}`);
              setToasts({ text: "Copied successfully!", type: "success" });
            }}
          />
          <Spacer inline x={0.5} />
          <Link href={`/q/${uid}`} target="_blank" color icon>
            {title}
          </Link>
        </Row>
      </Fieldset.Title>
      <Fieldset.Subtitle>
        <StatusDot {...{ ...statuses[status] }} />
      </Fieldset.Subtitle>
      <Fieldset.Footer>
        <Fieldset.Footer.Actions>
          <Action {...{ uid, ...actions[status] }} />
        </Fieldset.Footer.Actions>
      </Fieldset.Footer>
    </Fieldset>
  );
}
