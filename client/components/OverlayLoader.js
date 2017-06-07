export default ({ loading = false, style = {}, children, full = false, noLoader = false }) => (
  <div className={[ 'overlay-loader', full ? 'overlay-loader_full' : '' ].join(' ')} style={style}>
    {children}

    { loading && (
      <div className='overlay-loader__loader'>
        { !noLoader && (<div className='cssload-zenith' />)}
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

      .overlay-loader__loader {
        top: 0;
        left: 0;
        position: absolute;

        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;

        background: rgba(255, 255, 255, .6); 
      }

      .cssload-zenith {
        width: 20px;
        height: 20px;
        margin: 0 auto;
        border-radius: 50%;
        border-top-color: transparent;
        border-left-color: transparent;
        border-right-color: transparent;
        box-shadow: 2px 2px 1px rgb(25, 106, 255);
        animation: cssload-spin 690ms infinite linear;
      }

      @keyframes cssload-spin {
        100%{ transform: rotate(360deg); transform: rotate(360deg); }
      }

      @-o-keyframes cssload-spin {
        100%{ -o-transform: rotate(360deg); transform: rotate(360deg); }
      }

      @-ms-keyframes cssload-spin {
        100%{ -ms-transform: rotate(360deg); transform: rotate(360deg); }
      }

      @-webkit-keyframes cssload-spin {
        100%{ -webkit-transform: rotate(360deg); transform: rotate(360deg); }
      }

      @-moz-keyframes cssload-spin {
        100%{ -moz-transform: rotate(360deg); transform: rotate(360deg); }
      }
    `}</style>
  </div>
)
