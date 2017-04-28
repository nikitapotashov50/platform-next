import test from 'ava'
import render from 'react-test-renderer'
import IndexPage from '../../pages/index'

test('Index page', t => {
  const tree = render.create(<IndexPage />).toJSON()
  t.snapshot(tree)
})
