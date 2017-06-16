export default props => (
  <style jsx global>{`
    @reset-global pc;

    @font-face {
      font-family: 'museo_sans_cyrl';
      src: url('/static/fonts/museosanscyrl_500-webfont.woff2') format('woff2'),
          url('/static/fonts/museosanscyrl_500-webfont.woff') format('woff'),
          url('/static/fonts/museosanscyrl_500-webfont.ttf') format('truetype'),
          url('/static/fonts/museosanscyrl_500-webfont.svg#museo_sans_cyrl500') format('svg');
      font-weight: 500;
      font-style: normal;

    }

    @font-face {
        font-family: 'museo_sans_cyrl';
        src: url('/static/fonts/museosanscyrl_700-webfont.woff2') format('woff2'),
            url('/static/fonts/museosanscyrl_700-webfont.woff') format('woff'),
            url('/static/fonts/museosanscyrl_700-webfont.ttf') format('truetype'),
            url('/static/fonts/museosanscyrl_700-webfont.svg#museo_sans_cyrl700') format('svg');
        font-weight: 700;
        font-style: normal;

    }

    @define-placeholder museo {
      font-family: 'museo_sans_cyrl', Helvetica, Arial, sans-serif;
    }

    /* width */
    $container-width: 875px;
    $gap-width: 15px;

    $transition-time: .3s;

    html {
      font-size: 14px;
      -webkit-font-smoothing: antialiased;
    }

    body {
      padding-bottom: 28px;
      color: #1f1f1f;
      background: #edeeee;
      @extend museo;
      -webkit-font-smoothing: antialiased;
      -webkit-tap-highlight-color: rgba(255, 255, 255, 0);

    }

    img {
      vertical-align: middle;
    }

    a {
      transition: color $transition-time;

      color: #0c00ff;
      text-decoration: none;
      &:hover {
        color: color(#0c00ff b(+40%));
      }
    }

    h1, h2, h3, h4, h5, h6 {
      @extend museo;
      color: #1f1f1f;
      font-weight: 700;
    }

    textarea, input {
      box-sizing: border-box;

      width: 100%;
      display: block;
      padding: 7px 10px;
      border: 1px solid #ebebeb;
    }

    input::-webkit-input-placeholder {color:#9f9f9f;},
    input::-moz-placeholder {color:#9f9f9f;}
    input:-moz-placeholder {color:#9f9f9f;}
    input:-ms-input-placeholder {color:#9f9f9f;}
    textarea::-webkit-input-placeholder {color:#9f9f9f;}
    textarea::-moz-placeholder {color:#9f9f9f;}
    textarea:-moz-placeholder {color:#9f9f9f;}
    textarea:-ms-input-placeholder {color:#9f9f9f;}

    button {
      border: none;
      outline: none;
      background: none;
    }

    .marked-content {}
    .marked-content p {
      margin: 15px 0;
      &:last-of-type { margin-bottom: 0; }
      &:first-of-type { margin-top: 0; }
    }

    .pull-right {
      text-align: right;
    }

    .text {
      line-height: 140%;
    }

    .text-center {
      text-align: center;
    }

    .noscroll {
      overflow: hidden !important;
    }

    .app {
      &__content {
        padding-top: 60px;

        margin: 0 auto;
        max-width: $container-width;

        &_centered { text-align: center; }
      }
    }

    .feed {
      padding-top: 10px;
      margin-left: -7.5px;
      margin-right: -7.5px;

      &__left, &__right {
        box-sizing: border-box;
        padding: 0 7.5px;
        vertical-align: top;
        display: inline-block;
      }

      &__left {
        width: 66%;
        &_wide { width: 80%; }
      }
      &__right {
        width: 33%;
        &_narrow { width: 20%; }
      }
    }

    .user-page {
      &__header {
        border-radius: 0 0 3px 3px;

        margin-bottom: 30px;
      }

      &__content {
        margin: 0 -7.5px;
        display: block;
      }

      &__content-block {
        box-sizing: border-box;
        padding: 0 7.5px;
        vertical-align: top;
        display: inline-block;
        &_side {
          width: 300px;
        }
        &_body {
          width: calc(100% - 300px);
        }
      }
    }

    .up-header {
      position: relative;
      width: 100%;
      height: 198px;
      background-color: #7a7a7a;
      background-position: 0 0;
      background-repeat: repeat;
      background-size: cover;
      background-image: url('/static/img/profile/default-bg.jpg');

      &__image {
        border-radius: 3px;
        top: 52px;
        left: 71px;
        position: absolute;
        width: 158px;
        height: 158px;
        display: block;
        background: #000;
        border: 2px solid #fff;
      }

      &__buttons {
        right: 10px;
        bottom: 10px;
        position: absolute;
      }

      &__button {
        border-radius: 3px;
        transition: background $transition-time;
        margin: 0 0 0 5px;
        padding: 10px 15px;
        color: #fff;
        color: #fefefe;
        border: 0 none;
        font-size: 12px;
        font-weight: 700;
        text-transform: none;
        background-color: rgba(0,0,0,.4);
        cursor: pointer;
        &:hover, &_active { background-color: #196aff; }
      }
    }

    .panel {
      position: relative;
      border-radius: 3px;

      margin-bottom: 12px;

      background: #fff;
      border: 1px solid #e1e3e4;

      &_margin {
        &_small { margin-bottom: 10px; }
        &_negative { margin-bottom: -2px; }
        &_top-negative { margin-top: -1px; }
      }
      &_no_border { border-bottom: none; border-radius: 3px 3px 0 0; }
      &_no_margin { margin-bottom: 0; }

      &__title {
        margin-bottom: 0;
        line-height: 29px;

        color: #1f1f1f;
        font-size: 21px;
        font-weight: 700;

        &_small {
          font-size: 18px;
          line-height: 22px;
        }
      }

      &__header {
        padding: 15px 20px;
        border-bottom: 1px solid #ebebeb;

        &_no-border { border-bottom: none }
        &_no-bottom-padding { padding-bottom: 0 }
      }

      &__sub-header {
        position: relative;

        margin: 0;
        padding: 12px 20px;

        background: #f7f8f9;
        border-top: 1px solid #ebebeb;
        border-bottom: 1px solid #ebebeb;

        &_no {
          &_padding { padding: 0; }
        }
      }

      &__options {
        top: 10px;
        right: 0;
        position: absolute;

        height: 30px;
        width: 30px;
      }

      &__body {
        padding: 15px 20px;
        line-height: 150%;
        /*word-break: break-all;*/

        &_no {
          &_padding { padding: 0; }
          &_vertical-padding {
            padding-top: 0;
            padding-bottom: 0;
          }
          &_horizontal-padding {
            padding-left: 0;
            padding-right: 0;
          }
        }
        &_padding {
          &_small { padding: 15px; }
          &_smallest { padding: 10px 15px; }
        }
      }
      &__footer {
        padding: 10px 15px;
        border-top: 1px solid #efeff0;
      }
      &__menu {
        border-bottom: 1px solid #e1e3e4;
        &_no_border { border-bottom: none; }
      }
    }

    .panel:first-child {
        border-radius: 0 0 3px 3px;
      }

    .task-sub-header {
      position: relative;
    
      &__title {
        line-height: 15px;
        color: #9f9f9f;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        @extend museo;
      }

      &__link {
        margin: 0 0 5px;
        overflow: hidden;
        line-height: 19px;
        color: #333;
        font-size: 14px;
        font-weight: 700;
        &:hover { color: #333; }
        &:visited, &:active { color: #777; }
      }

      &__status {
        right: 0;
        top: -3px;
        position: absolute;
        display: block;
        opacity: .75;
      }

      &__status_approved {
        background: #a6da41;
        border-radius: 3px;
        padding: 2px 5px;
        color: #fff;
        letter-spacing: 2px;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
      }

      &__status_pending {
        background: #dadde0;
        border-radius: 3px;
        padding: 2px 5px;
        color: #fff;
        letter-spacing: 2px;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
      }

      &__status_rejected {
        background: #e04e2c;
        border-radius: 3px;
        padding: 2px 5px;
        color: #fff;
        letter-spacing: 2px;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
      }
    }

    .panel-menu {
      position: relative;
      margin: 0 10px;
      display: block;
      height: 50px;
    
      

      &__item {
        margin: 0 5px 0 10px;
        vertical-align: top;
        float: left;
      }

      &__link {
        box-sizing: border-box;
        
        position: relative;
        z-index: 10;
        margin-bottom:-1px;

        display: block;
        padding-top: 2px;
        min-height: 50px;
        line-height: 46px;

        color: #2b2b2b;
        font-weight: 700;
        border-bottom: 2px solid transparent;

        &:hover, &:active, &_active { color: #196aff; }
      }

      &__item_bordered &__link {
        &:hover, &:active, &_active { border-bottom-color: #196aff; }
      }
    }

    .panel-search {
      top: 0;
      right: 10px;
      position: absolute;

      width: 150px;
      padding: 10px 0;

      &_static {
        position: static;
      }

      &__input {
        transition: border .3s;

        border-radius: 3px;
        box-sizing: border-box;

        height: 30px;
        padding: 0 8px;
        line-height: 28px;

        position: absolute;
        top: 10px;
        right: 10px;

        width: 30%;

        font-size: 13px;
        background: #fefefe;
        border: 1px solid #cacaca;

        &:focus {
          border-color: #8a8a8a;
        }
      }
    }

    .panel-form {
      margin: 0 -20px;

      &__row {
        margin-top: 10px;
        border-bottom: 1px solid #eee;
        &:last-of-type {
          border-bottom: none
        }
      }
      &__label {
        display: block;
        padding: 0 20px;
        height: 25px !important;
        line-height: 25px !important;
        color: #b5b5b5;
        font-size: 12px;
        text-transform: none;
      }

      &__select {
        border:0 none;
        background: none;
        height: 40px;
        display: block;
        padding: 0 20px 10px 20px;
        width: 100%;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-size: 9px 60px;
        background-repeat: no-repeat;
        background-position: right 10px top 10px;
        background-image: url(/static/img/dd-arrow.png);
      }

      &__input {
        appearance: none;

        height: 39px;
        display: block;
        line-height: 29px;
        padding: 0 20px 10px;

        border: none !important;
        outline: none !important;
        box-shadow: none !important;
        background: none;

        &:focus {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }

        &_textarea {
          resize: auto;
          height: auto;
          min-height: 125px;
        }
      }
      &__error {
        padding: 10px 15px;
        /* border-top: 1px solid #eee; */
        background: #f12a4a;
        border-radius: 3px;
        margin: 0 20px 10px;
        color: #fff;

      }

    
        &__error:before {
        content: ' ';
        position: relative;
        width: 0;
        height: 0;
        left: -15px;
        top: -5px;
        border: 15px solid;
        border-color:  transparent transparent #f12a4a #f12a4a ;
      }
      
      &__fake-input {
        padding: 0 20px 10px;
      }
      &__textarea {}
    }

    .user-inline {
      position: relative;
      display: block;

      &_small { width: 40px; padding: 0 10px; }
      &_smallest { width: 30px; }

      &__image-link {
        width: 50px;
        height: 50px;
        margin-right: 10px;
        vertical-align: top;
        display: inline-block;
        &_small {
          width: 40px;
        height: 40px;
      }
        &_smallest {
          width: 30px;
          height: 30px;
      }
      }

      &__image {
        border-radius: 50%;

        width: 50px;
        height: 50px;

        &_small {
          width: 40px;
          height: 40px;
        }
        &_smallest {
          width: 30px;
          height: 30px;
        }
      }

      &__body {
        max-width: 350px;
        vertical-align: top;
        display: inline-block;

        &_width {
          &_thin { max-width: 265px; }
        }
      }

      &__info {
        color: #7d7d7d;
        font-size: 12px;
        line-height: 15px;
      }

      &__title-block {
        margin-bottom: 6px;
      }

      &__title {
        margin-right: 10px;

        color: #1f1f1f;
        font-size: 14px;
        font-weight: 700;
        text-decoration: none;
      }

      &__when {
        color: #7d7d7d;
        font-size: 12px;
      }

      &__buttons {
        top: 0;
        right: 0;
        position: absolute;
      }

      &__money {
        top: 0;
        right: 0;
        position: absolute;

        margin-top: 2px;
        line-height: 18px;

        font-size: 12px;
        font-weight: 700;
      }
    }

    .task-status {
      border-radius: 3px;
      box-sizing: border-box;

      height: 21px;
      padding: 0 7px;
      line-height: 21px;
      display: inline-block;

      color: #fff;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .task-status_pending { background: #dadde0; }
    .task-status_rejected { background: #e04e2c; }
    .task-status_approved { background: #a6da41; }

    .user-badge {
      text-align: center;

      &__name {
        margin-bottom: 7.5px;
        margin-top: 10px;
        color: #1f1f1f;
        font-size: 21px;
        font-weight: 700;
      }

      &__info {
        font-size: 12px;
        line-height: 18px;
        color: #9f9f9f;
      }
      
      &__info-link {
        width: 30px;
        height: 30px;
        display: inline-block;
        background-repeat: no-repeat;
        background-size: 135px 65px;
        background-image: url('/static/img/social.png'); 
        margin-top:5px;
      }

      &__info-vk {
        background-position: -110px 5px;
      }
      &__info-vk:hover {
        background-position: -110px -40px;
      }

      &__info-facebook {
        background-position: -53px 5px;
      }
      &__info-facebook:hover {
        background-position: -53px -40px;
      }

      &__info-instagram {
        background-position: 5px 5px;
      }
      &__info-instagram:hover {
        background-position: 5px -40px;
      }

      &__info-website {
        display: block;
        color: #bbb;
        font-size:12px;
        font-weight: 700;
      }
    }

    .myBtn {
      box-sizing: border-box;

      margin: 0 !important;
      height: 39px;
      line-height: 29px;
      padding: 5px 20px;
      display: inline-block;

      color: #fff;
      font-size: 15px;
      background: #196aff;
      text-transform: none;

      border-radius: 3px;
      cursor: pointer;

      border: 1px solid #196aff;


      & + & { margin-left: 5px !important; }

      &_small {
        padding: 10px;
        font-size: 12px;
      }

      &_hollow {
        color: #0c00ff;
        border: 1px solid #0c00ff;
        background-color: transparent;

        &:disabled {
          opacity: .25;
          cursor: not-allowed;
        }

        &:hover, &:active, &:focus { background-color: transparent; }
      }

      &_thin {
        padding: 3.5px 20px;
        font-size: 10px;
      }
    }

    .reply-form {
      &__submit-block {
        margin: 15px 0;
      }

      &__input {
        box-sizing: border-box;
        border-radius: 3px 3px 3px 3px;

        height: 50px;
        display: block;
        padding: 0 15px;
        line-height: 50px;

        border: none !important;
        outline: none !important;
        box-shadow: none !important;

        &_text {
          &_big {
            font-size: 14px;
            font-weight: 700;
          }
          &_small {
            font-size: 13px;
          }
        }
      }

      &__textarea {
        resize: vertical;
        box-sizing: border-box;
        border-radius: 3px 3px 0 0;

        display: block;
        padding: 13px 10px 10px 15px;

        font-size: 13px;

        outline: none !important;
        box-shadow: none !important;
        border: solid #e1e3e4;
        border-width: 0 0 1px 0;

        &:focus, &:active {
          border-width: 0 0 1px 0;
          border-color: #e1e3e4;
        }

        &_short {
          border-radius: 3px 3px 3px 3px;
          resize: none;

          height: 50px;
          line-height: 50px;
          padding: 0 0 0 45px;

          border: none;
          background: svg("edit", "[fill]: #7f7f7f;") 16px 16px no-repeat #fff;
          background-size: 17px 17px;
        }
      }

      .panel {
        border-radius: 3px;
      }
    }

    .post-preview {
      &__title {
        line-height: 19px;
        margin-bottom: 5px;
        display: inline-block;

        color: #333;
        font-weight: 700;
        cursor: pointer;

        &:hover { color: #333; }
        &:visited, &:active { color: #777; }

        &:after {
          display: block;
          content: '';
        }
      }

      &__body {
        line-height: 20px;
        display: inline-block;

        color: #1f1f1f;
        &:hover { color: #1f1f1f; }
      }

      &__greetings {
        &_title {
          font-size:10px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #9f9f9f;
          font-weight: 700;
          display: block;
          width: 130px;
          float: left;
        }

        &_body {
          margin-left: 131px;
          display: block;
        }

        &_wrap {
          display: block;
          overflow: hidden;
          margin-top: 8px;
        }
      }
    }

    .post-summary {
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      min-height: 25px;

      &__block {
        &:after {
          clear: both;
          display: block;
          content: '';
        }
        &_left {
          display: flex;
          align-items: center;
        }
      }

      &__link {
        transition: color $transition-time;

        margin: 0 15px;
        line-height: 25px;
        vertical-align: top;
        display: inline-block;

        color: #8a8a8a;
        font-size: 13px;
        font-weight: 600;

        &:hover { color: #282828; }
      }

      &__info {
        line-height: 25px;
        vertical-align: top;
        display: inline-block;

        color: #9da5ab;
        font-size: 12px;
        font-weight: 500;

        & + & { margin-left: 15px; }

        &_icon {
          position: relative;

          padding-left: 25px;

          background: no-repeat;
          background-size: 18px 18px;
          background-position: center left;

          &_like { background-image: svg("like", "[fill]: #dadee1;"); }
          &_comment { background-image: svg("comment", "[fill]: #dadee1;"); }
        }

        &:before {
          content: attr(data-prefix);
        }
      }
    }

    .post-interact-btn {
      align-items: center;
      box-sizing: border-box;

      border-radius: 3px;

      padding: 5px;
      display: flex;
      margin-right: 10px;
      
      color: #9da5ab;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      user-select: none;

      &:hover {
        background: #f5f7fa;
      }

      &__text {
        padding-left: 5px;
      }
    }

    .rating-list {
      &__item {
        padding-bottom: 10px;
      }
    }

    .followers-list {
      &__item {
        padding: 15px 20px;
        border-bottom: 1px solid #ebebeb;

        &:last-of-type { border-bottom: none; }
      }
    }

    .panel-pager {
      position: relative;
      height: 19px;

      &:after {
        clear: both;
        display: block;
        content: '';
      }

      &__btn {
        &_left { float: left; }
        &_right { float: right; }
      }
    }

    .user-side-panel {
      &__title {
        line-height: 14px;
        display: block;
        color: #9f9f9f;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-top: 0;        
      }

      &__dz {
        background-position: right 6px;
        height: 25px;
        overflow: hidden;
        background-size: 14px 13px;
        background-repeat: no-repeat;
        background-image: url('/static/img/arrow-right.png');
      }

      &__dz a{
        display: block;
        color:#000;
        font-size:13px;
        font-weight: 700;
        line-height: 25px;
      }
      &__dz a:hover {
        color: #196aff;
      }

      &__body_padded { padding-top: 10px; }
    }

    .user-groups {
      &__item {
        display: block;
        margin-top: 10px;
      }
      &__image {
        width: 30px;
        height: 30px;

        vertical-align: top;
        display: inline-block;
      }
      &__body {
        box-sizing: border-box;

        padding-left: 10px;
        vertical-align: top;
        display: inline-block;
        width: calc(100% - 30px);
      }
      &__link {
        box-sizing: border-box;

        padding: 5px 0;
        min-height: 30px;
        line-height: 20px;
        display: inline-block;

        font-size: 14px;
        font-weight: 700;

        &, &:focus, &:active, &:hover { color: #1f1f1f; }
      }
    }

    .followers-tiles {
      margin: 8px -2px 0;

      &__item {
        aspect-ratio: '1:1';

        margin: 2px;
        vertical-align: top;
        display: inline-block;
        width: calc(33% - 4px);
      }

      &__image {
        width: 100%;
        height: 100%;

        background: no-repeat #f0f0f0;
        background-size: contain;

        &:after {
          bottom: 0;
          position: absolute;

          // width: 100%;
          display: block;
          line-height: 13px;
          padding: 15px 5px 4px;

          color: #fff;
          font-size: 11px;
          background: linear-gradient(180deg,rgba(2,1,1,0) 0,rgba(2,1,1,0) 3%,rgba(3,1,1,.81) 49%,rgba(5,1,1,.81));

          content: attr(data-name);
        }
      }

      &__item:hover &__image:after {
        background: linear-gradient(180deg,rgba(2,1,1,0) 0,rgba(3,4,9,0) 3%,rgba(13,52,126,.81) 49%,rgba(25,106,255,.81));
      }
    }

    .profile-goal {
      position: relative;
      // box-shadow: inset 0 1px 0 0 rgba(0,0,0,.14);
      border-top: #ebebeb;

      &__progress {
        positin: absolute;

        height: 2px;
        display: block;
        background-color: rgb(35, 116, 255);

        &_completed {
          background-color: rgb(255, 116, 35);
        }
      }

      &__block {
        box-sizing: border-box;

        width: 50%;
        vertical-align: top;
        display: inline-block;
        padding: 10px 15px 15px;

        font-size: 14px;
        font-weight: 700;

        &:before {
          height: 20px;
          display: block;
          margin-top: 5px;
          line-height: 20px;

          color: #bbb;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;

          content: '';
        }

        &_a {
          border-right: 1px solid #e1e3e4;

          &:before { content: 'Точка А'; }
        }
        &_b {
          &:before { content: 'Точка Б'; }
        }
      }
    }

    .up-header__qr {
      display: none;
    }

    .user-menu {
      margin: 0;
      padding: 0;
      list-style: none;

      &__partial {
        display: inline-block;
      }

      &__item {
        position: relative;
        cursor: pointer;

        margin: 0;
        height: 59px;
        line-height: 59px;
        padding: 0 0;
        vertical-align: top;
        display: inline-block;

        border-left: 1px solid #f0f1f1;
        
        &_search-icon {
          padding: 0 15px;
          color: #c6cacb;
          font-size: 17px;
          height: 59px;
          display: block;
        }
        &_search-icon:hover {
          color: #7d8487;
        }

        &_hoverable {
          transition: background .3s;
          &:hover { background-color: #f0f0f0; }
        }

        select {

          background: none;
          -webkit-appearance:none;
          border: 0 none;
          height: 59px;
          padding: 0 5px;
          width: 120px;

          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="32" height="24" viewBox="0 0 32 24"><polygon points="0,0 32,0 16,24" style="fill: rgb%28138, 138, 138%29"></polygon></svg>');
        background-size: 9px 6px;
        background-position: 100%;
        background-origin: content-box;
        background-repeat: no-repeat;

        }

        &_padded { padding: 9.5px 13px; }
        &_no {
          &_padding { padding: 0; }
        }
      }

      &__link {
        display: block;
        line-height: 59px;
        padding: 0 10px;
        cursor: pointer;

        &, &:hover, &:active, &:visited {
          color: rgb(35, 116, 255);
          text-decoration: none;
        }

        &_icon {
          transition: color $transition-time;

          position: relative;
          box-sizing: border-box;

          height: 59px;
          min-width: 60px;
          padding-left: 45px;
          padding-right: 15px;

          &, &:hover, &:active, &:visited { color: #9da5ab; }

          &:before {
            top: 0;
            bottom: 0;
            left: 19px;
            position: absolute;

            width: 18px;
            height: 18px;
            margin: auto;

            background: no-repeat;
            background-size: contain;

            content: '';
          }

          &_search {
            &:before { background-image: svg("search", "[fill]: #dadee1;"); }
            &:hover:before { background-image: svg("search", "[fill]: #cdd2d5;"); }
          }
          &_like {
            &:before { background-image: svg("like", "[fill]: #dadee1;"); }
            &:hover:before { background-image: svg("like", "[fill]: #cdd2d5;"); }
          }
        }
      }
    }

    .user-sub-menu {
      right: 0;
      top: 59px;
      position: absolute;

      list-style: none;
      background: #fff;
      border: 1px solid #e1e3e4;
      box-shadow: 0 6px 6px 0 rgba(42, 51, 69, .16);

      &__item {
        transition: background .3s;

        display: block;
        min-width: 200px;

        &:hover { background: #f0f0f0; }
      }

      &__link {
        display: block;
        line-height: 22px;
        padding: 8px 15px !important;

        &, &:hover, &:active { color: #1f1f1f; }
      }
    }

    .programs-menu {

    &_hidden { display: none; }
      
      &__wrap {
        position: absolute;
        top: 60px;
        right: -30px;
        width: 240px;
        
        border-radius: 3px;

        background: #fff;
        padding: 15px 5px 5px 15px;
      box-shadow: 0px 12px 46px 0px rgba(45, 45, 45, 0.41);

      }

      &__item {
        position: relative;
        float: left;
        background: #e6e5e2;
        border-radius: 3px;
        width: 70px;
        height: 52px;
        margin: 0 10px 10px 0;
        padding-top: 18px;
        font-weight: 700;
        
        &:hover {
        opacity: 0.8;
        }
      }

      &__item-ceh {
        background: #fabc00;
        background-image: url('/static/img/programs.png');
        background-size: 199px 39px;
        background-position: 13px 15px;
        background-repeat: no-repeat;
        font-size: 20px;
        text-align: center;
        
        
      }

      &__item-mzs {
        background: #765dd2;
        background-image: url('/static/img/programs.png');
        background-size: 199px 39px;
        background-position: -67px 15px;
        background-repeat: no-repeat;
        font-size: 20px;
        text-align: center;
        color: #fff;
      }

      &__item-default {
        background: #22d69d;
        background-image: url('/static/img/programs.png');
        background-size: 199px 39px;
        background-position: -146px 15px;
        background-repeat: no-repeat;
      
      }

      &__old {
      float: left;
      width: 240px;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 10px;
        line-height: 10px;
        padding: 8px 0 18px 0;
        

        position: relative;
        z-index: 1;
        
        &:before {
            border-top: 1px solid #dfdfdf;
            content:"";
            margin: 0 auto; /* this centers the line to the full width specified */
            position: absolute; /* positioning must be absolute here, and relative positioning must be applied to the parent */
            top: 12px; left: -10px; right: 0; bottom: 0;
            width: 230px;
            z-index: -1;
        }

        span { 
            
            background: #fff; 
            padding: 0 10px 0 10px; 
        }

      }

      &__item-old {
        background-color: #cac9c8;
      }

      &__item-active:before {
        content:"";
        background-image: url('/static/img/programs-checked.png');
        background-size: 19px 19px;
        width: 19px;
        height: 19px;
        top: -7px;
        right: -7px;
        position: absolute;
      }

    }

    .programs-selected {
      position: relative;

      width: 64px;
      height: 60px;
      margin: 0 10px;
      background: url('/static/img/programs-active.png');
      background-position: 0 10px;
      background-size: 184px 25px;
      background-repeat: no-repeat;
      
      &_ceh { background-position: 4px 20px; }
      &_mzs { background-position: -69px 20px; }
      &_default { background-position: -144px 18px; }

      &:after {
      right: 0;
      position: absolute;

      width: 9px;
      height: 60px;
      display: block;
      
      background-size: 9px 60px;
      background-repeat: no-repeat;
      background-position: 0 28px;
      background-image: url('/static/img/dd-arrow.png');
      content: '';
      }
      &:hover:after {
        background-position: 0 -26px;
      }
    }

    .app-header {
      top: 0;
      left: 0;
      z-index: 100;
      position: fixed;

      width: 100%;
      height: 59px;

      background-color: #fefefe;
      border-bottom: 1px solid #e1e3e4;

      &__wrap {
        margin: 0 auto;
        width: $container-width;

        display: flex;
        justify-content: space-between;
      }

      &__block {
        display: block;
        &_menu {
          position: relative;
          padding-left: 50px;
        }
      }
    }

    .menu {
      margin: 0;
      width: 100%;

      list-style: none;

      display: flex;
      flex-wrap: nowrap;
      align-items: center;

      &__item {
        padding: 0 10px;

        &_no {
          &_padding-left { padding-left: 0; margin-right: 10px; }
        }
      }

      &__link {
        box-sizing: border-box;
        transition: border $transition-time;

        margin: 0 !important;
        padding: 0;
        height: 59px !important;
        line-height: 59px !important;

        display: block;
        color: #0c0c0c;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        
        border-bottom: 2px solid transparent;

        &_active {
          border-bottom-color: #196aff;
        }

        &:hover {
          color: #196aff;
        }

        &_notify {
          position: relative;
          padding-right: 25px;
        }
      }

      &__notify {
        border-radius: 50%;

        top: 0;
        right: 0;
        bottom: 0;
        position: absolute;

        width: 20px;
        height: 20px;
        margin: auto;
        display: block;
        line-height: 20px;

        color: #fff;
        font-size: 10px;
        text-align: center;
        background-color: #e04e2c;
      }
    }

    .post-full {
      box-sizing: border-box;

      margin: 0 auto;
      max-width: 800px;
      padding: 0px 40px 20px;
      /* max-width: 50rem; */

      background: #fff;
      border-bottom: 1px solid #e6e6e6;

      &__header {}

      &__header-info {
        color: #8a8a8a;
        font-size: 14px;
        line-height: 15px;

        &_link {
          color: #1f1f1f;
          font-weight: 700;
        }
        &_time {
          padding: 0 10px 0 37px;
          background: no-repeat;
          background-size: 15px 15px;
          background-position: 15px center;
          background-image: svg("clock", "[fill]: #1f1f1f;");
        }
      }

      &__comments {
        margin-top: 20px;
        border-top:
      }

      &__title {
        margin: 0 0 7.5px;

        font-size: 34px;
        font-weight: 700px;
      }

      &__footer {}

      &__content {
        font-family: Georgia, serif;
        font-size: 21px;
        padding: 30px 0;
        line-height: 150%;
      }
    }

    .comments {
      box-sizing: border-box;
      
      /* margin: 0 -15px;
      margin-bottom: 15px;
      max-width: 800px; */
      padding: 0;
      

      background: #fff;

      /* &_footer {
        margin-bottom: -10px;
      } */

      &__block {
        /* margin: 10px 0; */
        padding-left: 15px;
        padding-right: 15px;
        border-top: 1px solid rgb(235, 235, 235);

        &_list {
          padding-top: 10px;
          padding-bottom: 10px;
        }
        &_form {
          margin-bottom: 0;
        }
        &:first-of-type { border-top: none }
      }

      &__form {
        margin: 0 -15px;
        padding: 0 15px;
      }

      &__item {
        position: relative;

        margin: 10px 0;
        &_root { margin-bottom: 30px; }
      }

      &__more {
        transition: background .25s;

        width: 100%;
        height: 30px;
        line-height: 30px;
        margin-bottom: 10px;

        cursor: pointer;
        font-size: 12px;
        text-align: center;
        background: color(#efeff0 a(-5%));

        &:hover { background: color(#efeff0 a(-35%)); }
      }

      &__branch { padding-left: 60px; }

      &__branch-collapse {
        transform: rotate(180deg);
        transition: transform $transition-time;

        top: 0;
        right: -12px;
        z-index: 10;
        position: absolute;

        width: 12px;
        height: 12px;
        display: block;

        cursor: pointer;
        background: no-repeat;
        background-image: svg("chevron-down", "[fill]: #dadee1;");
        background-size: 12px 12px;

        &:hover { background-image: svg("chevron-down", "[fill]: #bbb;"); }

        &_collapsed {
          transform: rotate(0);
        }
      }
    }

    .comment {
      min-height: 40px;
      padding-left: 50px;
      margin-bottom: 20px;

      &:last-of-type { margin-bottom: 0; }

      &__header {
        position: relative;
        margin-left: -50px;
    }
      &__body { margin-top: -19px; word-wrap: break-word; }
      &__footer { margin-top: 5px; }
      &__remove {
        top: 0;
        right: 0;
        z-index: 2;
        position: absolute;

        cursor: pointer;
      }
    }

    .share {
      vertical-align: top;
      display: inline-block;

      &__label {
        line-height: 25px;
        vertical-align: top;
        display: inline-block;

        color: #9da5ab;
        font-size: 12px;
      }

      &__icon {
        width: 20px;
        height: 25px;
        margin-left: 10px;
        line-height: 25px;

        vertical-align: top;
        display: inline-block;

        background: no-repeat;
        background-position: center;

        &_vk {
          width: 30px;
          background-image: svg("vk", "[fill]: #bbb;");
        }
        &_facebook { background-image: svg("facebook", "[fill]: #bbb;"); }
        &_twitter { background-image: svg("twitter", "[fill]: #bbb;"); }
      }
    }

    .modal {
      &__overlay {
        top: 0;
        left: 0;
        z-index: 1000;
        position: fixed;

        width: 100%;
        height: 100%;

        background: rgba(0, 40, 100, .8);
      }
      &__content {
        border-radius: 3px;

        top: 0;
        left: 0;
        right: 0;
        position: absolute;

        padding: 16px;
        display: block;
        margin: 45px auto;

        background: #fff;
      }
      &__close {
        top: 16px;
        right: 18px;
        position: absolute;

        width: 12px;
        height: 12px;
        display: block;

        cursor: pointer;
        background: svg("close", "[fill]: #8a8a8a;") no-repeat;
        background-size: 12px 12px;

        &:hover { background-image: svg("close", "[fill]: color(#8a8a8a b(+5%));"); }
      }
    }

    .post-modal {
      top: 0;
      left: 0;
      z-index: 1000;
      position: fixed;

      width: 100%;
      height: 100%;
      display: block;
      overflow-y: scroll;

      background: rgba(0, 0, 0, .15);

      &__content {
        border-radius: 3px;
        position: relative;

        width: 56rem;
        display: block;
        margin: 15px auto;
        padding: 35px 15px 0;

        background-color: #fefefe;

        &:focus {
          outline: none;
        }
      }

      &__top {
        top: 0;
        left: 0;
        position: fixed;

        width: 100%;
        height: 59px;
        display: block;
        margin: 0 auto;

        cursor: pointer;

        &:before {
          height: 100%;
          width: 62rem;
          margin: 0 auto;
          display: block;

          background: svg("close", "[fill]: #8a8a8a;") no-repeat;
          background-size: 12px 12px;
          background-position: 98% 50%;

          content: '';
        }

        &:hover&:before { background-image: svg("close", "[fill]: color(#8a8a8a b(+5%));"); }
      }

      &__control {
        top: 0;
        bottom: 0;
        position: fixed;

        width: 50px;
        height: 100%;
        display: block;
        margin: auto 0;
        max-height: 560px;

        color: #fff;
        // background: rgba(0, 0, 0, .55);

        &_left { left: 15px; }
        &_right { right: 15px; }
      }
    }


    .login-form {
      box-sizing: border-box;

      padding: 20px;
      max-width: 375px;

      &__title {
        margin: 0 0 7.5px 0;

        font-size: 24px;
        text-align: left;
      }
      &__row {
        margin: 15px 0;

        &_double-margin { margin: 30px 0 15px; }
        &:last-of-type { margin-bottom: 0; }
        &_centered { text-align: center; }
      }
      &__label {
        padding: 0;
        display: block;
        margin: 0 0 6px;
        line-height: 16px;

        color: #b3b3b5;
        font-size: 12px;
        font-weight: 400;
        text-align: left;
        font-style: normal;
      }
      &__input {
        box-shadow: none;
        border-radius: 3px;
        box-sizing: border-box;

        width: 100%;
        height: 40px;
        display: block;
        padding: 0 10px;
        line-height: 40px;

        color: #232323;
        font-size: 16px;
        font-weight: 400;
        font-style: normal;
        background: #f8f9fc;
        border: 1px solid #dbe0e3;

        &::placeholder {
          font-size: 15px;
          color: #bbb;
        }
      }

      &__btn {
        border-radius: 3px;

        width: 100%;
        height: 40px;
        display: block;
        line-height: 20px;
        padding: 10px 20px;

        color: #fefefe;
        font-size: 15px;
        background: #196aff;
        text-transform: none;

        &:disabled {
          opacity: .25;
          cursor: not-allowed;
        }
      }

      &__link {
        color: #0c00ff;
      }
    }

    .modal-fade-enter-active, .modal-fade-leave-active {
      z-index: 1000;
      position: relative;
      transition: opacity .2s;
    }
    .modal-fade-enter, .modal-fade-leave-to, .modal-fade-leave-active {
      opacity: 0;
    }

    .auth-container {
      box-shadow: 2px 6px 6px 0 rgba(42, 51, 69, .16);

      padding: 15px;
      margin: 0 auto;
      max-width: 875px;
      display: inline-block;

      background: #fff;
    }

    .footer {
      height: 30px;
    }

    .error {
      margin: 30px 0;
      text-align: center;

      &__title {
        margin: 15px auto;
        line-height: 120px;

        font-size: 120px;
      }
    }

    .business-card {
      width: 600px;
      height: 333px;
      margin: 0 auto;

      background: #fff;
      border: 1px solid #e1e3e4;
      box-shadow: 0 6px 6px 0 rgba(42, 51, 69, .16);

      &__block {
        height: 100%;
        vertical-align: top;
        display: inline-block;

        &_left { width: 215px; }
        &_right { width: calc(100% - 215px); }
      }

      &__image {
        margin: 15px;
        width: 185px;
        height: 185px;

        background: #000;
      }
    }


    .nps-overall {
      display: flex;
      justify-content: space-between;

      &__item {
        padding: 0 14px;
        text-align: center;
      }

      &__title {
        font-size: 14px;
        line-height: 14px;
      }
      &__value {
        font-size: 28px;
        line-height: 28px;
      }
    }

    .rating-bar {
      &_inline { display: inline-block; }
    }

    .nps-result {

      &__row {
        position: relative;
      }
      &__row-title {
        font-size: 12px;
        line-height: 28px;
      }
      &__row-value {
        top: 0;
        right: 0;
        position: absolute;
      }
    }

    .rating-star {
      width: 30px;
      height: 33px;
      line-height: 33px;
      display: inline-block;
      
      color: #f5be00;
      font-size: 24px;

      &_clickable {
        cursor: pointer;
      }
    }

    .pager {
      margin-bottom: 15px;
      text-align: center;

      &__btn {
        transition: color $transition-time, border $transition-time, background $transition-time;
        box-sizing: border-box;

        height: 28px;
        margin: 0 3.5px;
        line-height: 14px;
        padding: 7px 14px;
        vertical-align: top;
        display: inline-block;

        color: #337ab7;
        background-color: #fff;
        border: 1px solid #ddd;

        &:hover, &_active {
          color: #23527c;
          background-color: #eee;
          border-color: #ddd;
        }

        &_control { margin: 0 14px; }
      }
      &__dots {
        height: 28px;
        margin: 0 14px;
        line-height: 28px;

        vertical-align: top;
        display: inline-block;
      }
    }

    .fade_in {
      animation-duration: 0.5s;
      animation-name: fadeIn;
    }

  /*  Мобильные стили */
  @media screen and (max-width: 39.9375em) {

      textarea {
        font-size: 16px;
        line-height: 140%;
      }

      .menu {
        padding: 0;
        display: none;

        &_expanded {
          left: 0;
          top: 59px;
          z-index: 1001;
          position: fixed;
          display: block;

          background: #fff;
          border-bottom: 1px solid #efefef;
          box-shadow: 0 1px 3px 0 #efefef;

          &:before {
            left: 0;
            top: 59px;
            z-index: 999;
            position: fixed;
            width: 100%;
            height: 100%;
            display: block;

            background: rgba(0, 0, 0, .15);
            content: '';
          }
        }

        &__item {
          z-index: 1001;
          position: relative;
          padding: 0;

          background: #fff;
          text-align: center;

          &:last-of-type {
            padding-bottom: 10px;
          }
        }

        &__link {
          height: 40px !important;
          line-height: 40px !important;
          border-bottom: none;
          &_active {
            color: #196aff;
          }
        }

        &__item_no_padding-left {
          display: block;
        }
        
      }

      .rating-star {
        width: 10%;
      }

      .up-header__qr {
        display: block;
        position: absolute;
        left: 10px;
        top: 10px;
        border: 3px solid #fff;
        background: #fff;
      }

      .app-header {

        &__wrap {
          width: 100%;
        }
      }

      .feed {

        margin: 0;

        &__left {
          width: 100%;
          padding: 0;
        }

        &__right {
          display: none;
        }
      }

      .panel {
        border-radius: 0;
      }

      .panel-menu {
        height: 50px;
        
        white-space: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        -ms-overflow-style: -ms-autohiding-scrollbar; 
        margin-bottom: 0;
      }

      .panel-menu ::-webkit-scrollbar {
          display: none; 
      }


      .user-sub-menu {

      &__item {

        min-width: 250px;

      }

      &__link {

        padding: 16px 15px !important;
        font-size: 15px;
      }
    }

      .comment {

        &__header .user-inline {


          &__when {
            display: none;
          }
      }

      }

      .user-inline {

          &__title {
            display: block;
          }
          &__body {
            max-width: 215px;
          }

      }


      .user-menu {

        &__item {

          select {
            display: none;
            
          }
        }

      }


      .post-modal {

      &__content {
        padding:0;
        width: 100%;

        }

    }


    .post-full {

      &__content {
        line-height: 150%;
      }

    }

      .user-page {
      &__header {
        margin-bottom: 30px;
      }

      &__content {
        margin: 0;
  
      }

      &__content-block {
        padding: 0;


        &_side {
          width: 100%;
        }
        &_body {
          width: 100%;
        }
      }
    }


    .reply-form {

      &__input {
        border-radius: 0;
        font-size: 16px;
      }

      &__textarea {
        border-radius: 0;
        font-size: 16px;
        line-height: 140%;
      }

      &__textarea {


        &_short {
          border-radius: 0;
          font-size: 16px;
          padding: 13px 0 0 45px;


        }
      }
    }

    .up-header {
      &__image {
        left: 50%;
        margin-left:-79px;
      }

      &__buttons {
        top: 10px;
        right: 10px;
      }

      &__button {
        background: rgb(35, 116, 255);
        width: 100px;
        padding: 10px 10px;
        font-size: 12px;
      }

      &__send-msg {
        display: none;
      }
    }

    .panel-form {
      &__input {
        &_textarea {
          font-size: 16px;
          line-height: 140%;
        }
      }
    }

    .post-preview {
      &__greetings {
        &_title {
          width: 100%;
          display: block;

        }

        &_body {
          margin-left: 0;
          display: block;
          width: 100%;
        }

        &_wrap {
          display: block;
          overflow: hidden;
          margin-top: 8px;
        }
      }
    }


  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 100%;
    }
  }
  `}</style>
)
