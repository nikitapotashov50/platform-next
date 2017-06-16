import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { isUndefined } from 'lodash'
import axios from 'axios'
import md5 from 'blueimp-md5'

class AvatarSettings extends Component {
  constructor (props) {
    super(props)

    this.state = {
      uploading: false
    }
  }
  render () {
    const { user, onChange, affected } = this.props

    return (
      <Dropzone
        disableClick
        multiple
        style={{}}
        ref={node => { this.dropzoneRef = node }}
        onDrop={async ([file]) => {
          this.setState({ uploading: true })
          const formData = new window.FormData()
          formData.append('file', file)
          formData.append('hash', md5(file.preview))
          formData.append('isAvatar', true)
          const { data } = await axios.post('/api/attachment', formData)
          this.setState({ uploading: false })
          onChange('picture_small', data.url)
        }}
      >
        {this.state.uploading && (
          <div>Загрузка...</div>
        )}
        {isUndefined(affected.picture_small) ? (
          <div>
            {user.picture_small === '' ? (
              <div>Нет аватара</div>
            ) : (
              <img src={user.picture_small} />
            )}
          </div>
        ) : (
          <div>
            <img src={affected.picture_small} />
          </div>
        )}

        <button onClick={() => { this.dropzoneRef.open() }}>Выбрать файл</button>

        <style jsx>{`
          img {
            width: 300px;
          }
          button {
            cursor: pointer;
          }
        `}</style>
      </Dropzone>
    )
  }
}

export default AvatarSettings
