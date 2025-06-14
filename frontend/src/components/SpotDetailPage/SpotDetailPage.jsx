import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchSpotDetail } from '../../store/spotDetail'
import { useModal } from '../../context/Modal'
import ReviewFormModal from '../ReviewFormModal/ReviewFormModal'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import './SpotDetailPage.css'
import Loader from '../Loader'
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import BookingModal from '../BookingModal/BookingModal'
import LoginFormModal from '../LoginFormModal/LoginFormModal'

export default function SpotDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const sessionUser = useSelector(state => state.session.user)
  const { setModalContent } = useModal()

  const { spot, reviews, loading } = useSelector(state => state.spotDetail)

  useEffect(() => {
    dispatch(fetchSpotDetail(id))
  }, [dispatch, id])

  // Calculate avgStars
  const avgStars = useMemo(() => {
    if (!reviews || reviews.length === 0) return null
    const total = reviews.reduce((sum, r) => sum + r.stars, 0)
    return total / reviews.length
  }, [reviews])

  if (loading || !spot || !spot.Owner) return <Loader />

  const isOwner = sessionUser?.id === spot.Owner.id
  const hasReviewed = sessionUser && reviews.some(r => r.userId === sessionUser.id)
  const canPost = sessionUser && !isOwner && !hasReviewed
  const canBook = sessionUser && !isOwner

  // These handlers would dispatch actions to update Redux state if you want full Redux control
  const handleNewReview = newReview => {
    dispatch({
      type: 'spotDetail/SET_REVIEWS',
      reviews: [newReview, ...reviews]
    })
  }

  const handleDelete = deletedId => {
    const updated = reviews.filter(r => r.id !== deletedId)
    dispatch({
      type: 'spotDetail/SET_REVIEWS',
      reviews: updated
    })
  }

  const previewImg = spot.SpotImages.find(img => img.preview)
  const smallImgs = spot.SpotImages.filter(img => !img.preview)

  // Format the ratings summary consistently
  const ratingSummary = (
    <>
      <span className="star-rating">{avgStars !== null ? avgStars.toFixed(1) : 'New'} ★</span>
      <span className="dot-separator">·</span>
      <span className="review-count">{reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}</span>
    </>
  );

  return (
    <div className="detail-container">
      <h1>{spot.name}</h1>
      <p className="location">
        {spot.city}, {spot.state}, {spot.country}
      </p>

      <div className="spot-detail-main">
        {/* LEFT: Images */}
        <div className="images-section">
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

        {/* RIGHT: Info */}
        <div className="info-section">
          <div className="description-section">
            <h2>
              Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
            </h2>
            <p>{spot.description}</p>
          </div>
          {
            canBook ? (
          <div className="reservation-box">
            <div className="price">
              ${spot.price} <span>night</span>
            </div>
            {/* Add rating summary in the reservation box */}
            <div className="rating-summary">
              {ratingSummary}
            </div>
            <OpenModalButton
              buttonText="Reserve"
              modalComponent={
                <BookingModal
                  spotId={spot.id}
                  onBookingSuccess={() => {/* Optionally refresh bookings or show a message */ }}
                />
              }
            />
          </div>
            ):
            (<div className="reservation-box">
              <p>You must be logged in and not an owner to book this spot.</p>
              <OpenModalButton
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
              />
            </div>)
          }

        </div>
      </div>

      {/* BELOW: Reviews */}
      <div className="reviews-section">
        {/* Update the rating header to use the same rating summary */}
        <div className="rating-header">
          {ratingSummary}
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