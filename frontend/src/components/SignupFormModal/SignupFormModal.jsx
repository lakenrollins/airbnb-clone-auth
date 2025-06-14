import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal'
import * as sessionActions from '../../store/session'
import "./SignupFormModal.css"
import Loader from '../Loader'

export default function SignupFormModal() {
  const dispatch = useDispatch()
  const { closeModal } = useModal()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)

  // Validate form fields whenever they change
  useEffect(() => {
    // Check if all fields are filled, username is at least 4 chars, and password is at least 6 chars
    const isValid = 
      email.trim() !== '' && 
      username.trim().length >= 4 && 
      firstName.trim() !== '' && 
      lastName.trim() !== '' && 
      password.length >= 6 && 
      confirmPass !== '';
      
    setIsFormValid(isValid);
  }, [email, username, firstName, lastName, password, confirmPass]);

  const handleSubmit = e => {
    e.preventDefault()
    if (password !== confirmPass) { setErrors({ confirmPass: 'Passwords must match' }); return }
    setErrors({})
    setLoading(true)
    return dispatch(sessionActions.signup({ username, firstName, lastName, email, password }))
      .then(closeModal)
      .catch(async res => {
        const data = await res.json()
        if (data.errors) setErrors(data.errors)
      })
      .finally(() => setLoading(false))
  }

  if (loading) return <Loader />

  return (
    <div className="form-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            required 
            type="email"
            aria-label="Email"
          />
        </label>
        <label>
          Username
          <input 
            value={username} 
            onChange={e=>setUsername(e.target.value)} 
            required
            aria-label="Username"
            minLength={4}
          />
          {username && username.length < 4 && 
            <span className="field-hint">Username must be at least 4 characters</span>
          }
        </label>
        <label>
          First Name
          <input 
            value={firstName} 
            onChange={e=>setFirstName(e.target.value)} 
            required
            aria-label="First Name"
          />
        </label>
        <label>
          Last Name
          <input 
            value={lastName} 
            onChange={e=>setLastName(e.target.value)} 
            required
            aria-label="Last Name"
          />
        </label>
        <label>
          Password
          <input 
            type="password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            required
            aria-label="Password"
            minLength={6}
          />
          {password && password.length < 6 && 
            <span className="field-hint">Password must be at least 6 characters</span>
          }
        </label>
        <label>
          Confirm Password
          <input 
            type="password" 
            value={confirmPass} 
            onChange={e=>setConfirmPass(e.target.value)} 
            required
            aria-label="Confirm Password"
          />
        </label>
        <ul className="error-list" aria-live="polite">
          {Object.values(errors).map((err,i)=><li key={i}>{err}</li>)}
        </ul>
        <button 
          type="submit" 
          disabled={!isFormValid}
          aria-disabled={!isFormValid}
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}