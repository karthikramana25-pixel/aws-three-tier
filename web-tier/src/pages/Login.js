import React, { useState } from "react";

function Login({ history }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();

    // TEMP (until backend is connected)
    if (username && password) {
      localStorage.setItem("token", "data.token");
      history.push("/home");
    } else {
      alert("Enter credentials");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button>Login</button>
      <p>New user? <a href="#/register">Register</a></p>
    </form>
  );
}

export default Login;
