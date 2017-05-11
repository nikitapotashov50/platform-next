const Modal = ({ width, height, children, isOpened = false, onClose }) => {
  let contentStyles = {}
  if (width) contentStyles['maxWidth'] = width + 'px'
  if (height) contentStyles['height'] = height + 'px'
  if (!onClose) onClose = () => {}

  if (!isOpened) return null
  return (
    <div className='vue-modal-portal'>
      <div className='modal__overlay' onClick={onClose} >
        {/* tabIndex='-1' */}
        <div className='modal__content' style={contentStyles} onClick={e => e.stopPropagation()}>
          <button className='modal__close' onClick={onClose} />

          { children }
        </div>

      </div>
    </div>
  )
}

export default Modal
