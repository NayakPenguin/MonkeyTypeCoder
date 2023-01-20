import React, { useState, useRef, useEffect } from 'react'
import { quotesArray, random, allowedKeys } from './Helper'
import ItemList from './components/ItemList'
import './App.css'
import styled from 'styled-components'

let interval = null

const App = () => {
	const inputRef = useRef(null)
	const outputRef = useRef(null)
	const [duration, setDuration] = useState(30)
	const [started, setStarted] = useState(false)
	const [ended, setEnded] = useState(false)
	const [index, setIndex] = useState(0)
	const [correctIndex, setCorrectIndex] = useState(0)
	const [errorIndex, setErrorIndex] = useState(0)
	const [quote, setQuote] = useState({})
	const [input, setInput] = useState('')
	const [cpm, setCpm] = useState(0)
	const [wpm, setWpm] = useState(0)
	const [accuracy, setAccuracy] = useState(0)
	const [isError, setIsError] = useState(false)
	const [lastScore, setLastScore] = useState('0')

	useEffect(() => {
		const newQuote = random(quotesArray)
		setQuote(newQuote)
		setInput(newQuote.quote)
	}, [])

	const handleEnd = () => {
		setEnded(true)
		setStarted(false)
		clearInterval(interval)
	}

	const setTimer = () => {
		const now = Date.now()
		const seconds = now + duration * 1000
		interval = setInterval(() => {
			const secondLeft = Math.round((seconds - Date.now()) / 1000)
			setDuration(secondLeft)
			if (secondLeft === 0) {
				handleEnd()
			}
		}, 1000)
	}

	const handleStart = () => {
		setStarted(true)
		setEnded(false)
		setInput(quote.quote)
		inputRef.current.focus()
		setTimer()
	}

	const handleKeyDown = e => {
		e.preventDefault()
		const { key } = e
		const quoteText = quote.quote

		if (key === quoteText.charAt(index)) {
			setIndex(index + 1)
			const currenChar = quoteText.substring(index + 1, index + quoteText.length)
			setInput(currenChar)
			setCorrectIndex(correctIndex + 1)
			setIsError(false)
			outputRef.current.innerHTML += key
		} else {
			if (allowedKeys.includes(key)) {
				setErrorIndex(errorIndex + 1)
				setIsError(true)
				outputRef.current.innerHTML += `<span class="text-danger">${key}</span>`
			}
		}

		const timeRemains = ((60 - duration) / 60).toFixed(2)
		const _accuracy = Math.floor((index - errorIndex) / index * 100)
		const _wpm = Math.round(correctIndex / 5 / timeRemains)

		if (index > 5) {
			setAccuracy(_accuracy)
			setCpm(correctIndex)
			setWpm(_wpm)
		}

		if (index + 1 === quoteText.length || errorIndex > 50) {
			handleEnd()
		}
	}

	useEffect(
		() => {
			if (ended) localStorage.setItem('wpm', wpm)
		},
		[ended, wpm]
	)
	useEffect(() => {
		const stroedScore = localStorage.getItem('wpm')
		if (stroedScore) setLastScore(stroedScore)
	}, [])

	return (
		<GrandContainer>
			<MobContainer>

			</MobContainer>
			<LapContainer>
				<div className="App">
					<div className="container-fluid pt-4">
						<div className="row">
							{/* Body */}
							<div className='main-body'>
								<div className="container">
									<div className="text-center mt-4 header">
										<h1>How Fast Can You Type Your Code?</h1>

										{/* <div className="alert">
											<p>- Just start typing and don't use <b>backspace</b> to correct your mistakes. Your
											mistakes will be marked in <b>Red</b> color and shown below the writing box. Good
											luck!</p> 
											<p>- Try to use Tab to get to the <b>Go!</b> button and press enter, to avoid use of cursor.
											</p>
										</div> */}
									</div>


									<div className='main-content-writer'>
										<div className='time-left'>
											{duration} Sec Left
										</div>

										{ended ? (
											<>
												<div className="bg-dark text-light lead rounded">
													<span className='code-text'>"{quote.quote}"</span>
													<span className="d-block mt-2 text-muted small">- {quote.author}</span>
												</div>
												<div className="writing-stats">
													<ItemList name="CPM" data={cpm} />
													<ItemList name="Errors" data={errorIndex} />
													<ItemList name="Acuracy" data={accuracy} symble="%" />
												</div>
											</>
										) : started ? (
											<div
												className={`text-light mono quotes${started ? ' active' : ''}${isError
													? ' is-error'
													: ''} code-text`}
												tabIndex="0"
												onKeyDown={handleKeyDown}
												ref={inputRef}
											>
												{input}
											</div>
										) : (
											<div className="mono quotes text-muted code-text" tabIndex="-1" ref={inputRef}>
												{input}
											</div>
										)}

										<div className="p-4 mt-4 bg-dark text-light rounded lead code-text" ref={outputRef} />

										<div className="control">
											{ended ? (
												<button
													className="btn btn-outline-danger "
													onClick={() => window.location.reload()}
												>
													Reload
												</button>
											) : started ? (
												<button className="btn  btn-outline-success" disabled>
													Hurry
												</button>
											) : (
												<button className="btn  btn-outline-success" onClick={handleStart}>
													GO!
												</button>
											)}
										</div>
									</div>


									<hr className="my-4" />
									<div className="mb-5">
										<h6 className="py-2">Average Typing Speeds</h6>
										<div className="d-flex text-white meter-gauge">
											<span className="col clr-black" style={{ background: '#eb4841' }}>
												0 - 20 Slow
											</span>
											<span className="col clr-black" style={{ background: '#f48847' }}>
												20 - 40 Average
											</span>
											<span className="col clr-black" style={{ background: '#ffc84a' }}>
												40 - 60 Fast
											</span>
											<span className="col clr-black" style={{ background: '#a6c34c' }}>
												60 - 80 Professional
											</span>
											<span className="col clr-black" style={{ background: '#4ec04e' }}>
												80 - 100+ Top
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						<footer className="small text-muted pt-5 pb-2 footer">
							<div className="footer-info text-center">
								<ul className="list-inline m-1">
									{/* <li className="list-inline-item">v2.0.1</li> */}
									{/* <li className="list-inline-item"> - </li> */}
									{/* <li className="list-inline-item">
										<a
											href="https://github.com/awran5/react-typing-speed-test-game"
											target="_blank"
											title="GitHub"
											rel="noopener noreferrer"
										>
											GitHub
										</a>
									</li> */}
									{/* <li className="list-inline-item"> - </li> */}
									{/* <li className="list-inline-item">
										<a
											href="https://github.com/awran5/react-typing-speed-test-game/issues"
											target="_blank"
											title="Issues"
											rel="noopener noreferrer"
										>
											Issues
										</a>
									</li> */}
								</ul>
								<div className="copyright">
									Open Source project by Anurag Chakraborty - Ahmed Khalil - Atanu Nayak - Gaurav Prasad. Rights reserved by
									{' '} <a href="https://gkstyle.net/" title="GK STYLE">
										GK STYLE
									</a>{' '}
									team.
								</div>
							</div>
						</footer>
					</div>
				</div>
			</LapContainer>
		</GrandContainer>
	)
}

export default App

const GrandContainer = styled.div`
	.main-body{
		width: 100vw;
		/* border: 1px solid black; */
		margin: auto;
		display: grid;
		place-items: center;
	}

	.lead{
		padding: 20px;
		font-size: 1rem;
	}

	.main-content-writer{
		margin: 120px 0 50px 0;
	}

	.alert{
		background-color: #2a2a2a;
		margin: 10px auto;
		color: white;
		font-size: 0.75rem;

		text-align: left;
		width: 780px;
		
		p{
			margin: 5px 0;
			b{
				font-weight: 500;
			}
		}
	}
	
	.clr-black{
		color: #111;
		font-weight: 400;
	}

	.time-item{
		border: none;
	}

	.time-left{
		color: orange;
		font-size: 1.15rem;
		font-weight: 500;
		margin-bottom: 10px;
	}

	.control{
		margin: 10px auto;
		display: flex;
		justify-content: center;

		.btn{
			padding: 7.5px 37.5px;
			font-size: 0.8rem;
		}
	}

	.text-light{
		font-weight: 200;
	}
	
	.code-text{
		font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
	}

	.quotes{
		font-size: 1.25rem;
		color: #7a8599;
	}
`

const MobContainer = styled.div`
	
`

const LapContainer = styled.div`
	.writing-stats{
		display: flex;
		justify-content: space-between;
		padding: 20px 0;
	}
`