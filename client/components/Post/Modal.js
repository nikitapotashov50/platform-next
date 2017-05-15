export default ({ children, isOpened, onPaginate, onClose }) => {
  if (!isOpened) return null

  const onPaginateClick = (direction, e) => {
    e.stopPropagation()
    onPaginate(direction)
  }

  const handleKeyPress = e => {
    switch (e.keyCode) {
      case 27:
        onClose()
        break
      case 37:
        onPaginate(-1)
        break
      case 39:
        onPaginate(1)
        break
      default:
        break
    }
  }

  return (
    <div className='post-modal' onClick={onClose}>
      <div className='post-modal__top' onClick={onClose} />

      <div className='post-modal__content' onClick={e => e.stopPropagation()} tabIndex={-1} onKeyDown={handleKeyPress} ref={ref => { if (ref) { ref.focus() } }}>
        {children}
      </div>

      <button className='post-modal__control post-modal__control_left' onClick={onPaginateClick.bind(this, -1)} />
      <button className='post-modal__control post-modal__control_right' onClick={onPaginateClick.bind(this, 1)} />
    </div>
  )
}
