import { connect } from 'react-redux'

const InlineError = ({ error = null }) => {
  if (!error) return null
  return (
    <div className='fixed-error'>
      {error.message}

      <style jsx>{`
        .fixed-error {
          right: 10px;
          bottom: 10px;
          position: fixed;

          display: block;
          padding: 0 15px;
          line-height: 28px;

          background: rgba(225, 67, 11, .09);
          border: 1px solid rgba(225, 67, 11, .75);
        }
      `}</style>
    </div>
  )
}

const mapStateToProps = ({ error }) => ({
  error: error.inlineError
})

export default connect(mapStateToProps)(InlineError)
