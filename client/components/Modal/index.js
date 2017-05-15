// import ReactDOM from 'react-dom'
// import React, { Component } from 'react'

// class Modal extends Component {
//   componentDidUpdate () {
//     if (!this.props.isOpened) return null

//     let { width, height, children, isOpened = false, onClose } = this.props

    // let contentStyles = {}
    // if (width) contentStyles['maxWidth'] = width + 'px'
    // if (height) contentStyles['height'] = height + 'px'

//     ReactDOM.render(
//       <div className='modal__overlay' onClick={onClose} >
//         <div className='modal__content' style={contentStyles} onClick={e => e.stopPropagation()}>
//           <button className='modal__close' onClick={onClose} />
//           {children}
//         </div>
//       </div>,
//       document.getElementById('modal-portal')
//     )
//   }

//   render () {
//     return <span />
//   }
// }

const Modal = ({ width, height, children, isOpened = false, onClose }) => {
  if (!isOpened) return null

  let contentStyles = {}
  if (width) contentStyles['maxWidth'] = width + 'px'
  if (height) contentStyles['height'] = height + 'px'

  return (
    <div className='vue-modal-portal'>
      <div className='modal__overlay' onClick={onClose} >
        <div className='modal__content' style={contentStyles} onClick={e => e.stopPropagation()}>
          <button className='modal__close' onClick={onClose} />
          {children}
        </div>

      </div>
    </div>
  )
}

export default Modal
