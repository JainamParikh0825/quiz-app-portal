import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { CountryDropdown } from "react-country-region-selector";
import { storage, firestore } from "../firebase/firebase.utils";
import { addQuestionToFirestore } from "../firebase/firebase.utils";
import hash from "object-hash";
import "../styles.css";

export default function Add({ user }) {
  const initCategoryValue = [
    { id: 1, value: "Science And Technology", isChecked: false },
    { id: 2, value: "General Culture", isChecked: false },
    { id: 3, value: "History", isChecked: false },
    { id: 4, value: "Movie", isChecked: false },
  ];

  // console.log(user);

  const initOptionValue = [
    { id: 1, name: "option1", value: "" },
    { id: 2, name: "option2", value: "" },
    { id: 3, name: "option3", value: "" },
    { id: 4, name: "option4", value: "" },
  ];

  const [mcq, setMcq] = useState(true);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [answer, setAnswer] = useState("");
  const [categoryError, showCategoryError] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [region, setRegion] = useState("");
  const [message, setMessage] = useState("");

  const [optionValue, setOptionValue] = useState(initOptionValue);
  const [categories, setCategories] = useState(initCategoryValue);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImageUrl(null);
      const image = e.target.files[0];
      setImage(image);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (image !== null) {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          // Error function ...
          // console.log(error);
        },
        () => {
          // complete function ...
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              setImageUrl(url);
            });
        }
      );
    }
  };

  const handleCheck = (e) => {
    setCategories(
      categories.map((c) =>
        c.value === e.target.value ? { ...c, isChecked: !c.isChecked } : c
      )
    );
  };

  const handleOption = (e) => {
    setOptionValue(
      optionValue.map((opt) =>
        opt.name === e.target.name ? { ...opt, value: e.target.value } : opt
      )
    );
  };

  const handleSubmit = async (e) => {
    setShowError(false);
    e.preventDefault();
    showCategoryError(false);
    let categorySelected = [];
    categories.map((category) => {
      if (category.isChecked) {
        categorySelected.push(category.value);
      }
      return null;
    });

    if (categorySelected.length > 0) {
      let options = [];
      if (mcq) {
        optionValue.map((opt) => options.push(opt.value));
      }

      let data = {
        title,
        imageURL: imageUrl,
        options,
        answer: answer === "" ? optionValue[0].value : answer,
        createdBy: user.id,
        creationDate: new Date().toLocaleString(),
        publishedBy: null,
        publishDate: null,
        region,
        addedBy: user.email,
      };

      const hashValue = hash({ title, optionValue });
      // console.log(hashValue);

      firestore
        .collection("hashValues")
        .where("hash", "==", hashValue)
        .get()
        .then((snapshot) => {
          console.log(snapshot.docs.length);
          if (snapshot.docs.length !== 1) {
            firestore
              .collection("hashValues")
              .doc(hashValue)
              .set({
                hash: hashValue,
              })
              .then((doc) => {
                console.log(doc);
              });
            categorySelected.map(async (category) => {
              addQuestionToFirestore(data, category)
                .then(() => {
                  setShowSuccessMsg(true);
                  setMessage("Added to Database");
                  setTimeout(() => {
                    setShowSuccessMsg(false);
                  }, 10000);
                  setOptionValue(initOptionValue);
                  setCategories(initCategoryValue);
                  setAnswer("");
                  setTitle("");
                  setImageUrl("");
                  setRegion("");
                  setImage(null);
                  window.scrollTo(0, 0);
                })
                .catch((err) => {
                  setTimeout(() => {
                    setShowError(false);
                  }, 10000);
                  window.scrollTo(0, 0);
                });
            });
          } else {
            setShowSuccessMsg(true);
            setMessage("Already in the database");
          }
        });
    } else {
      showCategoryError(true);
    }
  };

  return (
    <div className="add">
      {!user ? (
        <h1 className="logout">Please Login to Add Questions</h1>
      ) : (
        <>
          {user.role === "admin" ? (
            <>
              <h1>You are not privilege to add question</h1>
              <h3>Login as User</h3>
            </>
          ) : (
            <>
              {showSuccessMsg ? (
                <Alert variant="success">{message}</Alert>
              ) : null}
              {showError ? (
                <Alert variant="danger">
                  Something Went Wrong. Please try Again.
                </Alert>
              ) : null}
              <Form onSubmit={handleSubmit}>
                <CountryDropdown
                  style={{
                    width: "100%",
                    margin: "20px 0",
                    border: "3px solid blue",
                  }}
                  value={region}
                  onChange={(val) => setRegion(val)}
                />
                <br />
                <Form.Label variant="h1">Categories</Form.Label>
                <Form.Group
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-evenly",
                  }}
                >
                  {categories.map((category) => (
                    <Form.Check
                      className="cat-check"
                      onChange={handleCheck}
                      key={category.id}
                      checked={category.isChecked}
                      value={category.value}
                      label={category.value}
                    />
                  ))}
                </Form.Group>
                <div style={{ textAlign: "center" }}>
                  <Button
                    variant={mcq ? "outline-primary" : "primary"}
                    onClick={() => setMcq(!mcq)}
                    style={{ margin: "20px 0", outline: "none" }}
                  >
                    {mcq
                      ? "Change to Image Based Question"
                      : "Change to MCQ Based Question"}
                  </Button>
                </div>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>
                {mcq ? (
                  <>
                    {optionValue.map((opt) => (
                      <Form.Group key={opt.id}>
                        <Form.Label>Option {opt.id}</Form.Label>
                        <Form.Control
                          type="text"
                          name={opt.name}
                          placeholder="Enter option"
                          value={opt.value}
                          onChange={handleOption}
                          required
                        />
                      </Form.Group>
                    ))}
                  </>
                ) : null}
                <Form.Group>
                  <Form.Label>Answer</Form.Label>
                  {mcq ? (
                    <Form.Control
                      as="select"
                      required
                      value={answer}
                      onChange={(e) => {
                        setAnswer(e.target.value);
                      }}
                    >
                      {optionValue.map((opt, index) => (
                        <option key={index} value={opt.value}>
                          {opt.name}
                        </option>
                      ))}
                    </Form.Control>
                  ) : (
                    <Form.Control
                      type="text"
                      placeholder="Enter Answer of this Question in text"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      required
                    />
                  )}
                  <Form.Text className="text-muted">
                    Please write the same text as in option for answer
                  </Form.Text>
                </Form.Group>
                <Form.Group>
                  <Form.Label>
                    Upload Image {mcq ? "(Optonal)" : null}
                  </Form.Label>
                  <div className="image-upload">
                    <input
                      type="file"
                      name="myImage"
                      accept="image/x-png,image/gif,image/jpeg"
                      onChange={handleChange}
                      required={mcq ? false : true}
                    />
                    <div className="image-button">
                      <Button
                        variant={imageUrl ? "success" : "primary"}
                        onClick={handleUpload}
                        className="waves-effect waves-light btn"
                      >
                        {imageUrl ? "Uploaded ✅" : "Upload"}
                      </Button>
                    </div>
                  </div>
                </Form.Group>
                <div style={{ textAlign: "center" }}>
                  <Button
                    type="submit"
                    variant="primary"
                    style={{ textAlign: "center" }}
                  >
                    Add Question
                  </Button>
                </div>
              </Form>
              {categoryError ? (
                <Alert variant="danger">Please select anyone category</Alert>
              ) : null}
            </>
          )}
        </>
      )}
    </div>
  );
}
