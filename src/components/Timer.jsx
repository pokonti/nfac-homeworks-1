import React, { useState, useEffect } from 'react';
import styles from './Timer.module.css';
import QuoteBox from './QuoteBox';
import { useTheme } from '../context/ThemeContext';

function Timer(){
  const [name, setName] = useState('');
  const [seconds, setSeconds] = useState(10);
  const [secondsInput, setSecondsInput] = useState(10);
  const [phase, setPhase] = useState('inhale');
  const [phaseSeconds, setPhaseSeconds] = useState(4);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const phases = {
    inhale: { next: 'hold', text: 'Breathe In', color: 'var(--primary)', seconds: 4 },
    hold: { next: 'exhale', text: 'Hold', color: 'var(--secondary)', seconds: 3 },
    exhale: { next: 'inhale', text: 'Breathe Out', color: 'var(--accent)', seconds: 4 }
  };

  useEffect(() => {
    if (name.trim()) {
      localStorage.setItem('userName', name);
    }
  }, [name]);

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setName(savedName);
    }
  }, []);
  

  useEffect(() => {

    if (!isRunning || seconds <= 0) return;
  
    const interval = setInterval(() => {
      setSeconds((prevTotal) => {
        if (prevTotal <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          setIsFinished(true);
          setShowQuote(true);
          return 0;
        }
        return prevTotal - 1;
      });

      setPhaseSeconds((prevPhase) => {
        if (prevPhase > 1) {
          return prevPhase - 1;
        }
        
        const nextPhase = phases[phase].next;
        setPhase(nextPhase);
        return phases[nextPhase].seconds;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, seconds, phase]);

  const handleStart = () => {
    if (name.trim()) {
      setIsRunning(true);
      setIsFinished(false);
      setShowQuote(false);
      setSeconds(secondsInput);
      setPhaseSeconds(phases.inhale.seconds);
      setPhase('inhale');
    }
  };

  const handleReset = () => {
    setName('');
    setSeconds(secondsInput);
    setIsRunning(false);
    setIsFinished(false);
    setShowQuote(false);
    setPhaseSeconds(phases.inhale.seconds);
    setPhase('inhale');
  };

  return (
    <>
      <button className="themeToggle" onClick={toggleTheme}>
        {isDarkMode ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Light Mode
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            Dark Mode
          </>
        )}
      </button>

      <div className={styles.container}>
      <h1>Breathing Timer</h1>
      <br />
        {!isRunning && !isFinished && (
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className={styles.input}
            />
            <br />
            <input
              type="number"
              value={secondsInput}
              onChange={(e) => setSecondsInput(e.target.value)}
              placeholder="Enter the number of seconds"
              className={styles.input}
            />
            <br />
            <button onClick={handleStart} className={styles.button} disabled={!name.trim()}>
              Start Breathing
            </button>
          </>
        )}

        {isRunning && (
          <>
            <h2 
              className={styles.phase}
              style={{ color: phases[phase].color }}
            >
              {phases[phase].text}
            </h2>
            <h2 className={styles.phaseTimer}>{phaseSeconds}</h2>
          </>
        )}

        {isFinished && <h2 className={styles.message}>You did it, {name} 💪</h2>}

        {(isRunning || isFinished) && (
          <button onClick={handleReset} className={styles.button}>
            Reset
          </button>
        )}
        
        {isFinished && (
          <>
            <button onClick={handleStart} className={styles.button}>
              Try again
            </button>
            {showQuote && <QuoteBox />}
          </>
        )}
      </div>

      <div className={styles.totalTimerBox}>
        <span className={styles.totalTimerText}>
          🕒 
          {isRunning && (
            <p>{name}, {seconds} seconds left!</p>
          )}
        </span>
      </div>
    </>
  );
}

export default Timer;
