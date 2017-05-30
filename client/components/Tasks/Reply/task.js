import Panel from '../../Panel'

export default props => (
  <Panel Header={<div className='panel__title panel__title_small'>Ответ</div>}>
    <form className='panel-form'>
      <div className='panel-form__row'>
        <label className='panel-form__label'>Ответ на задание</label>
        <textarea className='panel-form__input panel-form__input_textarea' type='text' />
      </div>
    </form>
  </Panel>
)
