import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const LoginPage = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);

  const toggleForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  return (
    <div>
      {showLoginForm ? (
        <>
          <LoginForm />
          <p>
            Don't have an account?{' '}
            <button onClick={toggleForm}>Register</button>
          </p>
        </>
      ) : (
        <>
          <RegisterForm />
          <p>
            Already have an account?{' '}
            <button onClick={toggleForm}>Login</button>
          </p>
        </>
      )}
    </div>
  );
};

export default LoginPage;
