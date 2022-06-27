import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function Login() {
  const [checkLogin, setCheckLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();

  const setLocalStorageLogin = () => {
    localStorage.setItem('mealsToken', '1');
    localStorage.setItem('cocktailsToken', '1');
    localStorage.setItem('user', JSON.stringify({ email }));
  };

  const handleClick = () => {
    setLocalStorageLogin();
    history.push('/foods');
  };

  useEffect(() => {
    const MIN_PASSWORD = 7;
    const buttonChange = () => {
      if (email.includes('@')
        && email.endsWith('.com')
        && password.length >= MIN_PASSWORD) {
        setCheckLogin(false);
      } else {
        setCheckLogin(true);
      }
    };

    buttonChange();
  }, [email, password]);

  return (
    <div className="login-all">
      <fieldset className="login-form">
        <legend>Login</legend>

        <h1>APP de Receitas</h1>

        <label htmlFor="email">
          Email:
          <input
            type="email"
            name="email"
            placeholder="email"
            data-testid="email-input"
            onChange={ ({ target }) => setEmail(target.value) }
          />
        </label>

        <label htmlFor="password">
          Password:
          <input
            type="password"
            name="password"
            placeholder="password"
            data-testid="password-input"
            onChange={ ({ target }) => setPassword(target.value) }
          />
        </label>

        <button
          disabled={ checkLogin }
          type="button"
          data-testid="login-submit-btn"
          onClick={ handleClick }
        >
          Enter
        </button>
      </fieldset>
    </div>
  );
}

export default Login;
