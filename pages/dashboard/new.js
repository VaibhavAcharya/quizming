import {
  Badge,
  Button,
  Card,
  Code,
  Divider,
  Input,
  Row,
  Select,
  Spacer,
  Text,
  useToasts,
} from "@geist-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

import firebase from "./../../lib/firebase";

import useUser from "../../components/firebase/useUser";

import Layout from "../../components/Layout";
import { MinusCircle, Plus, PlusSquare, Save, X } from "@geist-ui/react-icons";

export default function NewQuiz() {
  const Router = useRouter();
  const { user, initialized } = useUser();

  const [, setToasts] = useToasts();

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const addQuestion = useCallback(function () {
    setQuestions(function (questions) {
      return [
        ...questions,
        {
          id: questions.length + 1,
          label: "",
          answer: "1",
          options: [
            { id: 1, label: "" },
            { id: 2, label: "" },
          ],
        },
      ];
    });
  }, []);
  const deleteQuestion = useCallback(function (id) {
    setQuestions(function (questions) {
      return questions
        .filter(function (question) {
          return question.id !== id;
        })
        .map(function (question, index) {
          return { ...question, id: index + 1 };
        });
    });
  }, []);
  const mutateQuestion = useCallback(function (id, field, value, optionId) {
    setQuestions(function (questions) {
      return questions.map(function (question) {
        if (question.id === id) {
          if (optionId) {
            return {
              ...question,
              options: [
                ...question.options.map(function (option) {
                  if (option.id === optionId) {
                    return { ...option, [field]: value };
                  }

                  return option;
                }),
              ],
            };
          } else {
            return { ...question, [field]: value };
          }
        }

        return question;
      });
    });
  }, []);

  const addOption = useCallback(function (id) {
    setQuestions(function (questions) {
      return questions.map(function (question) {
        if (question.id === id) {
          return {
            ...question,
            options: [
              ...question.options,
              { id: question.options.length + 1, label: "" },
            ],
          };
        }

        return question;
      });
    });
  }, []);

  const removeOption = useCallback(function (id, optionId) {
    setQuestions(function (questions) {
      return questions.map(function (question) {
        if (question.id === id) {
          return {
            ...question,
            options: question.options
              .filter(function (option) {
                return option.id !== optionId;
              })
              .map(function (option, index) {
                return { ...option, id: index + 1 };
              }),
          };
        }

        return question;
      });
    });
  }, []);

  function save() {
    function setErrorToast(text) {
      setToasts({ text, type: "error" });
      setIsSaving(false);
    }
    function isNotNull(string) {
      return string && string.length >= 1;
    }

    setIsSaving(true);

    if (isNotNull(title)) {
      let ok = true;
      questions.map(function (question) {
        if (isNotNull(question.label)) {
          const labels = question.options.map(function (option) {
            return option.label;
          });
          if (labels.length !== labels.filter(Boolean).length) {
            ok = false;
            setErrorToast(
              `Please check for empty options in Q. ${question.id}!`
            );
          }
        } else {
          ok = false;
          setErrorToast(`Please specify a title in Q. ${question.id}!`);
        }
      });

      if (ok) {
        firebase
          .firestore()
          .collection("quizzes")
          .doc()
          .set({
            title,
            userId: user.uid,
            status: "draft",
            questions: questions,
          })
          .then(function () {
            console.log("Ran Save - then!");
            Router.push("/dashboard");
          })
          .catch(function (e) {
            setErrorToast(`Unexpected error happened!`);
          });
      }
    } else {
      setErrorToast("Please specify a title!");
    }
  }

  useEffect(
    function () {
      if (questions.length === 0) {
        addQuestion();
      }
    },
    [questions.length]
  );

  if (initialized && !user) {
    Router.push("/");
  }

  return (
    <Layout>
      <Input
        size="large"
        width="100%"
        placeholder="Eg. Test 3"
        value={title}
        onChange={function ({ target }) {
          setTitle(target.value);
        }}
      >
        Title
      </Input>
      <Spacer y={0.5} />
      <Row align="middle" justify="space-between">
        <Badge.Anchor>
          <Badge>{questions.length}</Badge>
          <Button auto icon={<Plus />} onClick={addQuestion}>
            Add Question
          </Button>
        </Badge.Anchor>
        <Button
          auto
          icon={<Save />}
          type="success"
          onClick={save}
          loading={!initialized || isSaving}
        >
          Save
        </Button>
      </Row>
      <Divider />
      {questions.map(function (question) {
        return (
          <Card style={{ marginBottom: "2vh" }} key={question.id}>
            <Row align="middle" justify="space-between">
              <Text span>
                Question <Code>{question.id}</Code>
              </Text>
              <Button
                auto
                size="mini"
                type="error"
                icon={<X />}
                disabled={question.id <= 1}
                onClick={function () {
                  deleteQuestion(question.id);
                }}
              />
            </Row>
            <Spacer y={0.5} />
            <Input
              width="100%"
              placeholder="Eg. What is xyz?"
              value={question.label}
              onChange={function ({ target }) {
                mutateQuestion(question.id, "label", target.value);
              }}
            />
            <Divider>Options</Divider>
            {question.options.map(function (option) {
              return (
                <div key={option.id}>
                  <Input
                    label={option.id}
                    placeholder={`Option ${option.id}`}
                    value={option.label}
                    onChange={function ({ target }) {
                      mutateQuestion(
                        question.id,
                        "label",
                        target.value,
                        option.id
                      );
                    }}
                    {...(option.id > 2
                      ? {
                          iconClickable: true,
                          iconRight: <MinusCircle color="red" />,
                          onIconClick: function () {
                            removeOption(question.id, option.id);
                          },
                        }
                      : {})}
                  />
                  <Spacer y={0.5} />
                </div>
              );
            })}
            {question.options.length < 4 && (
              <Button
                auto
                size="mini"
                icon={<PlusSquare />}
                onClick={function () {
                  addOption(question.id);
                }}
              >
                Add Option
              </Button>
            )}
            <Divider align="start" type="success">
              Correct Option
            </Divider>
            <Select
              initialValue="1"
              value={question.answer}
              onChange={function (value) {
                mutateQuestion(question.id, "answer", value);
              }}
            >
              {question.options.map(function (option) {
                return (
                  <Select.Option value={String(option.id)} key={option.id}>
                    {option.id}
                  </Select.Option>
                );
              })}
            </Select>
          </Card>
        );
      })}
    </Layout>
  );
}
