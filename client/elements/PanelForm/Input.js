const inputTags = {
  input: 'input',
  textarea: 'textarea'
}

export default ({ error, value, label, id, onChange, textarea = false }) => {
  let Component = inputTags[textarea ? 'textarea' : 'input']

  return (
    <div className='panel-form__row'>
      <label className='panel-form__label' htmlFor={id || null}>{label}</label>
      <Component className={[ 'panel-form__input', textarea ? 'panel-form__input_textarea' : '' ].join(' ')} id={id || null} value={value} onChange={onChange} type='text' />
      { error && <div className='panel-form__error'>{error}</div> }
    </div>
  )
}
