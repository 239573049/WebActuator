import { Component } from 'react'
import './index.css'

export default class Loading extends Component {
  render() {
    return (
      <div className="loading-container">
        <div className="loading-animation"></div>
      </div>
    )
  }
}
