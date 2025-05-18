import React, { useEffect, useState } from 'react'
import { csrfFetch } from '../../store/csrf'
import { useModal } from '../../context/Modal'
import CreateSpotModal from '../CreateSpotModal/CreateSpotModal'
import './ManageSpotsPage.css'

export default function ManageSpotsPage() {
  const [spots, setSpots] = useState(null)
  const { setModalContent, setOnModalClose } = useModal()
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    async function load() {
      const res = await csrfFetch('/api/spots/current')
      if (res.ok) {
        const data = await res.json()
        setSpots(data.spots)
      }
    }
    load()
  }, [])

  if (!spots) return <div className="manage-container">Loading...</div>

  return (
    <div className="manage-container">
      <h1>Manage Spots</h1>
      {spots.length === 0 ? (
        <button
          onClick={() => setModalContent(<CreateSpotModal />)}
          className="create-link"
        >
          Create a New Spot
        </button>
      ) : (
        <div className="spots-list">
          {spots.map(spot => {
            const preview = spot.SpotImages.find(img => img.preview) || {}
            return (
              <div key={spot.id} className="spot-card" onClick={() => {/* view detail */}}>
                <img src={preview.url} alt={spot.name} className="spot-thumb" />
                <div className="spot-info">
                  <span>{spot.city}, {spot.state}</span>
                  <span className="rating">{preview.stars ? preview.stars.toFixed(1) : 'New'} ★</span>
                </div>
                <div className="spot-price">${spot.price} night</div>
                <div className="spot-actions" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => {
                      setOnModalClose(() => () => setSpots(spots.filter(s => s.id !== spot.id)))
                      setModalContent(<CreateSpotModal spot={spot} />)
                    }}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                        setIsLoading(true)
                        
                      csrfFetch(`/api/spots/${spot.id}`, { method: 'DELETE' })
                        .then(() => setSpots(spots.filter(s => s.id !== spot.id)))
                        .finally(() => setIsLoading(false))
                    }}
                  >
                    {isLoading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
