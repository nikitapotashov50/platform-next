const AuthLayout = ({ children }) => (
  <div className='app'>
    <div className='app__content app__content_centered'>
      <img src='/static/img/logo.png' alt='Система' style={{ display: 'block', width: '41px', height: '36px', margin: '0 auto' }} />
      <br />
      <br />

      {children}
    </div>
  </div>
)

export default AuthLayout
