import Button from '../../elements/Button'

const onClick = (type, cb, e) => {
  e.preventDefault()
  cb(type)
}

export default ({ onVerify }) => (
  <div>
    <Button onClick={onClick.bind(this, 'approved', onVerify)}>Принять</Button>
    <Button onClick={onClick.bind(this, 'rejected', onVerify)} type='reject'>Отклонить</Button>
  </div>
)
