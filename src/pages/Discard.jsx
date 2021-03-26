import React, { useEffect } from "react";
import { useState } from "react";
import { firestore } from "../firebase/firebase.utils"

const Discard = ({ user }) => {
  const [result, setResult] = useState([])

  const fetchDiscarded = async () => {
    if (user) {

      const queRef = firestore.collection("discarded")
      const snapShot = await  queRef.where("draftedBy", "==", user.id).get()

      if (snapShot.empty) {
        console.log("No discarded questios found")
      } else {
        let ques = []
        snapShot.forEach(que => {
          console.log(que.data())
          ques.push(que.data())
        })
        setResult(ques)
      }
    }
  }

  useEffect(() => {
    fetchDiscarded()    
  }, [user])

  return (
    <div>
      {
        result.length ? (
          result.map(que => (
            <div key={que.hash}>
              <h1>{que.title}</h1>
              <h2>Options:</h2>
              {
                que.options.map((opt, index) => (
                  <h3>Option {index + 1}: {opt}</h3>
                ))
              }
              <h5>Category: {que.category}</h5>
              <h5>Answer: {que.answer}</h5>
            </div>
          ))
        ) : (
          <div>
            <h1>No Discarded Question</h1>
          </div>
        )
      }
    </div>
  )
}

export default Discard
