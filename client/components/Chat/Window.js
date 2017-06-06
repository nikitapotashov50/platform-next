const ChatWindow = ({ children }) => (
  <div>
    {children}

    <style jsx>{`
      div {
        position: fixed;
        background: #fff;
        box-sizing: border-box;
        top: 70px;
        left: 60%;
        transform: translateX(-60%);
        /*right: 220px;*/
        border-radius: 3px;
        border: 1px solid #e1e3e4;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
        /*max-height: 500px;*/
        overflow: auto;
      }
    `}</style>
  </div>
)

export default ChatWindow
