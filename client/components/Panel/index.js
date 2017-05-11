import PanelBody from './Body'
import PanelHeader from './Header'
import PanelSubHeader from './SubHeader'

export default props => {
  let { noMargin, margin } = props
  let containerClasses = [ 'panel' ]

  if (noMargin) containerClasses.push('panel_no_margin')
  if (margin) containerClasses.push('panel_margin_' + margin)

  let { Header, headerStyles = {} } = props
  let { SubHeader, subHeaderStyles = {} } = props
  let { children, noBody, bodyStyles = {} } = props
  let { Menu } = props
  let { Footer } = props

  return (
    <div className={containerClasses.join(' ')}>

      { Header && (
        <PanelHeader {...headerStyles} noBorder={headerStyles.noBorder || (!!SubHeader && !Menu)}>
          <Header />
        </PanelHeader>
      )}

      { Menu && (
        <div className='panel__menu'>
          <Menu />
        </div>
      )}

      { SubHeader && (
        <PanelSubHeader {...subHeaderStyles}>
          <SubHeader />
        </PanelSubHeader>
      )}

      { !noBody && (
        <PanelBody {...bodyStyles}>
          {children}
        </PanelBody>
      )}

      { Footer && (
        <div className='panel__footer'>
          <Footer />
        </div>
      )}
    </div>
  )
}
