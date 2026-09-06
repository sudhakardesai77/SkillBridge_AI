import { useEffect, useState } from "react";

function Timer() {
  const [seconds, setSeconds] = useState(120);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 0) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="text-xl font-bold text-red-600">
      ⏱️ {minutes}:{secs.toString().padStart(2, "0")}
    </div>
  );
}

export default Timer;