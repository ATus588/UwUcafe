import './Css/index.css';
import './Css/App.css';
import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


import Home from './pages/Home'
import Login from './pages/Login'

import SharedLayout from './components/SharedLayout'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} ></Route>
        <Route path='/' element={<SharedLayout />} >
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
