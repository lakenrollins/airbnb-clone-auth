import React from 'react'
import { useModal } from '../../context/Modal'
import { csrfFetch } from '../../store/csrf'
import './ConfirmModal.css'
import { useState } from 'react'

export default function ConfirmModal({ spotId, reviewId, onConfirm }) {
  const { closeModal } = useModal()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    const res = await csrfFetch(`/api/spots/${spotId}/reviews/${reviewId}`, {
      method: 'DELETE'
    })
    if (res.ok) {
      onConfirm(reviewId)
      closeModal()
    }
    setIsLoading(false)
  }

  return (
    <div className="confirm-modal">
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to delete this review?</p>
      <div className="buttons">
        <button className="btn-danger" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? 'Deleting...' : 'Yes (Delete Review)'}
        </button>
        <button className="btn-cancel" onClick={closeModal}>
          No (Keep Review)
        </button>
      </div>
    </div>
  )
}