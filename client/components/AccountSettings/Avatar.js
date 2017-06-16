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

        <button onClick={() => { this.dropzoneRef.open() }} className='avatar__choose'>{this.state.uploading ? 'Загрузка..' : 'Выбрать файл'}
        </button>

        <style jsx>{`
          img {
            width: 300px;
            margin: 20px 0 0 0;
          }
          button {
            cursor: pointer;
          }
          .avatar__choose {
            border: 1px solid #196aff;
            border-radius: 3px;
            padding: 7px 10px;
            margin: 10px 0;
            color:#196aff;
          }
          .avatar__choose:hover {
            background: #196aff;
            color:#fff;
          }

          /*  Мобильные стили */
          @media screen and (max-width: 39.9375em) {
            img{width: 90%;}
            
          }

        `}</style>
      </Dropzone>
    )
  }
}

export default AvatarSettings
