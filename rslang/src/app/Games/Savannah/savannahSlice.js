import axios from 'axios'
import {createSlice} from '@reduxjs/toolkit'
import {calculatePercentResult, shuffle, getRandomAnswers} from '../../../functions/math'

export const savannahSlice = createSlice({
  name: 'savannahGame',
  initialState: {
    timer: 0,
    result: 0,
    loading: true,
    questionNumber: 0,
    quiz: [],
    start: false,
    statistics: null
  },
  reducers: {
    incrementTimer: state => {
      state.timer++
    },
    startGame: state => {
      state.start = true
    },
    startLoading: state => {
      state.loading = true
    },
    finishLoading: state => {
      state.loading = false
    },
    incrementQuestionNumber: state => {
      state.questionNumber++
    },
    setQuiz: (state, action) => {
      state.quiz = action.payload
    },
    nextRound: state => {
      if (state.questionNumber >= state.quiz.length - 1) {
        state.result = calculatePercentResult(state.quiz.filter(q => q.status).length, state.quiz.length)
        state.start = false
        state.statistics = true

        return
      }
      state.timer = 0
      document.getElementById('savannah-game-question').classList.remove('active')
      state.questionNumber++
      setTimeout(function () {
        document.getElementById('savannah-game-question').classList.add('active')
      }, 50);
    },
    setAnswer: (state, action) => {
      if (state.quiz[action.payload.questionNumber].rightAnswer === action.payload.answer) {
        state.quiz[action.payload.questionNumber].status = true
      }
    },
    restartGame: state => {
      state.timer = 0
      state.questionNumber = 0
      state.statistics = null
      state.start = true
    }
  },
});

export const selectTimer = state => state.savannahGame.timer;
export const selectResult = state => state.savannahGame.result;
export const selectLoading = state => state.savannahGame.loading;
export const selectQuestionNumber = state => state.savannahGame.questionNumber;
export const selectQuiz = state => state.savannahGame.quiz;
export const selectStart = state => state.savannahGame.start;
export const selectStatistics = state => state.savannahGame.statistics;

export const {
  incrementTimer,
  startLoading,
  finishLoading,
  incrementQuestionNumber,
  setQuiz,
  nextRound,
  setAnswer,
  startGame,
  restartGame
} = savannahSlice.actions;

export const fetchWordsForQuiz = (url) => async dispatch => {
  try {
    dispatch(startLoading())
    const fetchedData = await axios.get(url);
    const words = fetchedData.data;
    const answerVariations = words.map(word => word.wordTranslate)
    shuffle(words)
    const quizWords = words.slice(0, 5)
    const quizPrepare = []
    quizWords.forEach((word, index) => {
      quizPrepare.push({
        id: index + 1,
        question: word.word,
        answers: getRandomAnswers(word.wordTranslate, answerVariations),
        rightAnswer: word.wordTranslate,
        status: false
      })
    })
    dispatch(setQuiz(quizPrepare))
    dispatch(finishLoading())
  } catch (e) {
    console.log(e)
  }
}

export default savannahSlice.reducer;
