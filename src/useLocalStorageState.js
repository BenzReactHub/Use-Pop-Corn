import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  // const [watched, setWatched] = useState([]);
  // 在useState中的回調函數不能有傳遞參數
  // 且這個回調函數只會在初始化render中調用
  // 之後的re-render並不會調用
  // 這個功能會滿常用的
  // const [watched, setWatched] = useState(()=>{
  //   const storedValue = localStorage.getItem('watched');
  //   return JSON.parse(storedValue);
  // });

  const [value, setValue] = useState(()=>{
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(()=>{
    localStorage.setItem(key, JSON.stringify([...value]))
    
  }, [value, key]);

  return [value, setValue];
}