import DefaultLayout from './default'
import Panel from '../components/Panel'

const FeedLayout = ({ children, emptySide, Side = [] }) => (
  <DefaultLayout>
    <div className='feed'>
      <div className='feed__left'>
        {children}
      </div>

      { !emptySide && (
        <div className='feed__right'>
          { (Side.length > 0) && Side.map(el => el)}
          <div className='Beta__overflow'>
            <div className='Beta__title'>Это beta-версия нового поколения IT-платформы БМ</div>
            <div className='Beta__desc'>Теперь система сама будет вести вас до результата. Нейросеть приведет вас к вашей точке B.</div>
          </div>
          {/* <Panel Header={<div className='panel__title'>Боковая панель</div>}>
            Здесь контент
          </Panel> */}
        </div>
      ) }
    </div>
  </DefaultLayout>
)

export default FeedLayout
