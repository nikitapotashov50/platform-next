import OverlayLoader from '../../OverlayLoader'
import RemoveButton from 'react-icons/lib/fa/close'

export default ({ loading, file, onRemove }) => (
  <div className='aPreview-image'>
    <OverlayLoader loading={loading} style={{ height: '100%', width: '100%' }}>
      <div className='aPreview-image__remove' onClick={onRemove}>
        <RemoveButton />
      </div>

      <img className='aPreview-image__image' src={file.preview} style={{ cursor: 'pointer' }} />
    </OverlayLoader>

    <style jsx>{`
      .aPreview-image {
        position: relative;
        width: 100%;
        height: 100%;
      }
      .aPreview-image__image { 
        width: 100%;
        height: 100%;
      }
      .aPreview-image__remove {
        top: 0;
        right: 0;
        position: absolute;

        color: #fefefe;
        cursor: pointer;
        background-color: rgba(0, 0, 0, .75);
      }
    `}</style>
  </div>
)
