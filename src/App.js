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
  const [query, setQuery] = useState("Search Movies...");
  // useEffect(()=>{
  //   function callback(e){
  //     const inputEl = document.querySelector(".search");
  //     if(e.code === 'Enter') return inputEl.focus();
  //   }
  //   document.addEventListener('keydown', callback);
  //   return ()=>{
  //     document.removeEventListener('keydown', callback);
  //   }
  // }, [])
  const inputEl = useRef(null);
  useKey('Enter', ()=>{
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  })
  // useEffect(() => {
  //   function callback(e) {
  //     if (document.activeElement === inputEl.current) return;
  //     if (e.code === "Enter") {
  //       inputEl.current.focus();
  //       setQuery("");
  //     }
  //   }
  //   document.addEventListener("keydown", callback);
  //   return () => {
  //     document.removeEventListener("keydown", callback);
  //   };
  // }, []);
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
    </div>
  );
}
