import Panel from '../Panel'
// import UserInline from '../User/Inline'

export default props => {
  // let Footer = (
  //   <div className='nps-result' slot="footer">
  //     <div className='nps-result__row'>
  //       <div className='nps-result__row-title'>Качество контента: </div>
  //       {/* <rateBar className="nps-result__row-value" :inline="true" /> */}
  //     </div>
  //     <div className='nps-result__row'>
  //       <div className='nps-result__row-title'>Эмоции: </div>
  //       {/* <rateBar className="nps-result__row-value" :inline="true" /> */}
  //     </div>
  //     <div className='nps-result__row'>
  //       <div className='nps-result__row-title'>Организация: </div>
  //       {/* <rateBar className="nps-result__row-value" :inline="true" /> */}
  //     </div>
  //   </div>
  // )

  console.log(props)

  return (
    <Panel>
      <div className='post-preview'>
        <a className='post-preview__body'>{props.body}</a>
      </div>
    </Panel>
  )
}
