"use client";

import { useState, useEffect } from 'react';

const calculateTimeLeft = (deadline: string) => {
  const difference = +new Date(deadline) - +new Date();
  let timeLeft: { [key: string]: number } = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
    };
  }
  return timeLeft;
};

export default function Countdown({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(deadline));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(deadline));
    }, 1000 * 60); // Update every minute

    return () => clearTimeout(timer);
  });

  const timerComponents: JSX.Element[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval] && interval !== 'days' && timerComponents.length === 0) return;
    if (timeLeft[interval] >= 0) {
       timerComponents.push(
        <span key={interval} className="font-bold">
          {timeLeft[interval]}{interval.charAt(0)}
        </span>
       );
    }
  });

  if (!timerComponents.length) {
    return <span className="text-red-500 font-bold">Expired</span>;
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded-full">
      <span>Ends in:</span>
      {timerComponents.map((component, index) => (
        <span key={index}>{component}</span>
      ))}
    </div>
  );
}
