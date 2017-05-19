import React from 'react'

<style>{`
  body { 
    background: #000;
    font: 11px menlo;
    color: #fff;
  }
`}</style>


const SpeakersRating = ({rating}) => (
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
      <tr>
        <td>Павел Гительман</td>
        <td>91.2</td>
        <td>84.68</td>
        <td>85.48</td>
        <td>87.12</td>
      </tr>
    </tbody>
  </table>
)

export default SpeakersRating
