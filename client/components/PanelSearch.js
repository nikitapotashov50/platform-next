export default ({ placeholder, absolute, value, onChange, onSubmit, searchInput }) => (
  <form className={[ 'panel-search', !absolute ? 'panel-search_static' : '' ].join('')} onSubmit={onSubmit}>
    <input className='panel-search__input' type='text' onChange={onChange} value={value} placeholder={placeholder} ref={searchInput} />
  </form>
)
