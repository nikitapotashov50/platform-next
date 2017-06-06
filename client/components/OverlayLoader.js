export default ({ loading = false, children, full = false, noLoader = false }) => (
  <div className={[ 'overlay-loader', full ? 'overlay-loader_full' : '' ].join(' ')}>
    {children}

    { loading && (
      <div className='overlay-loader__loader'>
        { !noLoader && (<img className='overlay-loader__image' src='/static/img/loader.gif' alt='' />)}
      </div>
    )}

    <style jsx>{`
      .overlay-loader {
        position: relative;
      }

      .overlay-loader_full {
        top: 0;
        left: 0;
        position: fixed;

        width: 100%;
        height: 100%;
        display: block;
      }

      .overlay-loader__image {
        top: calc(50% - 15px);
        left: calc(50% - 15px);
        position: absolute;

        width: 30px;
        height: 30px;
        display: block;
      }

      .overlay-loader__loader {
        top: 0;
        left: 0;
        position: absolute;

        width: 100%;
        height: 100%;
        display: block;

        background: rgba(255, 255, 255, .6); 
      }
    `}</style>
  </div>
)
