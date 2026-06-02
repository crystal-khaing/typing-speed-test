const WORD_LIST = [
  "the","be","to","of","and","a","in","that","have","it","for","not","on","with",
  "he","as","you","do","at","this","but","his","by","from","they","we","say","her",
  "she","or","an","will","my","one","all","would","there","their","what","so","up",
  "out","if","about","who","get","which","go","me","when","make","can","like","time",
  "no","just","him","know","take","people","into","year","your","good","some","could",
  "them","see","other","than","then","now","look","only","come","its","over","think",
  "also","back","after","use","two","how","our","work","first","well","way","even",
  "new","want","because","any","these","give","day","most","us","great","between",
  "need","large","often","hand","high","place","hold","turn","been","part","where",
  "much","through","long","down","still","own","life","few","north","open","seem",
  "together","next","white","children","begin","got","walk","example","ease","paper",
  "always","music","those","both","mark","book","letter","until","mile","river","car",
  "feet","care","second","enough","plain","girl","usual","young","ready","above","ever",
  "red","list","though","feel","talk","bird","soon","body","dog","family","direct","pose",
  "involve", "against", "display", "tumbler", "steam", "freshen", "tooth", "looking", "never"
]

const WORD_COUNT = 30

let words = []
let wordIndex = 0
let charIndex = 0
let typedWords = []
let currentInput = ""
let startTime = null
let finished = false
let totalCharsTyped = 0
let correctChars = 0

const wordsDisplay = document.getElementById("words-display")
const testScreen = document.getElementById("test-screen")
const resultScreen = document.getElementById("result-screen")
const finalWpm = document.getElementById("final-wpm")
const finalAccuracy = document.getElementById("final-accuracy")
const finalTime = document.getElementById("final-time")
const themeToggle = document.getElementById("theme-toggle")

function generateWords() {
  const shuffled = [...WORD_LIST].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, WORD_COUNT)
}

function renderWords() {
  wordsDisplay.innerHTML = ""
  words.forEach((word, wi) => {
    const wordEl = document.createElement("div")
    wordEl.classList.add("word")
    wordEl.dataset.index = wi
    word.split("").forEach((char, ci) => {
      const span = document.createElement("span")
      span.innerText = char
      span.dataset.ci = ci
      wordEl.appendChild(span)
    })
    wordsDisplay.appendChild(wordEl)
  })
  updateCursor()
}

function getWordEl(wi) {
  return wordsDisplay.querySelector(`.word[data-index="${wi}"]`)
}

function updateCursor() {
  document.querySelectorAll(".cursor-char").forEach(el => el.classList.remove("cursor-char"))
  const wordEl = getWordEl(wordIndex)
  if (!wordEl) return
  const spans = wordEl.querySelectorAll("span")
  const target = spans[charIndex] || spans[spans.length - 1]
  if (target) target.classList.add("cursor-char")
}

function updateCurrentWord() {
  const wordEl = getWordEl(wordIndex)
  if (!wordEl) return
  const spans = wordEl.querySelectorAll("span")
  const target = words[wordIndex]

  spans.forEach((span, i) => {
    span.className = ""
    if (i < currentInput.length) {
      span.classList.add(currentInput[i] === target[i] ? "correct" : "incorrect")
    }
  })
  updateCursor()
}

function endGame() {
  finished = true
  const elapsed = (Date.now() - startTime) / 1000
  const minutes = elapsed / 60
  const wpm = Math.round((correctChars / 5) / minutes)
  const accuracy = totalCharsTyped > 0
    ? Math.round((correctChars / totalCharsTyped) * 100)
    : 100

  finalWpm.innerText = wpm
  finalAccuracy.innerText = accuracy + "%"
  finalTime.innerText = Math.round(elapsed)

  testScreen.classList.add("hidden")
  resultScreen.classList.remove("hidden")
}

document.addEventListener("keydown", (e) => {
  if (finished) {
    if (e.code === "Space") { e.preventDefault(); restart() }
    return
  }

  if (e.key === " ") {
    e.preventDefault()
    if (currentInput.length === 0) return

    if (!startTime) startTime = Date.now()

    // score this word
    const target = words[wordIndex]
    for (let i = 0; i < Math.max(currentInput.length, target.length); i++) {
      totalCharsTyped++
      if (currentInput[i] === target[i]) correctChars++
    }

    typedWords.push(currentInput)
    currentInput = ""
    charIndex = 0
    wordIndex++

    if (wordIndex >= words.length) {
      endGame()
      return
    }

    updateCurrentWord()
    return
  }

  if (e.key === "Backspace") {
    e.preventDefault()
    if (currentInput.length > 0) {
      currentInput = currentInput.slice(0, -1)
      charIndex = Math.max(0, charIndex - 1)
      updateCurrentWord()
    }
    return
  }

  if (e.key.length === 1) {
    if (!startTime) startTime = Date.now()
    currentInput += e.key
    charIndex = currentInput.length
    updateCurrentWord()
  }
})

themeToggle.addEventListener("click", () => {
  const html = document.documentElement
  const isDark = html.getAttribute("data-theme") === "dark"
  html.setAttribute("data-theme", isDark ? "light" : "dark")
  themeToggle.innerText = isDark ? "dark" : "light"
})

function restart() {
  words = generateWords()
  wordIndex = 0
  charIndex = 0
  typedWords = []
  currentInput = ""
  startTime = null
  finished = false
  totalCharsTyped = 0
  correctChars = 0
  testScreen.classList.remove("hidden")
  resultScreen.classList.add("hidden")
  renderWords()
}

restart()