import {useState} from "react"
import Confetti from "react-confetti"
import {languages} from './assets/languages'
import { getRandomWord, getFarewellText} from "./assets/utils"
import { useWindowSize } from 'react-use';

export default function AssemblyEndgame() {
  /*========================================
                State variables 
    ======================================== */

  const [currentWord, setCurrentWord] = useState(getRandomWord)
  const [guessedLetters, setGuessedLetters] = useState([])

  /*========================================
                Derived variables 
    ======================================== */
 
  const wrongGuessCount= guessedLetters.filter(letter => !currentWord.includes(letter)).length

  const isGameWon= currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessCount >= languages.length -1
  const isGameOver = isGameWon || isGameLost

  const lastGuessedLetter= guessedLetters.length>0 ? guessedLetters[guessedLetters.length-1]: ""
  const isLastGuessIncorrect = guessedLetters.length>0 && !currentWord.includes(lastGuessedLetter)


  /*========================================
                Static variables 
    ======================================== */

  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const { width, height } = useWindowSize(); 
  // Issue: App is gettign re-rendered eveytime the window is resized because of the useWindowSize() hook
  // console.log("app rendered")

  /*========================================
              Event Handler Functions
    ======================================== */

  function addGuessedLetter(letter) {
  
    setGuessedLetters(prevLetters => {
      if(!guessedLetters.includes(letter)){
        return [...prevLetters, letter]
      }
      else{
        return [...prevLetters]
      }
    })

  }

  function startNewGame(){
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }
  

  /*========================================
        Variables rendering DOM Elements
    ======================================== */

  const languageElements = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessCount
    const styles = {
        backgroundColor: lang.backgroundColor,
        color: lang.color
    }
    return (
        <span 
          key={lang.name} 
          style={styles} 
          className={`chip ${isLanguageLost ? "lost" : ""}`}
        >
          {lang.name}
        </span>
    )
  })

  const letterElements = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter= isGameLost || guessedLetters.includes(letter) 
    return (
    <span 
      key={index} 
      style={{
        color: guessedLetters.includes(letter)? "white": "#EC5D49"
        }}
    >
      {shouldRevealLetter ? letter.toUpperCase() : ""}
    </span>
    )}
  )

  const keyboardElements = alphabet.split("").map(letter => {
    const isGuessed= guessedLetters.includes(letter);
    const isRightGuess= isGuessed && currentWord.split("").includes(letter);

    return <button
        key={letter}
        onClick={() => addGuessedLetter(letter)}
        style={{
          backgroundColor: isGuessed? (isRightGuess? "#10A95B": "#EC5D49") : "#FCBA29"
        }}
        disabled= {isGameOver}
    >
        {letter.toUpperCase()}
    </button>
  })

  function renderGameStatus() {
    if (!isGameOver) { 
        if(isLastGuessIncorrect){
            return <p className="farewell-message"> {getFarewellText(languages[wrongGuessCount-1].name)} </p>
        }
        else{
            return null
        }
    }

    if (isGameWon) {
        return (
            <>
                <h2>You win!</h2>
                <p>Well done! 🎉</p>
            </>
        )
    } 
    else if(isGameLost){
        return (
            <>
                <h2>Game over!</h2>
                <p>You lose! Better start learning Assembly 😭</p>
            </>
        )
    }
  }

  /*========================================
                Style variables 
    ======================================== */  
  const statusStyleClass= isGameWon? 
                      "won":
                      isGameLost? "lost": isLastGuessIncorrect? "farewell": ""

  return (
    <main>
          {isGameWon && <Confetti width={width} height={height} />}
          <header>
              <h1>Assembly: Endgame</h1>
              <p>Guess the word within 8 attempts to keep the programming world safe from Assembly!</p>
          </header>

          <section 
              style={{
                visibility: isGameOver || isLastGuessIncorrect ? "visible": "hidden"
              }}
              className={`game-status ${statusStyleClass}`}>
              {renderGameStatus()}
          </section>

          <section className="language-chips">
                {languageElements}
          </section>
          
          <section className="current-word">
                {letterElements}
          </section>
          <p className="guess-num">Guesses Remaining: {8- wrongGuessCount}</p>

          <section className="keyboard-btns">
                {keyboardElements}
          </section>

          {isGameOver && <button className="new-game" onClick={startNewGame}>New Game</button>}
    </main>
  )
}


