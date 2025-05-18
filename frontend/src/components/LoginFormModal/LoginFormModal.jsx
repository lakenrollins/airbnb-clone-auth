import React, { useState } from 'react'
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

  if (loading) return <Loader />


  return (
    <div className="form-container">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>Username or Email
          <input value={credential} onChange={e => setCredential(e.target.value)} required />
        </label>
        <label>Password
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <ul className="error-list">{Object.values(errors).map((err,i)=><li key={i}>{err}</li>)}</ul>
        <button type="submit">Log In</button>
      </form>
    </div>
  )
}