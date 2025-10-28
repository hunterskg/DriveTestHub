import React, { useState } from "react";
import api from "../api/axiosClient";

function AddQuestionForm({ onAdded }) {
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newQuestion = {
      question: question,
      options: [option1, option2, option3],
      answer: answer
    };

    try {
      const res = await api.post("/questions", newQuestion);
      onAdded(res.data);
      setQuestion("");
      setOption1("");
      setOption2("");
      setOption3("");
      setAnswer("");
    } catch (err) {
      console.error("Lỗi khi thêm câu hỏi:", err);
    }
  };

  return (
    React.createElement("form", { onSubmit: handleSubmit, style: { marginBottom: "20px" } },
      React.createElement("h3", null, "Thêm câu hỏi mới"),
      React.createElement("input", { type: "text", placeholder: "Câu hỏi", value: question, onChange: e => setQuestion(e.target.value) }),
      React.createElement("input", { type: "text", placeholder: "Đáp án 1", value: option1, onChange: e => setOption1(e.target.value) }),
      React.createElement("input", { type: "text", placeholder: "Đáp án 2", value: option2, onChange: e => setOption2(e.target.value) }),
      React.createElement("input", { type: "text", placeholder: "Đáp án 3", value: option3, onChange: e => setOption3(e.target.value) }),
      React.createElement("input", { type: "text", placeholder: "Đáp án đúng", value: answer, onChange: e => setAnswer(e.target.value) }),
      React.createElement("button", { type: "submit" }, "Thêm")
    )
  );
}

export default AddQuestionForm;
