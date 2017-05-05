import PageHOC from '../hocs/Page'
import Header from '../components/Header/index'

export default (WrappedComponent) => {
  const DefaultLayout = props => (
    <div class='app'>
      <Header />

      <div class='app__content'>
        <WrappedComponent {...props} />
      </div>
    </div>
  )

  return PageHOC(DefaultLayout)
}
