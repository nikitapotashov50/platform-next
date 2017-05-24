export default ({ placeholder, absolute, handleChange, searchInput, handleSubmit }) => (
  <form className={[ 'panel-search', !absolute ? 'panel-search_static' : '' ].join('')} onSubmit={handleSubmit} >
    <input className='panel-search__input' type='text' onChange={handleChange} value={searchInput} placeholder={placeholder} />
  </form>
)
