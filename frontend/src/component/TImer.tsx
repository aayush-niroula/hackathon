// src/components/CountdownTimer.tsx
import { useState, useEffect } from 'react';

const targetDate = new Date('2024-08-31T00:00:00');

const CountdownTimer = () => {
const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

function calculateTimeLeft() {
const now = new Date();
const difference = targetDate.getTime() - now.getTime();
	

return {
  days: Math.floor(difference / (1000 * 60 * 60 * 24)),
  hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
  minutes: Math.floor((difference / 1000 / 60) % 60),
  seconds: Math.floor((difference / 1000) % 60),
};

}

useEffect(() => {
const timer = setInterval(() => {
setTimeLeft(calculateTimeLeft());
}, 1000);
return () => clearInterval(timer);
}, []);

return (
<div className="text-center mb-8">
<h2 className="text-3xl font-bold mb-2">⏳ AIMS Code Quest 2.0</h2>
<div className="text-2xl">
{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
</div>
</div>
);
};

export default CountdownTimer;

  