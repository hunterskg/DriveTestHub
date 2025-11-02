import React, { useEffect, useState } from "react";
import api from "../api/axiosClient";
import QuestionItem from "./QuestionItem";

function QuestionList() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/questions");
        setQuestions(res.data);
      } catch (err) {
        console.error("Lỗi tải câu hỏi:", err);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/questions/${id}`);
      setQuestions(questions.filter(q => q.id !== id));
    } catch (err) {
      console.error("Lỗi khi xóa câu hỏi:", err);
    }
  };

  return (
    React.createElement("div", null,
      React.createElement("h2", null, "Danh sách câu hỏi"),
      questions.map(q =>
        React.createElement(QuestionItem, { key: q.id, question: q, onDelete: handleDelete })
      )
    )
  );
}

export default QuestionList;
