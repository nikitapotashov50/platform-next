import moment from 'moment'
import Link from 'next/link'
import { connect } from 'react-redux'
import DefaultLayout from './default'
import Panel from '../elements/Panel'

import Products from '../elements/Feed/SideProducts'
import Beta from '../elements/Feed/SideBeta'

let today = moment()
// TODO: сделать проверку на то, что за програма
const FeedLayout = ({ children, menuItem = null, emptySide, Side = [], wide = false, program }) => {
  let isWeekend = today.day() === 0 || today.day() === 6

  return (
    <DefaultLayout menuItem={menuItem}>
      <div className='feed'>
        <div className={[ 'feed__left', wide ? 'feed__left_wide' : '' ].join(' ')}>
          <div className='feed__alert_btn'>
            { (program && program === 4 && isWeekend) && (
              <Panel>
                <Link href={'/feedback?type=class'} as={'/feedback/class'}>
                  <button className='myBtn'>Оставить отзыв о занятии</button>
                </Link>
              </Panel>
            )}
          </div>

          {children}
        </div>

        <div className={[ 'feed__right', wide ? 'feed__right_narrow' : '' ].join(' ')}>
          { (Side.length > 0) && Side.map(el => (
            <div key={Math.random()}>{el}</div>
          ))}

          { (program && program === 4 && isWeekend) && (
            <Panel>
              <Link href={'/feedback?type=class'} as={'/feedback/class'}>
                <button className='myBtn'>Оставьте отзыв о занятии</button>
              </Link>
            </Panel>
          )}

          { !emptySide && (
            <div>
              <Beta />

              <Products />
            </div>
          ) }
        </div>
      </div>
      <style jsx>{`
      
      `}</style>
    </DefaultLayout>
  )
}

const mapStateToProps = ({ user }) => ({
  program: user.programs.current
})

export default connect(mapStateToProps)(FeedLayout)
