import type { Question } from "./types"

export const quizId = "general-1"

export const questions: Question[] = [
  {
    id: 1,
    text: "Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    correctIndex: 3,
  },
  {
    id: 2,
    text: "What does CSS stand for?",
    options: ["Central Style Sheets", "Cascading Style Sheets", "Cascading Simple Sheets", "Cars SUVs Sailboats"],
    correctIndex: 1,
  },
  {
    id: 3,
    text: "What does HTML stand for?",
    options: [
      "Hypertext Markup Language",
      "Hyper Trainer Marking Language",
      "Hypertext Marketing Language",
      "Hyper Text Markup Leveler",
    ],
    correctIndex: 0,
  },
  {
    id: 4,
    text: "What year was JavaScript launched?",
    options: ["1996", "1995", "1994", "None of the above"],
    correctIndex: 1,
  },
  {
    id: 5,
    text: "Which company developed React?",
    options: ["Google", "Microsoft", "Facebook", "Twitter"],
    correctIndex: 2,
  },
]
