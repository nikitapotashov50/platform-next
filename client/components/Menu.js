import Link from 'next/link'
import Burger from 'react-icons/lib/fa/bars'
import React, { Component } from 'react'

class Menu extends Component {
  constructor (props) {
    super(props)
    this.state = { expanded: true }

    this.toggle = this.toggle.bind(this)
  }

  toggle (expanded) {
    this.setState({ expanded })
  }

  render () {
    let { items, selected } = this.props
    let { expanded } = this.state

    return (
      <div>
        <span className={[ 'menu-burger', expanded ? 'menu-burger_active' : '' ].join(' ')} onClick={this.toggle.bind(this, !expanded)}><Burger /></span>
        <ul className={[ 'menu', expanded ? 'menu_expanded' : '' ].join(' ')}>
          { items.map(el => (
            <li
              className={[ 'menu__item' ].join(' ')}
              key={'menu-' + el.url}>
              <Link href={el.url} as={el.as} prefetch>
                <a className={[ 'menu__link', el.notify ? 'menu__link_notify' : '', selected === el.code ? ' menu__link_active' : '' ].join(' ')}>
                  {el.title}
                  { el.notify && (<span className='menu__notify'>{el.notify}</span>)}
                </a>
              </Link>
            </li>
          )) }
        </ul>
        <style jsx>{`
          .menu-burger { display: none; }
          @media screen and (max-width: 39.9375em) {
            .menu-burger {
              height: 59px;
              padding: 0 10px;
              line-height: 59px;
              display: block;

              cursot: pointer;
              font-size: 16px;
            }
            .menu-burger:active, .menu-burger_active {
              color: #196aff;
            }
          }
        `}</style>
      </div>
    )
  }
}

export default Menu
