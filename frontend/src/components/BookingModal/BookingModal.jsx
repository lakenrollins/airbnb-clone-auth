import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBooking, editBooking } from '../../store/booking'
import './BookingModal.css'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../context/Modal'

export default function BookingModal({ spotId, booking, onBookingSuccess}) {
  const dispatch = useDispatch()
  const [startDate, setStartDate] = useState(booking?.startDate || '')
  const [endDate, setEndDate] = useState(booking?.endDate || '')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { closeModal } = useModal()

  const isEdit = !!booking

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (isEdit) {
        await dispatch(editBooking(booking.id, { startDate, endDate }))
      } else {
        await dispatch(createBooking(spotId, { startDate, endDate }))
      }
      if (onBookingSuccess) onBookingSuccess()
      closeModal()
      navigate(`/Bookings/manage`)
    } catch (err) {
      setError('Booking failed. Please check your dates.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="booking-modal-form" onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Edit Booking' : 'Book This Spot'}</h2>
      {error && <div className="error">{error}</div>}
      <label>
        Start Date
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          required
        />
      </label>
      <label>
        End Date
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          required
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? (isEdit ? 'Saving...' : 'Booking...') : (isEdit ? 'Save Changes' : 'Confirm Booking')}
      </button>
    </form>
  )
}