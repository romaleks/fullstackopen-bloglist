const Notification = ({ message }) => {
  if (!message) return null

  const notificationStyle = {
    color: message.isSuccessful ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  }

  return <div style={notificationStyle}>{message.message}</div>
}
export default Notification
