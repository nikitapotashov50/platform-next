import Header from '../components/Header/index'

const DefaultLayout = ({ children }) => (
  <div className='app'>
    <Header />

    <div className='app__content'>
      {children}
    </div>
  </div>
)

export default DefaultLayout