import React, { useRef, useState } from 'react';
import { Redirect, Link, useLocation } from 'react-router-dom';

import { api } from '../services/API';

const eventIds = {
  MOUSE_MOVE: 512,
  MOUSE_LEFT_DOWN: 513,
  MOUSE_LEFT_UP: 514,
};

const eventNames = {
  [eventIds.MOUSE_MOVE]: 'mouse move',
  [eventIds.MOUSE_LEFT_DOWN]: 'mouse left down',
  [eventIds.MOUSE_LEFT_UP]: 'mouse up down',
};

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

  const location = useLocation();

  const dataChunksRef = useRef([[]]);

  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const createEventHandler = (type) => (event) => {
    event.persist();

    if (!isPageObservable) {
      return;
    }

    console.log(event);

    const eventId = eventIds[type];
    const timestamp = +new Date();

    const chunk = {
      eventId,
      event: eventNames[eventId],
      windowName: location.pathname,
      timestamp,
      positionX: event.pageX,
      positionY: event.pageY,
    };

    const containerLength = dataChunksRef.current.length;
    const isDataCollectingInitial = containerLength === 1;
    dataChunksRef.current[isDataCollectingInitial ? 0 : containerLength - 1].push(chunk);
  };

  const onChange = (event) => {
    event.persist();

    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onMouseMove = createEventHandler('MOUSE_MOVE');

  const onMouseLeftDown = createEventHandler('MOUSE_LEFT_DOWN');

  const onMouseLeftUp = createEventHandler('MOUSE_LEFT_UP');

  const onStartObserving = () => {
    setIsPageObservable(true);

    timeoutRef.current = setTimeout(() => {
      const intervalHandler = () => dataChunksRef.current.push([]);

      intervalRef.current = setInterval(intervalHandler, 5000);
      timeoutRef.current = null;
    }, 20_000);
  };

  const onStopObserving = () => {
    const plannedTimeout = timeoutRef.current;
    const isInTimeout = plannedTimeout !== null;

    if (isInTimeout) {
      clearTimeout(plannedTimeout);
    }

    clearInterval(intervalRef.current);
    setIsPageObservable(false);

    console.log(dataChunksRef.current);

    dataChunksRef.current = [[]];
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
      onMouseUp={onMouseLeftUp}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseLeftDown}
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
