import React, { useEffect, useState } from "react";
import { CountryDropdown } from "react-country-region-selector";
import { Form, Button, Alert } from "react-bootstrap";

import { firestore, storage } from "../firebase/firebase.utils";

export default function EditQuestion({ category, type, id }) {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState(null);
  const [title, setTitle] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [image, setImage] = useState(null);
  const [region, setRegion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [mcq, setMcq] = useState(false);
  const [data, setData] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (category && id && type) {
      firestore
        .collection("questions")
        .doc(category)
        .collection(type)
        .doc(id)
        .get()
        .then((snapshot) => {
          const data = snapshot.data();
          const { options, title, answer, imageURL, region } = data;
          setData(data);
          setImageURL(imageURL);
          setOptions(options);
          setTitle(title);
          setAnswer(answer);
          setRegion(region);
          setMcq(options.length > 0 ? true : false);
        })
        .then(() => {
          setLoading(false);
        });
    }
  }, [id, category, type]);

  const handleChange = (e) => {
    if (e.target.files[0]) {
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
              setImageURL(url);
            });
        }
      );
    }
  };

  const updateOptions = (e, index) => {
    const newArr = [...options];
    newArr[index] = e.target.value;
    setOptions(newArr);
  };

  const handleUpdate = (e) => {
    setUpdating(true);
    e.preventDefault();
    firestore
      .collection("questions")
      .doc(category)
      .collection(type)
      .doc(id)
      .update({
        ...data,
        options,
        imageURL,
        title,
        answer,
        region,
      })
      .then(() => {
        setShowBanner(true);
        setUpdating(false);
        setTimeout(() => {
          setShowBanner(false);
        }, 3000);
      });
  };

  return (
    <div className="add">
      {loading ? (
        <h1>Loading Please wait ...</h1>
      ) : (
        <>
          {showBanner ? (
            <Alert variant="success">Question has been been Updated.</Alert>
          ) : null}
          <Form onSubmit={handleUpdate}>
            <Form.Group>
              <Form.Label>Region</Form.Label>
              <CountryDropdown
                style={{
                  width: "100%",
                  margin: "20px 0 0 0",
                  border: "3px solid blue",
                }}
                value={region}
                onChange={(val) => setRegion(val)}
              />
              <br />
            </Form.Group>
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
            {mcq
              ? options.map((opt, index) => (
                  <Form.Group key={index}>
                    <Form.Label>Option {index + 1}</Form.Label>
                    <Form.Control
                      type="text"
                      name={opt.name}
                      placeholder="Enter option"
                      value={opt}
                      onChange={(e) => updateOptions(e, index)}
                      required
                    />
                  </Form.Group>
                ))
              : null}
            <Form.Group>
              <Form.Label>Answer</Form.Label>
              {!mcq ? (
                <Form.Control
                  type="text"
                  placeholder="Enter Answer of this Question in text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                />
              ) : (
                <Form.Control
                  as="select"
                  required
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                  }}
                >
                  {options.map((opt, index) => (
                    <option key={index} value={opt}>
                      Option {index + 1}
                    </option>
                  ))}
                </Form.Control>
              )}
            </Form.Group>
            {imageURL ? (
              <img
                src={imageURL}
                alt="Question"
                style={{ maxWidth: "100%" }}
                width={400}
                height={300}
              />
            ) : (
              <h2 body>No Image for this question</h2>
            )}
            <Form.Group>
              <Form.Label>Upload Image {mcq ? "(Optonal)" : null}</Form.Label>
              <div className="image-upload">
                <input
                  type="file"
                  name="myImage"
                  accept="image/x-png,image/gif,image/jpeg"
                  onChange={handleChange}
                  required={mcq ? false : imageURL ? false : true}
                />
                <div className="image-button">
                  <Button
                    style={{ marginRight: "10px" }}
                    variant="primary"
                    onClick={handleUpload}
                    className="waves-effect waves-light btn"
                  >
                    {imageURL ? "Update Image" : "Add Image"}
                  </Button>
                  {imageURL && mcq ? (
                    <Button variant="danger" onClick={() => setImageURL(null)}>
                      Remove Image
                    </Button>
                  ) : null}
                </div>
              </div>
            </Form.Group>
            <div style={{ textAlign: "center" }}>
              <Button type="submit" variant="primary">
                {updating ? "Updating" : "Update"} Question
              </Button>
            </div>
          </Form>
        </>
      )}
    </div>
  );
}
