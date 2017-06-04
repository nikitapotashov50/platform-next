export default ({ children, disabled, onClick, type }) => (
  <button className={[ 'btn', type ? `btn_${type}` : '' ].join(' ')} onClick={onClick} disabled={disabled}>
    {children}

    <style jsx>{`
      .btn {
        box-sizing: border-box;
        position: relative;

        margin-right: 10px;
        padding: 10px 20px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 0.9rem;

        color: #fefefe;
        background: #196aff;
        border: 1px solid transparent;
        transition: background-color 0.25s ease-out, border-color .25s;
      }

      .btn, .btn:disabled:hover { background: #196aff; }
      .btn:hover { background: #0a00d9; }

      .btn_reject {
        color: #1f1f1f;
        background: #fff;
        border-color: #e1430b;
      }
      .btn_reject:hover {
        background: color(#e1430b a(-90%));
        border-color: color(#e1430b a(-25%));
      }
    
      .btn:disabled { cursor: not-allowed; }

      .btn:disabled:after {
        top: 0;
        left: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        display: block;
        background: rgba(255, 255, 255, .35);
      }
    `}</style>
  </button>
)
