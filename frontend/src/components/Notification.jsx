import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(({ notification }) => notification)

  if (!notification) return null

  const notificationStyle = {
    color: notification.isSuccessful ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  }

  return (
    <div data-testid={'notification'} style={notificationStyle}>
      {notification.message}
    </div>
  )
}
export default Notification
