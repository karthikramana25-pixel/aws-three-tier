import React, { useState } from "react";

function Register({ history }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    alert("User registered (demo)");
    history.push("/login");
  };

  return (
    <form onSubmit={submit}>
      <h2>Register</h2>
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button>Register</button>
    </form>
  );
}

export default Register;
