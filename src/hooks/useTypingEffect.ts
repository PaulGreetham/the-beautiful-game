import { useState, useEffect } from 'react';

export const useTypingEffect = (text: string, speed: number = 10) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    if (text.length > 0) {
      setDisplayedText(text.charAt(0));
      index = 1;
    }

    const intervalId = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return displayedText;
};
