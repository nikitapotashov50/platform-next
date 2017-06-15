import FaqEntry from './Entry'
import Panel from '../Panel'

export default ({ items = [] }) => (
  <Panel>
    <div className='faq-container'>
      { (items.length > 0) && items.map(el => (
        <div className='faq-container__item'>
          <FaqEntry item={el} />
        </div>
      ))}
    </div>

    <style jsx>{`
      .faq-container {}
      .faq-container__item {
        margin: 0 0 20px;
      }
      .faq-container__item:last-of-type {
        margin-bottom: 0;
      }
    `}</style>
  </Panel>
)
