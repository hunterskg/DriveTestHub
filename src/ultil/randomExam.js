export function generateRandomExam(questionBank, userId) {
  const criticalQuestions = questionBank.filter(q => q.isCritical);
  const normalQuestions = questionBank.filter(q => !q.isCritical);

  // ✅ chọn 1 câu điểm liệt
  const critical = criticalQuestions[Math.floor(Math.random() * criticalQuestions.length)];

  // ✅ chọn 24 câu còn lại
  const shuffled = normalQuestions.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 24);

  const finalQuestions = [critical, ...selected].sort(() => 0.5 - Math.random());

  return {
    id: Date.now().toString(),
    examId: null, 
    userId: userId,
    title: "Tự luyện 25 câu",
    score: 0,
    correctCount: 0,
    totalQuestion: 25,
    takeAt: new Date().toLocaleString(),
    endedAt: "",
    passStatus: false,
    questions: finalQuestions.map(q => ({
      ...q,
      selectedAnswer: "",
      isCorrect: false
    }))
  };
}
