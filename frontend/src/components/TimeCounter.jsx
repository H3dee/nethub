import React, { useEffect, useRef, useState } from 'react';

import { convertSecondsToMinutes } from '../util/convertSecondsToMinutes';

const TIMER_STEP = 1_000;

export const TimeCounter = ({ collectingStartTime }) => {
  const [timeFromStart, setTimeFromStart] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (collectingStartTime === null) {
      setTimeFromStart(null);

      const isTimerRunning = intervalRef !== null;

      if (isTimerRunning) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = null;

      return;
    }

    const intervalHandler = () => {
      const currentTime = new Date();
      const recordTimeInSeconds = (currentTime - collectingStartTime) / TIMER_STEP;

      const convertedTime = convertSecondsToMinutes(recordTimeInSeconds);

      setTimeFromStart(convertedTime);
    };

    intervalRef.current = setInterval(intervalHandler, TIMER_STEP);
  }, [collectingStartTime]);

  return <div className="time-counter">{Boolean(timeFromStart) ? timeFromStart : '00 : 00'}</div>;
};

export default TimeCounter;
