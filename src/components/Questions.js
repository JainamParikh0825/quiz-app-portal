// import React, { useEffect, useState } from "react";
import { firestore } from "../firebase/firebase.utils";

export const Questions = () => {
  firestore
    .collection("questions")
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        // const questions = [];
        firestore
          .collection("questions")
          .doc(doc.id)
          .collection("PUBLISHED")
          .get()
          .then((ques) => {
            ques.forEach((q) => console.log(q.data()));
          });
      });
    });
};
