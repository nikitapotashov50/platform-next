import Dropzone from 'react-dropzone'
import { isUndefined } from 'lodash'
import axios from 'axios'
import md5 from 'blueimp-md5'

let dropzoneRef

const AvatarSettings = ({ user, onChange, affected }) => (
  <Dropzone
    disableClick
    multiple
    style={{}}
    ref={node => { dropzoneRef = node }}
    onDrop={async ([file]) => {
      const formData = new window.FormData()
      formData.append('file', file)
      formData.append('hash', md5(file.preview))
      formData.append('isAvatar', true)
      const { data } = await axios.post('/api/attachment', formData)
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

    <button onClick={() => { dropzoneRef.open() }}>Выбрать файл</button>

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

export default AvatarSettings
