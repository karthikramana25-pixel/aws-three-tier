import React, { useState } from "react";
import styled from 'styled-components';

const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #ffffff;
  color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormWrapper = styled.form`
  background: #ffffff;
  color: #000000;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  display:flex;
  flex-direction:column;
  gap: 0.75rem;
  min-width: 320px;
`;

function Login({ history }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      return alert("Enter credentials");
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return alert(err.message || 'Login failed');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      history.push('/home');
    } catch (err) {
      console.error(err);
      alert('Login failed (network error)');
    }
  }; 

  return (
    <Page>
      <FormWrapper onSubmit={submit}>
        <h2>Login</h2>
        <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button>Login</button>
        <p>New user? <a href="#/register">Register</a></p>
      </FormWrapper>
    </Page>
  );
}

export default Login;
