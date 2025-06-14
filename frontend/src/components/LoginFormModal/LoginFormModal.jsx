import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal'
import * as sessionActions from '../../store/session'
import './LoginFormModal.css'
import Loader from '../Loader'

export default function LoginFormModal() {
  const dispatch = useDispatch()
  const { closeModal } = useModal()
  const [credential, setCredential] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)

  // Validate inputs whenever they change
  useEffect(() => {
    setIsFormValid(
      credential.length >= 4 && password.length >= 6
    )
  }, [credential, password])

  const handleSubmit = e => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async res => {
        const data = await res.json()
        if (data.errors) setErrors(data.errors)
      })
      .finally(() => setLoading(false))
  }
  
  const handleDemoLogin = () => {
    setLoading(true)
    return dispatch(sessionActions.login({ credential: 'demo@user.io', password: 'password' }))
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
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input 
            value={credential} 
            onChange={e => setCredential(e.target.value)} 
            required
            aria-label="Username or Email"
            aria-required="true"
          />
        </label>
        <label>
          Password
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required
            aria-label="Password"
            aria-required="true"
          />
        </label>
        <ul className="error-list" aria-live="polite">
          {Object.values(errors).map((err,i) => <li key={i}>{err}</li>)}
        </ul>
        <button 
          type="submit" 
          disabled={!isFormValid}
          aria-disabled={!isFormValid}
        >
          Log In
        </button>
        <button 
          type="button"
          onClick={handleDemoLogin}
          className="demo-login-btn"
        >
          Log in as Demo User
        </button>
      </form>
    </div>
  )
}