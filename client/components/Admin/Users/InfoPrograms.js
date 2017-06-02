export default ({ program, role, meta, onEdit }) => (
  <div className='um-program'>
    <h3 className='um-program__title'>{program.title}</h3>
    <div className='um-program__body'>
      {meta.roleId} (<a onClick={onEdit}>изменить</a>)
    </div>
    
    <style jsx>{`
      .um-program {
        padding: 10px 0;
      }
      .um-program__title {
        font-size: 16px;
        line-height: 22px;
      }
      .um-program__body {}
    `}</style>
  </div>
)
