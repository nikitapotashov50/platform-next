const ChatWindow = ({ children }) => (
  <div className='messages__wrap'>
    {children}

    <style jsx>{`
      div {
        position: fixed;
        background: #fff;
        box-sizing: border-box;
        top: 59px;
        right: -200px;
        transform: translateX(-50%);
        /*right: 220px;*/
        border-radius: 3px;
        box-shadow: 0px 12px 46px 0px rgba(45, 45, 45, 0.41);
        overflow: auto;
      }
    `}</style>
  </div>
)

export default ChatWindow
