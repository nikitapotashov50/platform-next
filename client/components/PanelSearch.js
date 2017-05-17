export default ({ placeholder, absolute, value, onChange }) => (
  <div className={[ 'panel-search', !absolute ? 'panel-search_static' : '' ].join('')}>
    <input className='panel-search__input' type='text' onChange={onChange} value={value} placeholder={placeholder} />
  </div>
)
