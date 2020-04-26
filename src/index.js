import React, { useEffect, useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import './index.css'

const DropDown = props => {
  return (
    <>
      <select onChange={e => props.getId(e)} name="wordcloud" id="wordcloud">
        {props.options.map((o, i) => (
          <option id={props.id} key={i}>
            {o}
          </option>
        ))}
      </select>
    </>
  )
}

const WordCloud = () => {
  const [data, setData] = useState([])
  const [dataRaw, setDataRaw] = useState()
  const [date, setDate] = useState(null)
  const [newspaper, setNewsPaper] = useState(null)

  const getId = e => {
    if (e.target.selectedOptions[0].id === 'date') {
      setDate(e.target.selectedOptions[0].textContent)
    } else {
      setNewsPaper(e.target.selectedOptions[0].textContent)
    }
  }
  useEffect(() => {
    fetch('http://localhost:3000/data.json')
      .then(res => res.json())
      .then(data => {
        setDataRaw(data)
        const values = Object.values(data)
        setData(values.map((val, i) => ({ ...val, id: i })))
      })
      .catch(err => console.error(err))
  }, [])

  const newspapers1 = data.map(d => d.newspaper)
  const newspapersSet = new Set(newspapers1)
  const newspapers = Array.from(newspapersSet)
  const datesDirty = data.map(d => d.date)
  const datesSet = new Set(datesDirty)
  const dates = Array.from(datesSet)
  return (
    <div classname="App">
      <DropDown options={newspapers} getId={getId} id="newspaper" />
      <DropDown options={dates} getId={getId} id="date" />
      {data
        .filter(d => d.date === date && d.newspaper === newspaper)
        .map((d, i) => {
          return <img key={i} src={d['IMG URL'] || null} alt="wordcloud" />
        })}
    </div>
  )
}

ReactDOM.render(<WordCloud />, document.getElementById('root'))
