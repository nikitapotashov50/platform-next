import { isArray } from 'lodash'
import EllipsisIcon from 'react-icons/lib/fa/ellipsis-h'

import PanelMenu from './Menu'
import PanelBody from './Body'
import PanelHeader from './Header'
import PanelSubHeader from './SubHeader'

export default props => {
  let { noMargin, noBorder, margin, withAnimation } = props
  let containerClasses = [ 'panel' ]

  if (noMargin) containerClasses.push('panel_no_margin')
  if (noBorder) containerClasses.push('panel_no_border')
  if (margin) containerClasses.push('panel_margin_' + margin)
  if (withAnimation) containerClasses.push('fade_in')

  let { Header, headerStyles = {} } = props
  let { SubHeader, subHeaderStyles = {} } = props
  let { children, noBody, bodyStyles = {} } = props
  let { Menu, menuStyles } = props
  let { Footer } = props
  let { Options, toggleOptions } = props

  let footerArray = null
  if (Footer) footerArray = isArray(Footer) ? Footer : [ Footer ]

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
          {Header}
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

      { (footerArray && footerArray.length) && footerArray.map((el, i) => (
        <div className='panel__footer' key={'panel-footer-' + i}>
          {el}
        </div>
      ))}
    </div>
  )
}
