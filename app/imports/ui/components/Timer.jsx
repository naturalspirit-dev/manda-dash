import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

/* Renders a timer to countdown from 6 hours in percentages */
export default Timer = (props) => {

  const [currentCount, setCount] = useState(0);
  const [percent, setPercent] = useState(0);

  const timer = () => {
    setCount(currentCount + 1);
    setPercent((currentCount / 21600000 ) * 100)
  }

  useEffect(() => {
    if (currentCount >= 21600) { return; }
    const id = setInterval(timer, 1000);
    return () => clearInterval(id);
  }, [currentCount]);

  return <div>{percent.toFixed(5)} %</div>;
};
