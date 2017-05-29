import React, { Component } from 'react'
import InputElement from 'react-input-mask'

class DateInput extends Component {
  render () {
    return <InputElement {...this.props} mask='99-99-9999' type='text' />
  }
}

export default DateInput

//  <InputElement
//         className='panel-form__input'
//         maskChar=''
//         formatChars={
//           "8": "[0-9]",
//           "a": "[A-Za-z]",
//           "*": "[A-Za-z0-9]"
//         }
//         value={isUndefined(affected.birthday) ? user.birthday || '' : affected.birthday} onChange={onChange.bind(this, 'birthday')}
//       />
