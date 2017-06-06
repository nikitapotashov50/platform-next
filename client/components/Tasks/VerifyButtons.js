import Button from '../../elements/Button'

const onClick = (type, cb, e) => {
  e.preventDefault()
  cb(type)
}

export default ({ onVerify }) => (
  <div>
<<<<<<< HEAD
    <Button onClick={onClick.bind(this, 'approved', onVerify)}>Принять</Button>
    <Button onClick={onClick.bind(this, 'rejected', onVerify)} type='reject'>Отклонить</Button>
=======
    <Button onClick={onClick.bind(this, 'approve', onVerify)}>Принять</Button>
    <Button onClick={onClick.bind(this, 'reject', onVerify)} type='reject'>Отклонить</Button>
>>>>>>> 4be3b2a01a129e6a936ce5befb5943ae3fb39761
  </div>
)
