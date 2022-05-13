import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';

import { api } from '../services/API';
import ContinuousAuthObserver from '../hoks/ContinuousAuthObserver';

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

  const onChange = (event) => {
    event.persist();

    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
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
    <ContinuousAuthObserver
      className="full-screen background centering"
    >
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
    </ContinuousAuthObserver>
  );
};

export default Authorization;
