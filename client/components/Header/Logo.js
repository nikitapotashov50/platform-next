import Link from 'next/link'

export default () => (
  <div className='logo'>
    <Link href='/'>
      <a className='logo__link'>
        <img className='logo__image' src='/static/img/logo.png' alt='Система' />
      </a>
    </Link>

    <style jsx>{`
      .logo {
        left: 0;
        position: absolute;

        display: inline-block;
      }
      .logo__link {
        display: flex;
        width: 41px;
        height: 59px;
        align-items: center;
      }
      .logo__image {
        width: 41px;
        height: 36px;
      }

      @media screen and (max-width: 39.9375em) {
        .logo {
          left: 10px;
        }
      }
    `}</style>
  </div>
)
