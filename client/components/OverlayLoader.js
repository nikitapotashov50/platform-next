export default ({ loading = false, children }) => (
  <div className='overlay-loader'>
    {children}

    { loading && (
      <div className='overlay-loader__loader' />
    )}

    <style jsx>{`
      .overlay-loader {
        position: relative;
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
