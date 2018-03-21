import React from 'react'
import { render } from 'react-dom'
import App from './app'

class APPContainer extends React.component {
  state = {
    name: 'parcel 打包案例'
  }

  componentDidMount () {
    setTimeout(() => this.setState({name: 'parcel 打包包'}), 2000)
  }

  render () {
    return <App name={this.state.name} />
  }
}

render(
  <APPContainer />,
  document.getElementById('app')
)