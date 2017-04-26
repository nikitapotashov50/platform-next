import test from 'ava'
import render from 'react-test-renderer'

import Index from '.'

test('Index page', t => {
  const tree = render.create(<Index />).toJSON()
  t.snapshot(tree)
})
