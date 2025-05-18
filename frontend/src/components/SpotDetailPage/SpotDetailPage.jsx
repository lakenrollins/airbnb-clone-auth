// frontend/src/components/SpotDetailPage/SpotDetailPage.jsx

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { csrfFetch } from '../../store/csrf'
import { useModal } from '../../context/Modal'
import ReviewFormModal from '../ReviewFormModal/ReviewFormModal'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import './SpotDetailPage.css'
import Loader from '../Loader'

export default function SpotDetailPage() {
   const { id } = useParams()
  const sessionUser = useSelector(state => state.session.user)
  const { setModalContent } = useModal()

  const [spot, setSpot]         = useState(null)
  const [reviews, setReviews]   = useState(null)   // start null
  const [avgStars, setAvgStars] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const [spotRes, revRes] = await Promise.all([
        csrfFetch(`/api/spots/${id}`),
        csrfFetch(`/api/spots/${id}/reviews`)
      ])

      const spotData = await spotRes.json()
      const revData  = await revRes.json()
      setSpot(spotData)
      setReviews(revData.Reviews)

      if (revData.Reviews.length > 0) {
        const total = revData.Reviews.reduce((sum, r) => sum + r.stars, 0)
        setAvgStars(total / revData.Reviews.length)
      }
    }
    fetchData()
  }, [id])

  // show loader until both spot + reviews have arrived
  if (!spot || reviews === null) return <Loader />
  // Don't render until we have both spot and its owner data
  if (!spot || !spot.Owner) return null

  const isOwner     = sessionUser?.id === spot.Owner.id
  const hasReviewed = sessionUser && reviews.some(r => r.userId === sessionUser.id)
  const canPost     = sessionUser && !isOwner && !hasReviewed

  const handleNewReview = newReview => {
    const updated = [newReview, ...reviews]
    setReviews(updated)
    const total = updated.reduce((sum, r) => sum + r.stars, 0)
    setAvgStars(total / updated.length)
  }

  const handleDelete = deletedId => {
    const updated = reviews.filter(r => r.id !== deletedId)
    setReviews(updated)
    if (updated.length > 0) {
      const total = updated.reduce((sum, r) => sum + r.stars, 0)
      setAvgStars(total / updated.length)
    } else {
      setAvgStars(null)
    }
  }

  const previewImg = spot.SpotImages.find(img => img.preview)
  const smallImgs  = spot.SpotImages.filter(img => !img.preview)

  return (
    <div className="detail-container">
      <h1>{spot.name}</h1>
      <p className="location">
        {spot.city}, {spot.state}, {spot.country}
      </p>

      <div className="images-grid">
        {previewImg && (
          <div
            className="main-image"
            style={{ backgroundImage: `url(${previewImg.url})` }}
          />
        )}
        <div className="small-images">
          {smallImgs.slice(0, 4).map((img, idx) => (
            <div
              key={idx}
              className="small-image"
              style={{ backgroundImage: `url(${img.url})` }}
            />
          ))}
        </div>
      </div>

      <div className="detail-main">
        <div className="description-section">
          <h2>
            Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
          </h2>
          <p>{spot.description}</p>
        </div>
        <div className="reservation-box">
          <div className="price">
            ${spot.price} <span>night</span>
          </div>
          <button onClick={() => alert('Feature coming soon')}>
            Reserve
          </button>
        </div>
      </div>

      <div className="reviews-section">
        <div className="rating-header">
          <span>
            {avgStars !== null ? avgStars.toFixed(1) : 'New'} ★
          </span>
          <span>
            {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
          </span>
        </div>

        {canPost && (
          <button
            className="post-review-btn"
            onClick={() =>
              setModalContent(
                <ReviewFormModal
                  spotId={spot.id}
                  onReviewAdded={handleNewReview}
                />
              )
            }
          >
            Post Your Review
          </button>
        )}

        <h3>Reviews</h3>
        {reviews.length === 0 && <p>No reviews yet</p>}

        <ul className="reviews-list">
          {reviews.map(r => (
            <li key={r.id} className="review">
              <strong>{r.User?.firstName || 'User'}</strong>
              <span>{r.stars} ★</span>
              <p>{r.review}</p>
              {sessionUser?.id === r.userId && (
                <button
                  className="delete-review-btn"
                  onClick={e => {
                    e.stopPropagation()
                    setModalContent(
                      <ConfirmModal
                        spotId={spot.id}
                        reviewId={r.id}
                        onConfirm={handleDelete}
                      />
                    )
                  }}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}