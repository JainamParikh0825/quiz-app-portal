import React, { useState, useEffect } from "react";
import { Tab, Row, Nav, Col } from "react-bootstrap";
import { firestore, getDraftQuestions } from "../firebase/firebase.utils";
import CategoryQuestions from "../components/CategoryQuestions";
import { Questions } from "../components/Questions";
import "../styles.css";

export default function Verify({ user }) {
  Questions();
  const [publishQuestions, setPublishQuestions] = useState(null);
  const [discardQuestions, setDiscardQuestions] = useState(null);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    const data = await getDraftQuestions();
    const user = await firestore.collection("que-user").get();
    user.docs.forEach((doc) => {
      // console.log(doc.data());
    });
    // console.log(data);
  };

  useEffect(() => {
    getData();
    if (user) {
      let unpublished = [];
      firestore
        .collection("questions")
        .get()
        .then((querySnapshot) => {
          querySnapshot.docs.forEach((doc) => {
            const questions = [];
            firestore
              .collection("questions")
              .doc(doc.id)
              .collection("DRAFT")
              .get()
              .then((ques) => {
                ques.forEach((question) => {
                  questions.push({
                    id: question.id,
                    ...question.data(),
                  });
                });
              });
            unpublished.push({
              category: doc.id,
              questions,
            });
          });
        })
        .then(() => {
          setDiscardQuestions(unpublished);
        });
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "admin") {
      let published = [];
      firestore
        .collection("questions")
        .get()
        .then((querySnapshot) => {
          querySnapshot.docs.forEach((doc) => {
            const questions = [];
            firestore
              .collection("questions")
              .doc(doc.id)
              .collection("PUBLISHED")
              .get()
              .then((ques) => {
                ques.forEach((question) => {
                  questions.push({
                    id: question.id,
                    ...question.data(),
                  });
                });
              });
            published.push({
              category: doc.id,
              questions,
            });
          });
        })
        .then(() => {
          setPublishQuestions(published);
        });
    }
  }, [user]);

  useEffect(() => {
    if (publishQuestions && setDiscardQuestions) {
      setLoading(false);
    }
  }, [publishQuestions, discardQuestions]);

  const publishUpdate = (quiz, question) => {
    const updatedPublish = [...publishQuestions];
    publishQuestions.map((cat) => {
      if (cat.category === quiz) {
        cat.questions.unshift(question);
      }
      return null;
    });

    setPublishQuestions(updatedPublish);
  };

  return (
    <div style={{ padding: "10px" }}>
      {!user ? (
        <h1>Please login to Verify</h1>
      ) : user.role === "que-user" ? (
        <h1>Only Admin can publish question</h1>
      ) : user.role === "admin" && !loading ? (
        <Tab.Container id="left-tabs-example" defaultActiveKey="unpublished">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="unpublished">Unpublished</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="published">Published</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="unpublished">
                  <CategoryQuestions
                    publishUpdate={publishUpdate}
                    questions={discardQuestions}
                    user={user}
                    type="DRAFT"
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="published">
                  <CategoryQuestions
                    questions={publishQuestions}
                    user={user}
                    type="PUBLISHED"
                  />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      ) : (
        // <h1>Loading Please wait</h1>
        <div className="spinner">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden"></span>
          </div>
        </div>
      )}
    </div>
  );
}
