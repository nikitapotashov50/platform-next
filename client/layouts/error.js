import Link from 'next/link'
import DefaultLayout from '../layouts/default'

export default ({ children, code, message, ...props }) => (
  <DefaultLayout>
    <div className='error-page'>
      <img src='/static/img/logo.png' alt='Система' style={{ display: 'block', width: '41px', height: '36px', margin: '0 auto' }} />
      <br />
      <br />
      {/* <div className='error-page__code'>{code}</div>
      <div className='error-page__message'>{message}</div> */}
      <div className='error-page__message'>Страница недоступна</div>
      <br />
      <Link href='/'>
        <a>На главную</a>
      </Link>

      { children && children }
    </div>

    <style jsx>{`
      .error-page {
        padding-top: 60px;
        text-align: center;
      }
      .error-page__code {
        font-size: 120px;
        font-weight: bold;
      }
      .error-page__message {
        font-size: 24px;
      }
    `}</style>
  </DefaultLayout>
)
