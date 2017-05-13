import DefaultLayout from './default'
import Panel from '../components/Panel'

const FeedLayout = ({ children }) => (
  <DefaultLayout>
    <div className='feed'>
      <div className='feed__left'>
        {children}
      </div>

      <div className='feed__right'>
        <Panel Header={<div className='panel__title'>Боковая панель</div>}>
          Здесь контент
        </Panel>
      </div>
    </div>
  </DefaultLayout>
)

export default FeedLayout
