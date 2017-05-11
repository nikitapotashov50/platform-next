import EllipsisIcon from 'react-icons/lib/fa/ellipsis-h'

import PanelMenu from './Menu'
import PanelBody from './Body'
import PanelHeader from './Header'
import PanelSubHeader from './SubHeader'

export default props => {
  let { noMargin, noBorder, margin } = props
  let containerClasses = [ 'panel' ]

  if (noMargin) containerClasses.push('panel_no_margin')
  if (noBorder) containerClasses.push('panel_no_border')
  if (margin) containerClasses.push('panel_margin_' + margin)

  let { Header, headerStyles = {} } = props
  let { SubHeader, subHeaderStyles = {} } = props
  let { children, noBody, bodyStyles = {} } = props
  let { Menu, menuStyles } = props
  let { Footer } = props
  let { Options, toggleOptions } = props

  return (
    <div className={containerClasses.join(' ')}>

      { Options && (
        <div className='panel__options'>
          <EllipsisIcon color='#DADEE1' onClick={toggleOptions} />
          <Options />
        </div>
      )}

      { Header && (
        <PanelHeader {...headerStyles} noBorder={headerStyles.noBorder || (!!SubHeader && !Menu)}>
          <Header />
        </PanelHeader>
      )}

      { Menu && (
        <PanelMenu {...menuStyles}>
          <Menu />
        </PanelMenu>
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
