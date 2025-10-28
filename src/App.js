import React, { useState } from "react";
import QuestionList from "./components/QuestionList";
import AddQuestionForm from "./components/AddQuestionForm";

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleAdded = () => setRefresh(!refresh);

  return (
    React.createElement("div", { className: "App", style: { padding: "20px" } },
      React.createElement("h1", null, "DriveTestHub - Ôn thi bằng lái xe"),
      React.createElement(AddQuestionForm, { onAdded: handleAdded }),
      React.createElement(QuestionList, { key: refresh })
    )
  );
}

export default App;
