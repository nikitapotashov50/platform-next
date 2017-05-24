import React from 'react'

const SpeakersRating = ({speakers}) => (
  <table className='SpeakersRating'>
    <thead>
      <tr>
        <td>Имя</td>
        <td>Полезно</td>
        <td>Эмоции</td>
        <td>Понятно</td>
        <td>Общий NPS</td>
      </tr>
    </thead>
    <tbody>
      {speakers.sort((a, b) => +a.nps < +b.nps).map(speaker => {
        return (
          <tr key={speaker.name}>
            <td>{speaker.name}</td>
            <td>{speaker.r1}</td>
            <td>{speaker.r2}</td>
            <td>{speaker.r3}</td>
            <td>{speaker.nps}</td>
          </tr>
        )
      })}
    </tbody>
    <style jsx>{`
      table {
        width: 100%;
      }
      td {
        padding: 3px;
        border: 1px solid lightgray;
      }
      thead td {
        text-align: center;
      }
    `}</style>
  </table>
)

export default SpeakersRating
