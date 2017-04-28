import test from 'ava'
import render from 'react-test-renderer'
import React from 'react'
import { mount } from 'enzyme'
import IndexPage from '../../pages/index'

test('Index page snapshot', t => {
  const tree = render.create(<IndexPage />).toJSON()
  t.snapshot(tree)
})

test('Index page state', t => {
  const wrapper = mount(<IndexPage />)
  t.deepEqual(wrapper.state(), {})

  const changeEvent = {
    target: {
      value: 'test'
    }
  }

  wrapper.find('input').simulate('change', changeEvent)
  t.deepEqual(wrapper.state(), {
    login: 'test'
  })
})
