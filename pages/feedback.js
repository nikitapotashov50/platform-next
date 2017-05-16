import { translate } from 'react-i18next'
import React, { Component } from 'react'

import PanelMenu from '../client/components/PanelMenu'
import PageHoc from '../client/hocs/Page'
import AccessHoc from '../client/hocs/Access'
import Panel from '../client/components/Panel'
import FeedLayout from '../client/layouts/feed'

import Button from '../client/elements/Button'
import RatingBar from '../client/components/Rating/Bar'
import OverlayLoader from '../client/components/OverlayLoader'

const menuItems = [
  { code: 'platfrom', href: '/', path: '/', title: 'О платформе' }
]

class FeedbackPage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      content: '',
      scores: [ 0, 0, 0 ],
      errors: {},
      fetching: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleScoreChange = this.handleScoreChange.bind(this)
  }

  handleChange (e) {
    let val = e.target.value
    this.setState(state => {
      state.content = val.replace(/(<([^>]+)>)/ig, '')
    })
  }

  handleScoreChange (score) {
    return async (value, e) => {
      e.preventDefault()

      await this.setState(state => {
        state.scores[score] = value
      })
    }
  }

  async submit (e) {
    e.preventDefault()
    let errors = []

    if (!this.state.content) errors.push({ type: 'content', value: 'Напишите текст отзыва' })
    else if (this.state.content.length < 15) errors.push({ type: 'content', value: 'Сообщение должно содержать минимум 15 симовлов' })

    if (errors.length) {
      this.pushErrors(errors)
      return
    }

    await this.setState(state => {
      state.errors = {}
      state.fetching = true
    })

    this.setState(state => {
      state.fetching = false
    })
  }

  async pushErrors (errors) {
    await this.setState(state => {
      let obj = {}
      errors.map(el => { obj[el.type] = el.value })

      state.errors = obj
    })
  }

  render () {
    let { content, scores, errors, fetching } = this.state
    let { t, type } = this.props

    let Footer = <Button onClick={this.submit.bind(this)}>Отправить отзыв</Button>

    return (
      <FeedLayout emptySide>
        <Panel noBody noBorder menuStyles={{ noBorder: true }} Menu={() => <PanelMenu items={menuItems} selected={'platfrom'} />} />

        <Panel
          Header={<div className='panel__title'>Оставьте отзыв о платформе</div>}
          Footer={Footer}
        >
          <OverlayLoader loading={fetching}>
            <div className='post-preview'>
              <textarea className='' value={content} onChange={this.handleChange} rows={7} placeholder={'Написать отзыв, минимум 15 символов'} />
              { errors.content && <span>{errors.content}</span>}
            </div>

            <br />

            <div className='nps-result'>
              <div className='nps-result__row'>
                <div className='nps-result__row-title'>{t(`feedback.labels.${type}.score_1`)}</div>
                <RatingBar className='nps-result__row-value' rate={scores[0]} inline noValues onChange={this.handleScoreChange(0)} />
              </div>

              <div className='nps-result__row'>
                <div className='nps-result__row-title'>{t(`feedback.labels.${type}.score_1`)}</div>
                <RatingBar className='nps-result__row-value' rate={scores[1]} inline noValues onChange={this.handleScoreChange(1)} />
              </div>

              <div className='nps-result__row'>
                <div className='nps-result__row-title'>{t(`feedback.labels.${type}.score_1`)}</div>
                <RatingBar className='nps-result__row-value' rate={scores[2]} inline noValues onChange={this.handleScoreChange(2)} />
              </div>
            </div>
          </OverlayLoader>
        </Panel>
      </FeedLayout>
    )
  }
}

FeedbackPage.getInitialProps = async (ctx) => ({
  type: (ctx.params && ctx.params.type) ? ctx.params.type : 'platform'
})

const rule = user => !!user

let AccessedPage = AccessHoc(rule)(translate([ 'common' ])(FeedbackPage))

export default PageHoc(AccessedPage, {
  title: 'Оставить отзыв'
})
