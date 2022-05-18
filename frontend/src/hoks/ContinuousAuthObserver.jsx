import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import TimeCounter from '../components/TimeCounter';
import ContiniousAuth from '../services/continiousAuth';
import {
  eventCodes,
  eventNames,
  MS_PER_SECOND,
  INITIAL_INTERVAL_TIME,
  REGULAR_INTERVAL_TIME,
  buttonCodes,
  buttonNames,
} from '../util/continiousAuthConstants';

const buttonStyles = {
  position: 'absolute',
  padding: '5px 10px',
  borderRadius: '5px',
  width: '132px',
  cursor: 'pointer',
  boxShadow: '0 2px 10px 0 rgb(0 0 0 / 50%)'
};

const IS_CONTINUOUS_AUTH_ENABLED = process.env.REACT_APP_IS_CONTINUOUS_AUTH_ENABLED === "true";
const IS_IN_TRAINING_MODE = process.env.REACT_APP_CONTINUOUS_AUTH_MODE === 'training';

const ContinuousAuthObserver = ({ children, ...props }) => {
  const [isPageObservable, setIsPageObservable] = useState(false);
  const [collectingStartTime, setCollectingStartTime] = useState(null);

  const location = useLocation();

  const dataChunksRef = useRef([[]]);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const getChunksContainerParams = () => {
    const chunksContainerLength = dataChunksRef.current.length;

    const hasOnlyOneChunk = chunksContainerLength === 1;
    const indexOfLatestChunk = hasOnlyOneChunk ? 0 : chunksContainerLength - 1;

    return {
      hasOnlyOneChunk,
      indexOfLatestChunk,
    };
  };

  const createEventHandler = (type) => (event) => {
    if (!isPageObservable || !IS_CONTINUOUS_AUTH_ENABLED) {
      return;
    }

    event.persist();

    const { indexOfLatestChunk, hasOnlyOneChunk } = getChunksContainerParams();

    const isRecordFirst = hasOnlyOneChunk && dataChunksRef.current[0].length === 0;

    const PRESSED_LEFT_MOUSE_BUTTON_CODE = 1;
    const isLeftButtonBeingPressed = event.buttons === PRESSED_LEFT_MOUSE_BUTTON_CODE;

    const eventId =
      type === 'MOUSE_MOVE' && isLeftButtonBeingPressed ? eventCodes.DRAG : eventCodes[type];

    const currentTime = new Date();
    const timestamp = !isRecordFirst ? (currentTime - collectingStartTime) / MS_PER_SECOND : 0;

    let button = '';
    const isMMAction = type === 'MOUSE_MOVE';

    if (isMMAction) {
      button = buttonNames[buttonCodes.NO_BUTTON];
    } else {
      button = buttonNames[event.button];
    }

    const chunk = {
      event: eventNames[eventId],
      button,
      windowName: location.pathname,
      timestamp,
      positionX: event.pageX,
      positionY: event.pageY,
      userId: 1,
    };

    dataChunksRef.current[indexOfLatestChunk].push(chunk);
  };

  const handleResetChunksContainer = () => {
    dataChunksRef.current = [[]];
  };

  const handleSendLatestChunk = () => {
    const { indexOfLatestChunk } = getChunksContainerParams();
    const latestChunk = dataChunksRef.current[indexOfLatestChunk];

    ContiniousAuth.sendRawDataChunk(latestChunk);
  };

  const onMouseMove = createEventHandler('MOUSE_MOVE');

  const onMouseDown = createEventHandler('MOUSE_DOWN');

  const onMouseUp = createEventHandler('MOUSE_UP');

  const onStartObserving = () => {
    if (!IS_CONTINUOUS_AUTH_ENABLED) {
      return;
    }

    handleResetChunksContainer();

    setCollectingStartTime(+new Date());
    setIsPageObservable(true);

    timeoutRef.current = setTimeout(() => {
      const intervalHandler = () => {
        handleSendLatestChunk();
        dataChunksRef.current.push([]);
      };

      intervalHandler();

      intervalRef.current = setInterval(intervalHandler, REGULAR_INTERVAL_TIME);
      timeoutRef.current = null;
    }, INITIAL_INTERVAL_TIME);
  };

  const onStopObserving = () => {
    const plannedTimeout = timeoutRef.current;
    const isInTimeout = plannedTimeout !== null;

    if (isInTimeout) {
      clearTimeout(plannedTimeout);
    }

    clearInterval(intervalRef.current);
    setIsPageObservable(false);
    setCollectingStartTime(null);

    IS_IN_TRAINING_MODE && ContiniousAuth.completeDataCollecting(1)
  };

  return (
    <div onMouseUp={onMouseUp} onMouseMove={onMouseMove} onMouseDown={onMouseDown} {...props}>
      {IS_CONTINUOUS_AUTH_ENABLED && (
        <React.Fragment>
          <button
            onClick={onStartObserving}
            disabled={isPageObservable}
            style={{
              ...buttonStyles,
              bottom: '55px',
              left: '15px',
            }}
          >
            START OBSERVING
          </button>
          <button
            onClick={onStopObserving}
            disabled={!isPageObservable}
            style={{
              ...buttonStyles,
              bottom: '15px',
              left: '15px',
            }}
          >
            STOP OBSERVING
          </button>
          {IS_IN_TRAINING_MODE && <TimeCounter collectingStartTime={collectingStartTime} />}
        </React.Fragment>
      )}
      {children}
    </div>
  );
};

export default ContinuousAuthObserver;
