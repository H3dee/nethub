import React, { useRef, useState } from 'react';
import { Redirect, Link, useLocation } from 'react-router-dom';

import ContiniousAuth from '../services/continiousAuth';
import { api } from '../services/API';
import {
  eventCodes,
  eventNames,
  MS_PER_SECOND,
  INITIAL_INTERVAL_TIME,
  REGULAR_INTERVAL_TIME,
  buttonCodes,
  buttonNames,
} from '../util/continiousAuthConstants';

export const Authorization = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [redirect, setRedirect] = useState(null);
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
    event.persist();

    if (!isPageObservable) {
      return;
    }

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

  const onChange = (event) => {
    event.persist();

    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onStartObserving = () => {
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

    console.log(dataChunksRef.current);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    api
      .MakeAuthRequest(form.email, form.password)
      .then((res) => {
        if (!res) {
          return;
        }

        if (res.data['status'] === 'OK') {
          setRedirect(res.data['role']);
        }
      })
      .catch(async (e) => {
        if (e.response.data['status'] === '401') {
          setErrors((prev) => ({ ...prev, password: e.response.data['error'] }));
        } else {
          setErrors((prev) => ({ ...prev, password: '' }));
        }

        if (e.response.data['status'] === '418') {
          setErrors((prev) => ({ ...prev, email: e.response.data['error'] }));
        } else {
          setErrors((prev) => ({ ...prev, email: '' }));
        }
      });
  };

  if (redirect === 'admin') {
    return <Redirect to="/topology" />;
  } else if (redirect === '') {
    return <Redirect to="/main" />;
  }

  return (
    <div
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      className="full-screen background centering"
    >
      <button
        onClick={onStartObserving}
        disabled={isPageObservable}
        style={{ position: 'absolute', top: '15px', left: '15px' }}
      >
        START OBSERVING
      </button>
      <button
        onClick={onStopObserving}
        disabled={!isPageObservable}
        style={{ position: 'absolute', top: '55px', left: '15px' }}
      >
        STOP OBSERVING
      </button>
      <button
        onClick={handleSendLatestChunk}
        style={{ position: 'absolute', top: '95px', left: '15px', backgroundColor: 'yellow' }}
      >
        Send chunk
      </button>
      <form className="window" onSubmit={onSubmit}>
        <div className="title title-centering margin-bottom-20">Welcome!</div>
        <div className="input margin-bottom-20">
          <div className={`input-header ${errors.email && 'error'} margin-bottom-8`}>
            e-mail
            {errors.email && <span className="mini-msg">{errors.email}</span>}
          </div>
          <input value={form.email} name="email" className="input-field" onChange={onChange} />
        </div>
        <div className="input margin-bottom-40">
          <div className={`input-header ${errors.password && 'error'} margin-bottom-8`}>
            password
            {errors.password && <span className="mini-msg">{errors.password}</span>}
          </div>
          <input
            type="password"
            name="password"
            onChange={onChange}
            value={form.password}
            className="input-field"
          />
        </div>
        <button className="button button-base margin-bottom-8">Sign in</button>
        <div className="mini-text">
          Need account?{' '}
          <Link to="/registration" className="link">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Authorization;
