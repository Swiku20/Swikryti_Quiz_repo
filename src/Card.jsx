import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

const questions = [
  { question: "Which is the largest flower in the world?", options: ["Sunflower", "Rafflesia", "Orchid", "Hibiscus"], answer: "Rafflesia" },
  { question: "Which language runs in the browser?", options: ["Java", "C", "Python", "JavaScript"], answer: "JavaScript" },
  { question: "What does CSS stand for?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], answer: "Cascading Style Sheets" },
  { question: "What is the capital of South Korea?", options: ["Riyadh", "Seoul", "Tokyo", "Madrid"], answer: "Seoul" },
  { question: "What is 22/11?", options: ["2", "8", "12", "0"], answer: "2" },
  { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "Mars" },
  { question: "What is the largest ocean on Earth?", options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], answer: "Pacific Ocean" },
  { question: "Who wrote 'Oliver Twist'?", options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], answer: "Charles Dickens" },
  { question: "What is the chemical formula of Sodium Chloride?", options: ["O2", "CO2", "H2O", "NaCl"], answer: "NaCl" },
  { question: "How many bones are there in a human adult?", options: ["200", "206", "204", "250"], answer: "206" }
];

export default function QuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState({});

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((prev) => Math.max(prev - 1, 0)), 1000);
    if (timeLeft === 0 && !showFeedback) handleSubmitAnswer();
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSubmitAnswer = () => {
    const correctAnswer = questions[currentQuestion].answer;
    let feedback;

    if (!selectedOption) {
      feedback = { selectedOption: null, correctAnswer, isCorrect: false, message: "Oops! The answer is unmarked." };
    } else if (selectedOption === correctAnswer) {
      setScore((prev) => prev + 1);
      feedback = { selectedOption, correctAnswer, isCorrect: true, message: "Correct! 🎉" };
    } else {
      feedback = { selectedOption, correctAnswer, isCorrect: false, message: "Incorrect! ❌" };
    }

    setAnsweredQuestions({
      ...answeredQuestions,
      [currentQuestion]: feedback
    });

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setTimeLeft(15);
    } else {
      setShowResult(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setShowFeedback(false);
    setTimeLeft(15);
    setSelectedOption(null);
    setAnsweredQuestions({});
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-r from-pink-500 to-white-500 p-4 md:p-10 text-white w-full">
      <header className="text-3xl md:text-4xl font-bold mb-6 text-center">Quiz Challenge 🎯</header>
      {showResult && score > 8 && <Confetti />}

      {showResult ? (
        <motion.div
          className="bg-white text-black p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-lg font-semibold">Your score: {score} / {questions.length}</p>
          <p className={`text-lg mt-2 font-semibold ${score > 8 ? "text-green-500" : "text-yellow-500"}`}>
            {score > 8 ? "Well Done! 🎉" : "Needs Improvement."}
          </p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg" onClick={handleRestartQuiz}>Restart Quiz</button>
        </motion.div>
      ) : showFeedback ? (
        <motion.div
          className="bg-white text-black p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Answer Feedback</h2>
          <p className={`text-lg font-semibold ${answeredQuestions[currentQuestion].isCorrect ? "text-green-500" : "text-red-500"}`}>
            {answeredQuestions[currentQuestion].message}
          </p>
          <p className="mt-2 text-lg">Correct Answer: <strong>{answeredQuestions[currentQuestion].correctAnswer}</strong></p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg" onClick={handleNextQuestion}>Next Question</button>
        </motion.div>
      ) : (
        <motion.div
          className="bg-white text-black p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-2 right-4 text-red-600 font-bold text-lg">⏳ {timeLeft}s</div>
          <h2 className="text-lg font-semibold mb-4">{questions[currentQuestion].question}</h2>
          <div className="grid grid-cols-1 gap-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className={`p-3 rounded-lg border ${selectedOption === option ? 'bg-green-500 text-white' : 'bg-blue-700 text-white hover:bg-blue-800'}`}
                onClick={() => setSelectedOption(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
            onClick={handleSubmitAnswer}
            disabled={!selectedOption}
          >
            Submit Answer
          </button>
        </motion.div>
      )}

      <footer className="text-center text-black-200 mt-6 italic">“Testing oneself is the best way to learn"</footer>
    </div>
  );
}
