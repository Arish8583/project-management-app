import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; 

const Register = () => {
  const [name, setName] = useState("");          // New
  const [phone, setPhone] = useState("");        // New
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await axios.get(`http://localhost:3500/users?email=${email}`);
    if (res.data.length > 0) {
      alert("User already exists");
      return;
    }

    await axios.post("http://localhost:3500/users", {
      id: uuidv4(),
      name,          // Added
      phone,         // Added
      email,
      password,
    });

    alert("User created! Please login.");
    navigate("/login");
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" required />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
