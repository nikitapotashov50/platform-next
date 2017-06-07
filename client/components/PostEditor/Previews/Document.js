import OverlayLoader from '../../OverlayLoader'
import RemoveButton from 'react-icons/lib/fa/close'
import FileIcon from 'react-icons/lib/fa/file-text-o'

export default ({ loading, onRemove, file }) => (
  <div className='aPreview-document' href={file.path}>
    <OverlayLoader loading={loading}>
      <div className='aPreview-document__remove' onClick={onRemove}>
        <RemoveButton />
      </div>

      <FileIcon /> {file.name}
    </OverlayLoader>

    <style jsx>{`
      .aPreview-document {
        padding: 2px 0;
        display: inline-block;
        cursor: pointer;
      }
      .aPreview-document__remove {
        margin-right: 5px;
        display: inline-block;
      }
    `}</style>
  </div>
)
