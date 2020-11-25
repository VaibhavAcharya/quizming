import { Table } from "@geist-ui/react";

export default function QuizResult({ quiz }) {
  let rank = 1;
  let data = quiz.candidates
    ?.map((candidate) => {
      let score = 0;
      candidate.answers.map((answer) => {
        if (
          quiz.questions.find((question) => question.id === answer.id)
            .answer === answer.choice
        ) {
          score = score + 1;
        }
      });
      return {
        name: candidate.name,
        email: candidate.email,
        class: candidate.classification,
        score: String(score),
      };
    })
    .sort((a, b) => Number(b.score) - Number(a.score))
    .map((candidate) => {
      let toReturn = { ...candidate, rank: rank };
      rank = rank + 1;
      return toReturn;
    });

  return (
    <>
      {!quiz.candidates ? (
        "No one showed up for quiz."
      ) : (
        <div style={{ overflowY: "auto" }}>
          <Table data={data}>
            <Table.Column prop="rank" label="Rank" />
            <Table.Column prop="name" label="Name" />
            <Table.Column prop="score" label="Score" />
            <Table.Column prop="class" label="Classification" />
            <Table.Column prop="email" label="Email" />
          </Table>
        </div>
      )}
    </>
  );
}
