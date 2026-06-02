import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Counter from './components/Counter'
import RegistrationForm from './components/RegistrationForm'

function App() {

  return (
    <>
      <Counter/>
      <RegistrationForm/>
    </>
  )
}

export default App
