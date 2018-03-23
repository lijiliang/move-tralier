import React from 'react'
import { render } from 'react-dom'
import {
  BrowserRouter,
  HashRouter
} from 'react-router-dom'
import App from './app'

const rootElement = document.getElementById('app')

render(<BrowserRouter>
  <App />
</BrowserRouter>,rootElement)