export default props => (
  <button onClick={props.onClick}>
    {props.children}

    <style jsx>{`
      button {
        background: #196aff;
        color: #fefefe;
        padding: 10px 20px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.25s ease-out;
      }

      button:hover {
        background: #0a00d9;
      }
    `}</style>
  </button>
)
