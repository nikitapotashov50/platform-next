export default ({ children, disabled, onClick }) => (
  <button onClick={onClick} disabled={disabled}>
    {children}

    <style jsx>{`
      button {
        position: relative;

        padding: 10px 20px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 0.9rem;

        color: #fefefe;
        background: #196aff;
        transition: background-color 0.25s ease-out;
      }
      button, button:disabled:hover { background: #196aff; }
      button:hover { background: #0a00d9; }
      button:disabled { cursor: not-allowed; }
      button:disabled:after {
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
