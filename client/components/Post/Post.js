import TextWithImages from './TextWithImages'

const Post = ({ id, title, content }) => (
  <div className='post'>
    <h1>#{id} {title}</h1>
    <TextWithImages text={content} />

    <style jsx>{`
      .post {
        padding: 15px 20px 12px;
        margin: 0 0 15px;
        background: #fff;
        border: 1px solid #e1e3e4;
        border-radius: 3px;
      }
    `}</style>
  </div>
)

export default Post
