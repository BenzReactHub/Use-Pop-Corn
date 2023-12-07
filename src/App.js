import React, { useEffect, useState, useRef } from "react";

export default function App() {
  const [counter, setCounter] = useState(0);
  const [formValue, setFormValue] = useState("");
  const inputEl = useRef(null);
  const counterRef = useRef(0);

  useEffect(() => {
    function callback(e) {
      if (e.code === "Enter") {
        inputEl.current.focus();
      }
    }
    document.addEventListener("keydown", callback);

    return () => document.removeEventListener("keydown", callback);
  }, []);

  useEffect(() => {
    counterRef.current += 1;
  }, [counter, formValue]);

  function handleFormValue(e) {
    setFormValue(e.target.value);
  }

  function handleCount() {
    setCounter((count) => count + 1);
  }

  return (
    <div>
      <p style={{ fontSize: "2.5rem" }}>
        Total Operations Count: {counterRef.current}
      </p>
      <p style={{ fontSize: "2.5rem" }}>Counter: {counter}</p>
      <p style={{ fontSize: "2.5rem" }}>Form Value: {formValue}</p>
      <input
        style={{ padding: "1.25rem", fontSize: "2.5rem" }}
        value={formValue}
        onChange={handleFormValue}
        ref={inputEl}
      />
      <br />
      <button
        style={{ fontSize: "2.5rem", marginTop: "3rem" }}
        onClick={handleCount}
      >
        +1
      </button>
    </div>
  );
}
