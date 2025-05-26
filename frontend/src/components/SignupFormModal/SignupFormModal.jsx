import React, { useState } from 'react'
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
        <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} required/></label>
        <label>Username<input value={username} onChange={e=>setUsername(e.target.value)} required/></label>
        <label>First Name<input value={firstName} onChange={e=>setFirstName(e.target.value)} required/></label>
        <label>Last Name<input value={lastName} onChange={e=>setLastName(e.target.value)} required/></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>
        <label>Confirm Password<input type="password" value={confirmPass} onChange={e=>setConfirmPass(e.target.value)} required/></label>
        <ul className="error-list">{Object.values(errors).map((err,i)=><li key={i}>{err}</li>)}</ul>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}
