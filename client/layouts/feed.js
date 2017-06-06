import DefaultLayout from './default'

const FeedLayout = ({ children, menuItem = null, emptySide, Side = [], wide = false }) => (
  <DefaultLayout menuItem={menuItem}>
    <div className='feed'>
      <div className={[ 'feed__left', wide ? 'feed__left_wide' : '' ].join(' ')}>
        {children}
      </div>

      <div className={[ 'feed__right', wide ? 'feed__right_narrow' : '' ].join(' ')}>
        { (Side.length > 0) && Side.map(el => (
          <div key={Math.random()}>{el}</div>
        ))}

        { !emptySide && (
          <div>
            <div className='beta'>
              <div className='beta__overflow'>
                <div className='beta__title'>Это beta-версия нового поколения IT-платформы БМ</div>
                <div className='beta__desc'>Теперь система сама будет вести вас до результата. Нейросеть приведет вас к вашей точке B.</div>
              </div>
            </div>

            <div className='Products'>
              <a className='Products__schedule-title' target='_self' href='http://molodost.bz/shop/'>Ближайшие программы</a>

              <div className='Products__schedule-list'>

                <a className='Products__link' target='_blank' href='http://molodost.bz/coaching/?utm_source=bmplatform&utm_medium=partner&utm_campaign=platform_ceh_07042017'>
                  <div className='Products__date'>
                    <div className='Products__date-day'>17</div>
                    <div className='Products__date-month'>июн</div>
                  </div>

                  <div className='Products__text'>
                    <div className='Products__title'>ЦЕХ &mdash; Главная программа</div>
                    <div className='Products__description'>Двухмесяная программа</div>

                  </div>
                </a>

                <a className='Products__link' target='_blank' href='http://molodost.bz/million_coaching/?utm_source=bmplatform&utm_medium=partner&utm_campaign=platform_mzs_07042017'>
                  <div className='Products__date'>
                    <div className='Products__date-day'>20</div>
                    <div className='Products__date-month'>июн</div>
                  </div>

                  <div className='Products__text'>
                    <div className='Products__title'>Миллион за сто</div>
                    <div className='Products__description'>Главная ВИП программа</div>

                  </div>
                </a>

              </div>
            </div>

            {/* <Panel Header={<div className='panel__title'>Боковая панель</div>}>
              Здесь контент
            </Panel> */}
          </div>
        ) }
      </div>
    </div>
    <style jsx>{`
      .beta {
        box-sizing: border-bpx;

        position: relative;

        height: 185px;
        padding: 10px 7px;

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
        padding-top: 103px;

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

      .Products {
      width: 238px;
      background: #fff;
      border: 1px solid #e1e3e4;
      border-radius: 3px;
      padding: 15px 20px 10px 20px;
      color: #0c0c0c;
      margin-top:15px;
      }

      .Products__schedule-title {
        font: 10px/20px 'museo_sans_cyrl', Arial, sans-serif;
        font-weight: 700;
        text-transform: uppercase;
        color: #9f9f9f;
        letter-spacing: 3px;
        text-decoration: none;

      }
      .Products__schedule-title:hover, .Products__schedule-title:focus {
        color: #196aff;
        text-decoration: none;

      }

      .Products__link, .Products__link:hover, .Products__link:focus {
        padding: 15px 0 15px 0;
        text-decoration: none;
        display: block;
      }


      .Products__date {
        float: left;
        width: 40px;
        color: #196aff;
        text-decoration: none;
        font: 10px/20px 'museo_sans_cyrl', Arial, sans-serif;
        font-weight: 700;
      }
      .Products__date:hover, .Products__date:focus {
        text-decoration: none;

      }
      .Products__date-day {
        font-size: 27px;
      }
      .Products__date-month {
        font-size: 10px;
        letter-spacing: 3px;
        text-transform: uppercase;
      }

      .Products__title {
        font-size: 13px;
        color: #0f0f0f;
        font-weight: 700;
        line-height: 15px;

      }

      .Products__description {
        color: #969696;
        font-size: 11px;
        margin-top:5px;
      }

      .Products__text {
        margin-left: 50px;
        color: #0f0f0f;
        text-decoration: none;
      }

      .Products__text:hover, .Products__text:focus {
        color: #196aff;
        text-decoration: none;
      }

      .Products__link:hover .Products__title {
        color: #196aff;
      }
      .Products__link:hover .Products__description {
        color: #196aff;
      }

    `}</style>
  </DefaultLayout>
)

export default FeedLayout
