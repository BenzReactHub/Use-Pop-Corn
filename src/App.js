import React, { useEffect, useState, useRef } from "react";

function useKey(key, action) {
  useEffect(() => {
    function callback(e) {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action();
      }
    }
    document.addEventListener("keydown", callback);
    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, [key, action]);
}

export default function App() {
  const [ btnClickNum, setBtnClickNum ] = useState(0);
  const [query, setQuery] = useState("Search Movies...");
  const inputEl = useRef(null);
  const totalOperationsNum = useRef(0);

  useEffect(()=>{
    if(btnClickNum > 0) totalOperationsNum.current+=1;
  }, [btnClickNum])

  useEffect(()=>{
    totalOperationsNum.current+=1;
  }, [query])


  useKey('Enter', ()=>{
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  })
  return (
    <div>
      <input
        ref={inputEl}
        className="search"
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        value={query}
      />
      <div>User Total Operations Number is: {totalOperationsNum.current}</div>
      <div>Button Click Total Number is: {btnClickNum}</div>
      <button onClick={()=>{setBtnClickNum((prevNum)=>(prevNum+1))}}>+1</button>
    </div>
  );
}
