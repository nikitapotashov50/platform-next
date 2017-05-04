import Link from 'next/link'
import { connect } from 'react-redux'

const Header = ({ user }) => {
  if (user) {
    return <div>Приветики, {user.name}</div>
  } else {
    return (
      <div>
        <Link href='/login'>
          <a>Войти</a>
        </Link>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(Header)
