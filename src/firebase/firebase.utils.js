import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
  // Raj
  // apiKey: "AIzaSyCFbL0TgE7t5q4L4AAJkddkRlmNksp7kiY",
  // authDomain: "quizzy-a4b01.firebaseapp.com",
  // databaseURL: "https://quizzy-a4b01.firebaseio.com",
  // projectId: "quizzy-a4b01",
  // storageBucket: "quizzy-a4b01.appspot.com",
  // messagingSenderId: "516961689040",
  // appId: "1:516961689040:web:ea13bc2c5e355c782aedd5",

  // Jainam
  apiKey: "AIzaSyBDT6qId0fkjHs0GBJ1C7IDg1MHf4GlGm8",
  authDomain: "quiz-3c2c4.firebaseapp.com",
  databaseURL: "https://quiz-3c2c4.firebaseio.com",
  projectId: "quiz-3c2c4",
  storageBucket: "quiz-3c2c4.appspot.com",
  messagingSenderId: "1024794887863",
  appId: "1:1024794887863:web:8ed7e02c1e65fa0cbc6f32",
  measurementId: "G-V2CS5QH65W",

  // Dont know
  // apiKey: "AIzaSyBVYcsun2KfZJQgp2cNxFDJS-bsdaUC27c",
  // authDomain: "quiz-app-5936e.firebaseapp.com",
  // databaseURL: "https://quiz-app-5936e.firebaseio.com",
  // projectId: "quiz-app-5936e",
  // storageBucket: "quiz-app-5936e.appspot.com",
  // messagingSenderId: "122226138135",
  // appId: "1:122226138135:web:3e9fcdf290a432101b9052",
  // measurementId: "G-YGZTYYWD47"
};

firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();

export const storage = firebase.storage();

export const addQuestionToFirestore = async (data, quiz) => {
  const questionRef = await firestore
    .collection("questions")
    .doc(quiz)
    .collection("DRAFT")
    .doc()
    .set(data);
  // console.log(questionRef);
};

export const loginWithFirestore = async (role, email, password) => {
  const userRef = await firestore.collection(role).get();
  let response = {};
  userRef.forEach((doc) => {
    if (doc.data().email === email && doc.data().password === password) {
      response.status = "SUCCESS";
      response.data = {
        email,
        role,
        id: doc.id,
      };
    }
  });

  return response;
};

export const checkForAuth = async (role, id) => {
  const userRef = await firestore.collection(role).doc(id).get();
  let response = {};
  if (userRef.exists) {
    response.status = "SUCCESS";
    response.data = {
      email: userRef.data().email,
      id,
      role,
    };
  }
  return response;
};

export const getDraftQuestions = async () => {
  const responseQuestions = [];
  const questionsRef = firestore.collection("questions");
  const questionsRefData = await questionsRef.get();
  // console.log(questionsRefData);
  const snapshot = await firebase.firestore().collection("questions").get();
  // console.log(snapshot.docs);

  questionsRefData.docs.forEach(async (doc) => {
    const questionsData = await questionsRef
      .doc(doc.id)
      .collection("DRAFT")
      .get();
    const questions = [];

    questionsData.forEach(async (question) => {
      const data = question.data();
      questions.push({
        id: question.id,
        ...data,
      });
    });
    responseQuestions.push({
      category: doc.id,
      questions,
    });
  });
  return responseQuestions;
};
