import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserBookings, removeBooking } from '../../store/booking'
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import BookingModal from '../BookingModal/BookingModal'
import "./ManageBookings.css"

export default function ManageBookings() {
  const dispatch = useDispatch()
  const bookingState = useSelector(state => state.booking) || {}
  const { bookings = [], loading = false, error = null } = bookingState
  const sessionUser = useSelector(state => state.session.user)

  useEffect(() => {
    if (sessionUser) dispatch(fetchUserBookings())
  }, [dispatch, sessionUser])

  const handleCancel = bookingId => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      dispatch(removeBooking(bookingId))
    }
  }

  if (!sessionUser) return <div>Please log in to view your bookings.</div>
  if (loading) return <div>Loading your bookings...</div>
  if (error) return <div className="error">{error}</div>
  if (!bookings.length) return <div>You have no bookings yet.</div>

  return (
    <div className="manage-bookings-container">
      <h2>Your Bookings</h2>
      <ul className="booking-list">
        {bookings.map(booking => (
          <li key={booking.id} className="booking-card">
            <div>
              <strong>Spot:</strong> {booking.Spot?.name || 'N/A'}
            </div>
            <div>
              <strong>Location:</strong> {booking.Spot?.city}, {booking.Spot?.state}
            </div>
            <div>
              <strong>Dates:</strong> {booking.startDate} to {booking.endDate}
            </div>
            <div className="reservation-box small">
              <OpenModalButton
                buttonText="Edit"

                modalComponent={
                  <BookingModal
                    booking={booking}
                    onBookingSuccess={() => dispatch(fetchUserBookings())}
                  />
                }
              />
              <button
                className="cancel-booking-btn"
                onClick={() => handleCancel(booking.id)}
              >
                Cancel Booking
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}