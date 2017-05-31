export default ({ title, small = false }) => <div className={[ 'panel__title', small ? 'panel__title_small' : '' ].join(' ')}>{title}</div>
