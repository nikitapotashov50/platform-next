export default props => (
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
    <style jsx>{`
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
  </div>
)
