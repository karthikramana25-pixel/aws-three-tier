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

function Register({ history }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    alert("User registered (demo)");
    history.push("/login");
  };

  return (
    <Page>
      <FormWrapper onSubmit={submit}>
        <h2>Register</h2>
        <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button>Register</button>
      </FormWrapper>
    </Page>
  );
}

export default Register;
