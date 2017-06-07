import Panel from '../../../elements/Panel'

import ImagePreview from './Image'
import DocPreview from './Document'
import ReactPlayer from 'react-player'

// <div className={`attachments-container attachments-container_${type}`}>
export default ({ items, loaded, onRemove, type = 'image' }) => (
  <Panel>
    <div className={`attachments-preview attachments-preview_${type}`}>
      { items.map(file => (
        <div className={`attachments-preview__item attachments-preview__item_${type}`} key={file.hash}>
          { (type === 'image') && (<ImagePreview loading={loaded.indexOf(file.hash) === -1} file={file} onRemove={onRemove.bind(this, file.hash, file.preview)} />)}
          { (type === 'document') && (<DocPreview loading={loaded.indexOf(file.hash) === -1} file={file} onRemove={onRemove.bind(this, file.hash, file.preview)} />)}
          { (type === 'video') && (<ReactPlayer url={file.url} width='100%' />)}
        </div>
      ))}
    </div>

    <style jsx>{`
      .attachments-preview {}
      .attachments-preview_image {
        display: flex;
        flex-flow: row wrap;
        margin: 0 -2px;
      }
      .attachments-preview__item {}
      .attachments-preview__item_image {
        flex: auto;
        width: 150px;
        padding: 2px;
      }

      .attachments-document-container > div {
        border: 1px solid #e1e3e4;
        border-radius: 3px;
        padding: 10px 25px 10px 10px;
        font-size: 16px;
        margin-right: 10px;
        margin: 5px;
      }
    `}</style>
  </Panel>
)
