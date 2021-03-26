import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";

import Question from "./Question";

export default function CategoryQuestions({
  questions,
  user,
  type,
  publishUpdate,
}) {
  const [key, setKey] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(questions);
  }, [questions]);

  return (
    <>
      {data
        ? (
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
          >
            {data.map((category, index) => (
              <Tab
                eventKey={category.category}
                title={category.category}
                key={index}
              >
                <Question
                  publishUpdate={publishUpdate}
                  questionData={category.questions}
                  quiz={category.category}
                  user={user}
                  type={type}
                />
              </Tab>
            ))}
          </Tabs>
        )
        : null}
    </>
  );
}
