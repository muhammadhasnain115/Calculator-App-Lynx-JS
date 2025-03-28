import { useState, useCallback } from '@lynx-js/react';
import './App.css';

export function App() {
  const [display, setDisplay] = useState('');
  const [lastAnswer, setLastAnswer] = useState(''); // Store last answer
  const [isResultDisplayed, setIsResultDisplayed] = useState(false); // Track if result was just displayed

  const handlePress = useCallback((value: string) => {
    setDisplay((prevDisplay) => {
      if (value === "Ans") {
        return prevDisplay + lastAnswer; 
      }

      if (isResultDisplayed) {
        // If a result was displayed and a new button is pressed (except "="), clear the screen
        if (value !== "=" && value !== "⌫") {
          setIsResultDisplayed(false);
          return ["+", "-", "x", "/"].includes(value) ? lastAnswer + value : value;
        } else if (value === "⌫") {
          return ""; // Clear screen when backspace is pressed after result
        }
      }

      if (prevDisplay === "Error") {
        if (["+", "-", "x", "/"].includes(value)) return "0"; // Prevent operator at start
        return value; // Start fresh
      }

      if (value === "C" || prevDisplay === "C") return ""; 

      if (value === "⌫") {
        return prevDisplay.slice(0, -1) || "";
      }

      if (value === "=") {
        try {
          if (prevDisplay === "") return "0"; 
          let result = Function(`"use strict"; return (${prevDisplay.replace(/x/g, '*')})`)();
          result = parseFloat(result.toFixed(2)); 
          setLastAnswer(result.toString()); 
          setIsResultDisplayed(true); 
          return result.toString();
        } catch {
          return "Error";
        }
      }

      if (value === "√") {
        const num = parseFloat(prevDisplay);
        return isNaN(num) || num < 0 ? "Error" : parseFloat(Math.sqrt(num).toFixed(2)).toString();
      }

      if (value === "x²") {
        const num = parseFloat(prevDisplay);
        return isNaN(num) ? "Error" : parseFloat((num ** 2).toFixed(2)).toString();
      }

      if (prevDisplay === "" && value === "C" ) return "";

      // Prevent multiple operators in a row
      const lastChar = prevDisplay.slice(-1);
      if (["+", "-", "x", "/"].includes(lastChar) && ["+", "-", "x", "/"].includes(value)) {
        return prevDisplay; // Don't allow two operators together
      }

      return prevDisplay + value; // Append new value
    });
  }, [lastAnswer, isResultDisplayed]);

  const buttons = [
    '√', 'x²', 'Ans', '⌫', 
    '7', '8', '9', '/',
    '4', '5', '6', 'x',
    '1', '2', '3', '-',
    'C', '0', '=', '+'
  ];

  return (
    <view>
      <view className='Background' />
      <view className='App'>
        <view className='Content'>
          {/* Display Screen */}
          <view className="display">
            <text className="display-text">{display || '0'}</text>
          </view>

          {/* Calculator Buttons */}
          <view className="grid">
            {buttons.map((btn) => (
              <view key={btn} className={`rec-box ${btn === '=' ? 'equals' : ''}`} bindtap={() => handlePress(btn)}>
                <text className='box-text-color'>{btn}</text>
              </view>
            ))}
          </view>
        </view>
        <view><text className='branding'>Made by Computenest</text></view>
      </view>
    </view>
  );
}
