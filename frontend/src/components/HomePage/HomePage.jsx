import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSpots } from '../../store/spot'
import './HomePage.css'
import Loader from '../Loader'

export default function HomePage() {
  const dispatch = useDispatch()
  const { spots, loading } = useSelector(state => state.spots)

  useEffect(() => {
    dispatch(fetchSpots())
  }, [dispatch])

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
            ></div>
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