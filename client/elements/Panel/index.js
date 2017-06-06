import { isArray } from 'lodash'
import EllipsisIcon from 'react-icons/lib/fa/ellipsis-h'
import classNames from 'classnames'

import PanelMenu from './Menu'
import PanelBody from './Body'
import PanelHeader from './Header'
import PanelSubHeader from './SubHeader'

const Panel = props => {
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
  let { Options, toggleOptions, showPostMenu, showPostMenuButton } = props

  let footerArray = null
  if (Footer) footerArray = isArray(Footer) ? Footer : [ Footer ]

  return (
    <div className={containerClasses.join(' ')}>

      { showPostMenuButton && Options && (
        <div className='panel__options'>
          <div className={classNames('panel__options_button', {'panel__options_button_active': showPostMenu})} onClick={toggleOptions}>
            <EllipsisIcon />
          </div>
          { showOptions && (<Options />) }
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
          {SubHeader}
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

      <style jsx>{`
        .panel__options_button {
          padding: 5px;
          cursor: pointer;
          color: #DADEE1;
          transition: color 0.2s ease;
        }

        .panel__options_button_active {
          color: rgb(12, 0, 255);
        }

        .panel__options_button:hover {
          color: rgb(12, 0, 255);
        }
      `}</style>
    </div>
  )
}

export default Panel
