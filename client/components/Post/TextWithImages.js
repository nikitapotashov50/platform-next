import reactStringReplace from 'react-string-replace'

const TextWithImages = ({ text }) => {
  const [content, images] = reactStringReplace(
    text,
    /((https?):\/\/(.*?).(png|jpg))/gi,
    (match, i, offset) => {
      return (
        <div>
          <img key={match + i + offset} src={match} />
          <style jsx>{`
            img {
              width: 100%;
              margin-top: 15px;
            }
          `}</style>
        </div>
      )
    }
  )

  return (
    <div className='display-linebreak'>
      {content}
      {images}
      <style jsx>{`
        .display-linebreak {
          white-space: pre-line;
        }
      `}</style>
    </div>
  )
}

export default TextWithImages
