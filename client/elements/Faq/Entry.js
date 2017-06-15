export default ({ item = {}, expanded = false }) => (
  <div className='faq-entry'>
    <span className={[ 'faq-entry__title', expanded ? 'faq-entry__title_expanded' : '' ].join(' ')}>{item.title}</span>
    <div className='faq-entry__body'>{item.content}</div>

    <style jsx>{`
      .faq-entry {}
      .faq-entry__title {
        display: block;
        margin: 0 0 10px;

        color: #196aff;
        cursor: pointer;
      }
      .faq-entry__content {}
    `}</style>
  </div>
)
