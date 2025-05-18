import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { FaUserCircle } from 'react-icons/fa'
import { NavLink} from 'react-router-dom'
import * as sessionActions from '../../store/session'
import './Navigation.css'

export default function ProfileButton({ user }) {
  const dispatch = useDispatch()
  const [showMenu, setShowMenu] = useState(false)
  const ulRef = useRef()

  const toggleMenu = e => { e.stopPropagation(); setShowMenu(prev => !prev) }

  useEffect(() => {
    if (!showMenu) return
    const closeMenu = e => {
      if (ulRef.current && !ulRef.current.contains(e.target)) setShowMenu(false)
    }
    document.addEventListener('click', closeMenu)
    return () => document.removeEventListener('click', closeMenu)
  }, [showMenu])

  const logout = e => { e.preventDefault(); dispatch(sessionActions.logout()) }
  const ulClass = `profile-dropdown${showMenu ? '' : ' hidden'}`

  return (
    <div className="profile-container">
      <button onClick={toggleMenu} className="profile-btn"><FaUserCircle /></button>
      <ul ref={ulRef} className={ulClass}>
        <li><strong>{user.username}</strong></li>
        <li>{user.firstName} {user.lastName}</li>
        <li>{user.email}</li>
        <li><NavLink to="/spots/manage">Manage Spots</NavLink></li>
        <li><button onClick={logout}>Log Out</button></li>
      </ul>
    </div>
  )
}