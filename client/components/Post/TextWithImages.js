const TextWithImages = ({ text }) => {
  const content = text.replace(
    /((https?):\/\/(.*?).(png|jpg))/gi,
    '<div><img src=\'$1\' width=\'100%\' /></div>'
  )

  return (
    <div>
      <div
        className='display-linebreak'
        dangerouslySetInnerHTML={{ __html: content }} />
      <style jsx>{`
        .display-linebreak {
          white-space: pre-line;
        }
      `}</style>
    </div>
  )
}

export default TextWithImages
