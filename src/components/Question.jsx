import React, { useState } from "react";
import { Card, Button, Alert, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

import { firestore } from "../firebase/firebase.utils";

import "../styles.css";

export default function Question({
  questionData,
  user,
  quiz,
  type,
  publishUpdate,
}) {
  const [questions, setQuestions] = useState(questionData);
  const [publishBanner, setPublishBanner] = useState(false);
  const [discardBanner, setDiscardBanner] = useState(false);

  const publish = (quiz, id, adminId, question) => {
    const data = {
      ...question,
      publishedBy: adminId,
      publishDate: new Date().toLocaleString(),
    };
    firestore
      .collection("questions")
      .doc(quiz)
      .collection("PUBLISHED")
      .doc(id)
      .set(data)
      .then(() => {
        firestore
          .collection("questions")
          .doc(quiz)
          .collection("DRAFT")
          .doc(id)
          .delete()
          .then(() => {
            setQuestions(questions.filter((question) => question.id !== id));
            setPublishBanner(true);
            setTimeout(() => {
              setPublishBanner(false);
            }, 4000);
          })
          .then(() => {
            publishUpdate(quiz, data);
          });
      });
  };

  const discard = (quiz, id, type, que) => {
    // * Remove from hash values
    firestore.collection("hashValues").doc(id).delete()

    // * Add discarded question to database
    firestore.collection("discarded").doc().set(que).then((res) => {
      console.log(res)
    })



    firestore
      .collection("questions")
      .doc(quiz)
      .collection(type)
      .doc(id)
      .delete()
      .then(() => {
        setQuestions(questions.filter((question) => question.id !== id));
        setDiscardBanner(true);
        setTimeout(() => {
          setDiscardBanner(false);
        }, 4000);
      });
  };

  return (
    <div>
      {publishBanner ? (
        <Alert variant="success">The Question has been published</Alert>
      ) : null}
      {discardBanner ? (
        <Alert variant="danger">The Question has been removed</Alert>
      ) : null}

      {questions.length > 0 ? (
        <div>
          {questions.map((que) => (
            <Card key={que.id} style={{ marginTop: "2rem" }}>
              <Card.Body>
                <Card.Header as="h5">{que.title}</Card.Header>
                <Card.Text>
                  Region: {que.region === "" ? "Global" : que.region}
                </Card.Text>
                {que.imageURL !== "" ? (
                  <Image
                    alt="Question"
                    src={que.imageURL}
                    thumbnail
                    style={{ width: "360px", height: "360px" }}
                  />
                ) : null}
                <Card.Text>ImageURL: {que.imageURL}</Card.Text>
                {que.options.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    {que.options.map((opt, index) => (
                      <Card.Text
                        style={{
                          width: "40%",
                          backgroundColor: "#DAE0E2",
                          padding: "2px",
                        }}
                        key={index}
                      >
                        Option {index + 1}: {opt}
                      </Card.Text>
                    ))}
                  </div>
                ) : (
                  <Card.Text>No Option Available</Card.Text>
                )}
                <Card.Title>Answer: {que.answer}</Card.Title>
                {type === "DRAFT" ? (
                  <Button
                    variant="success"
                    onClick={() => publish(quiz, que.id, user.id, que)}
                    style={{ marginRight: "30px" }}
                  >
                    Publish
                  </Button>
                ) : null}
                <Button
                  variant="danger"
                  onClick={() => discard(quiz, que.id, type, que)}
                  style={{ marginRight: "30px" }}
                >
                  Discard
                </Button>
                <Link
                  to={{
                    pathname: "/edit/" + que.id,
                    state: {
                      category: quiz,
                      type: type,
                    },
                  }}
                >
                  <Button variant="primary">Edit</Button>
                </Link>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <div className="no-questions">
          <h1>No Questions in this category</h1>
        </div>
      )}
    </div>
  );
}
