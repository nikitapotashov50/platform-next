import Link from 'next/link'
import React, { Component } from 'react'

class Menu extends Component {
  constructor (props) {
    super(props)
    this.state = { expanded: false }

    this.toggle = this.toggle.bind(this)
  }

  toggle (expanded) {
    this.setState({ expanded })
  }

  render () {
    let { items, selected } = this.props
    let { expanded } = this.state

    return (
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

        <style jsx>{`
          .active {
            border-bottom: 2px solid #196aff;
          }
        `}</style>
      </ul>
    )
  }
}

export default Menu
