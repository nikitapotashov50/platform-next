import DefaultLayout from './default'
// import Panel from '../components/Panel'

const FeedLayout = ({ children, emptySide, Side = [] }) => (
  <DefaultLayout>
    <div className='feed'>
      <div className='feed__left'>
        {children}
      </div>

      { !emptySide && (
        <div className='feed__right'>
          { (Side.length > 0) && Side.map(el => el)}
          <div className='beta'>
            <div className='beta__overflow'>
              <div className='beta__title'>Это beta-версия нового поколения IT-платформы БМ</div>
              <div className='beta__desc'>Теперь система сама будет вести вас до результата. Нейросеть приведет вас к вашей точке B.</div>
            </div>
          </div>
          {/* <Panel Header={<div className='panel__title'>Боковая панель</div>}>
            Здесь контент
          </Panel> */}
        </div>
      ) }
    </div>
    <style jsx>{`
      .beta {
        box-sizing: border-bpx;

        position: relative;

        height: 185px;
        padding: 10px 15px;

        background: url('/static/img/beta.jpg') no-repeat;
        background-size: cover;
        border-radius: 3px;
      }
      .beta:before {
        z-index: -1;
        top: 0;
        left: 0;
        position: absolute;

        width: 100%;
        height: 100%;
        display: block;

        border-radius: 3px;
        background: -webkit-linear-gradient(top,rgba(30,87,153,0),rgba(0,0,0,.87));
        background: linear-gradient(180deg,rgba(30,87,153,0) 0,rgba(0,0,0,.87));
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#001e5799",endColorstr="#de000000",GradientType=0);
        
        content: '';
      }
      .beta__title {
        padding-top: 72px;

        color: #fff;
        font-weight: 700;
        font: 18px/22px museo_sans_cyrl,Arial,sans-serif;
      }
      .beta__desc {
        font: 12px/17px museo_sans_cyrl,Arial,sans-serif;
        font-weight: 700;
        color: #9f9f9f;
        margin-top: 4px;
        letter-spacing: -1px;
      }
    `}</style>
  </DefaultLayout>
)

export default FeedLayout
