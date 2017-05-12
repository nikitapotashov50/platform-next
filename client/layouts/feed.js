import DefaultLayout from './default'
import Panel from '../components/Panel'

const FeedLayout = ({ children }) => (
  <DefaultLayout>
    <div className='feed'>
      <div className='feed__left'>
        {children}
      </div>

      <div className='feed__right'>
        <Panel>
          asdas
        </Panel>
      </div>
    </div>
  </DefaultLayout>
)

export default FeedLayout
