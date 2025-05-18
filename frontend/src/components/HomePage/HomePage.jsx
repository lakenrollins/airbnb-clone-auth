import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { csrfFetch } from '../../store/csrf'
import './HomePage.css'
import Loader from '../Loader'

export default function HomePage() {
  const [spots, setSpots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      
      const res      = await csrfFetch('/api/spots?page=1&size=20')
      if (!res.ok) return
      const data     = await res.json()
      const enriched = await Promise.all(
        data.spots.map(async spot => {
          const revRes = await csrfFetch(`/api/spots/${spot.id}/reviews`)
          let avg       = 'New'
          if (revRes.ok) {
            const { Reviews } = await revRes.json()
            if (Reviews.length) {
              const total = Reviews.reduce((sum, r) => sum + r.stars, 0)
              avg = (total / Reviews.length).toFixed(1)
            }
          }
          return { ...spot, avgRating: avg }
        })
      )
      setSpots(enriched)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <Loader />

  return (
    <div className="home-container">
      <div className="spots-grid">
        {spots.map(spot => (
          <Link
            key={spot.id}
                       to={`/spots/${spot.id}`}
            className="spot-card"
            title={spot.name}
          >
            <div
              className="spot-image"
              style={{ backgroundImage: `url(${spot.SpotImages?.[0]?.url})` }}
            />
            <div className="spot-info">
              <div>
                <h3>{spot.name}</h3>
                <p>{spot.city}, {spot.state}</p>
              </div>
              <div className="spot-meta">
                <span className="rating">
                  {spot.avgRating === 'New' ? 'New' : `⭐ ${spot.avgRating}`}
                </span>
                <span className="price">${spot.price}/night</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
