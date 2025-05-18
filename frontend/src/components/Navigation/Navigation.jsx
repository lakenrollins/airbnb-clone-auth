import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProfileButton from './ProfileButton'
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import LoginFormModal from '../LoginFormModal/LoginFormModal'
import SignupFormModal from '../SignupFormModal/SignupFormModal'
import './Navigation.css'
import CreateSpotModal from '../CreateSpotModal/CreateSpotModal'

export default function Navigation({ isLoaded }) {
  const user = useSelector(s => s.session.user)
  return (
    <nav className="nav">
      <NavLink to="/" className="nav-logo">Logo</NavLink>
      {isLoaded && (
        <ul className="nav-links">
          {!user ? (
            <>
              <li>
                <OpenModalButton buttonText="Log In" modalComponent={<LoginFormModal />} />
              </li>
              <li>
                <OpenModalButton buttonText="Sign Up" modalComponent={<SignupFormModal />} />
              </li>
            </>
          ) : (
            <>
              <li>
                <OpenModalButton buttonText="Create a New Spot" modalComponent={<CreateSpotModal />} />
              </li>
              <li>
                <ProfileButton user={user} />
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  )
}
