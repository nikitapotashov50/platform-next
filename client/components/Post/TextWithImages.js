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
              max-width: 100%;
              height: 100%;
              max-height: 350px;
              margin-top: 15px;
            }
          `}</style>
        </div>
      )
    }
  )

  return (
    <div className='display-linebreak'>
      <div dangerouslySetInnerHTML={{ __html: content }} />
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
