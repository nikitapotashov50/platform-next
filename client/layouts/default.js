import PageHOC from '../hocs/Page'
import Header from '../components/Header/index'

export default (WrappedComponent) => {
  const DefaultLayout = props => (
    <div className='app'>
      <Header />

      <div className='app__content'>
        <WrappedComponent {...props} />
      </div>
    </div>
  )

  return PageHOC(DefaultLayout)
}
