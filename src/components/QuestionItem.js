import React from "react";

function QuestionItem(props) {
  const { question, onDelete } = props;

  return (
    React.createElement("div", { className: "question-item" },
      React.createElement("h3", null, question.question),
      React.createElement("ul", null,
        question.options.map(function(opt, index) {
          return React.createElement("li", { key: index }, opt);
        })
      ),
      React.createElement("p", null, "Đáp án: " + question.answer),
      React.createElement("button", { onClick: function() { onDelete(question.id); } }, "Xóa")
    )
  );
}

export default QuestionItem;
