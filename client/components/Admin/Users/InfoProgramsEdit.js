export default ({ program, role, meta, onChange }) => (
  <div className='um-program'>
    <h3 className='um-program__title'>{program.title}</h3>
    <div className='um-program__body'>
      <select value={role.code} onChange={onChange.bind(this)}>
        <option value={'student'}>Студент</option>
        <option value={'volunteer'}>Волонтер</option>
        <option value={'coach'}>Тренер</option>
        <option value={'speaker'}>Спикер</option>
      </select>
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
