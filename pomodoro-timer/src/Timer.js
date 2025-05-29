import React, { useState, useEffect, useRef } from "react";

const Timer = () => {
  const [secondsLeft, setSecondsLeft] = useState(1 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial" }}>
      <h1>🍅 Pomodoro Timer 🍅</h1>
      <h2 style={{ fontSize: "4rem" }}>{formatTime(secondsLeft)}</h2>
      <button onClick={startTimer} style={{ padding: "10px 20px", fontSize: "1.2rem" }}>
        Start
      </button>
    </div>
  );
};

export default Timer;
