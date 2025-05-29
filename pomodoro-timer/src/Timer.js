import React, { useState, useEffect, useRef } from "react";

const Timer = () => {
  const WORK_TIME = 25 * 60;
  const SHORT_BREAK = 5 * 60;
  const LONG_BREAK = 15 * 60;

  const [secondsLeft, setSecondsLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [activeMode, setActiveMode] = useState("work");
  const intervalRef = useRef(null);
  const alarmRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            if (alarmRef.current) alarmRef.current.play();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const startTimer = () => {
    if (!isRunning) setIsRunning(true);
  };

  const switchMode = (mode) => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setActiveMode(mode);

    if (mode === "work") {
      setSecondsLeft(WORK_TIME);
    } else if (mode === "short") {
      setSecondsLeft(SHORT_BREAK);
    } else if (mode === "long") {
      setSecondsLeft(LONG_BREAK);
    }
  };

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial" }}>
      <h1>🍅 Pomodoro Timer 🍅</h1>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => switchMode("work")} style={getModeStyle(activeMode === "work")}>Work</button>
        <button onClick={() => switchMode("short")} style={getModeStyle(activeMode === "short")}>Short Break</button>
        <button onClick={() => switchMode("long")} style={getModeStyle(activeMode === "long")}>Long Break</button>
      </div>
      <h2 style={{ fontSize: "4rem" }}>{formatTime(secondsLeft)}</h2>
      <button onClick={startTimer} style={{ padding: "10px 20px", fontSize: "1.2rem" }}>
        Start
      </button>
      <audio ref={alarmRef} src="/alarm.mp3" />
    </div>
  );
};

const getModeStyle = (isActive) => ({
  padding: "10px 15px",
  margin: "0 5px",
  fontSize: "1rem",
  backgroundColor: isActive ? "#f87171" : "#d1d5db",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  color: isActive ? "white" : "black",
});

export default Timer;
