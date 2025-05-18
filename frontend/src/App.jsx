// frontend/src/App.jsx
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from 'react-router-dom'
import Navigation from './components/Navigation/Navigation'
import HomePage from './components/HomePage/HomePage'
import SpotDetailPage from './components/SpotDetailPage/SpotDetailPage'
import ManageSpotsPage from './components/ManageSpotsPage/ManageSpotsPage'
import { restoreUser } from './store/session'
import { Modal } from './context/Modal'      // ← import here

function Layout() {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    dispatch(restoreUser()).then(() => setIsLoaded(true))
  }, [dispatch])

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
      <Modal />                           {/* ← render it here */}
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/spots/:id', element: <SpotDetailPage /> },
      { path: '/spots/manage', element: <ManageSpotsPage /> }
    ]
  }
])

export default function App() {
  return <RouterProvider router={router} />
}