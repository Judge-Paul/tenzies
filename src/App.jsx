import React, {useState, useEffect} from "react"
import Confetti from "react-confetti"
import Die from "./Die"

export default function App() {
    const [dice, setDice] = useState(allNewDice())
    const [tenzies, setTenzies] = useState(false)
    const [tries, setTries] = useState(0)
    const [highScore, setHighScore] = useState(100)
    const [seconds, setSeconds] = useState(0)

    let timer
    useEffect(() => {
        if (!tenzies) {
            timer = setInterval(() => {
                setSeconds(currSecond => currSecond + 1)
            }, 1000)
        }

        return () => clearInterval(timer)
    }, [tries, tenzies])

    useEffect(() => {
        const firstValue = dice[0].value
        const allHeld = dice.every(die => die.held)
        const allSameNumber = dice.every(die => die.value === firstValue)
        if(allHeld && allSameNumber) {
            setTenzies(true)
            // setHighScore(getHighScore())
            localStorage.setItem("highScore", JSON.stringify(getHighScore()))
            setHighScore(JSON.parse(localStorage.getItem("highScore")))
        }
    }, [dice])
    
    function randomDieValue() {
        return Math.ceil(Math.random() * 6)
    }

    function allNewDice() {
        const newArray = []
        for(let i = 0; i < 10; i++) {
            const newDie = {
                value: randomDieValue(),
                held: false,
                id: i + 1
            }
            newArray.push(newDie)
        }
        return newArray
    }

    function rollUnheldDice() {
        if (!tenzies) {
            setDice((oldDice) => oldDice.map((die, i) =>
                die.held ? 
                    die : 
                    { value: randomDieValue(), held: false, id: i + 1 }
            ))
            setTries(prevTries => prevTries + 1)
        } else {
            setDice(allNewDice())
            setTenzies(false)
            setTries(0)
            setSeconds(0)
        }
    }
    function getHighScore() {
      let scoreToBeSet = highScore
      seconds <= highScore ? scoreToBeSet = seconds : scoreToBeSet = highScore
      return scoreToBeSet
    }

    function holdDice(id) {
        setDice(prevDice => prevDice.map(die => {
            return die.id === id ? 
                {...die, held: !die.held} : 
                die
        }))
    }

    const diceElements = dice.map((die) => (
        <Die key={die.id} {...die} hold={() => holdDice(die.id)} />
    ))
    return (
        <main>
            {tenzies && <Confetti />}
            <h1>Tenzies</h1>
            {!tenzies && <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>}
            {tenzies && <h3>It took you {tries} rolls and {seconds} seconds to complete the game.</h3>}
            {tenzies && <h3>High Score: {highScore} seconds</h3>}
            <div className="die-container">{diceElements}</div>
            <button className="roll-dice" onClick={rollUnheldDice}>
                {tenzies ? "Reset Game" : "Roll"}
            </button>
        </main>
    )
}
