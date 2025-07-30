import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginSuccess } from '../features/auth/auth'

const Login = () => {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const dispatch = useDispatch();
const navigate = useNavigate();

const handlesubmit = async(e) =>{
    e.preventDefault()
    const res = await axios.get(`http://localhost:3500/users?email=${email}`) 
    const user = res.data[0]
if (user && user.password === password) {
      dispatch(loginSuccess(user));
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }}

  return (
    <form onSubmit={handlesubmit}>
        <input type='email' placeholder='email'value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type='submit'>Login</button>

    </form>
  )
}

export default Login