import './styles/index.css';
import './styles/app.css';
import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Restaurant from './pages/Restaurant';
import Profile from './pages/Profile';
import Reviews from './pages/Reviews';

// Middleware
import AuthGuard from './pages/AuthGuard'

import SharedLayout from './components/SharedLayout'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} ></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/' element={<SharedLayout />} >
          <Route index element={<Home />} />
          <Route path='' element={<AuthGuard />}>
            <Route path='profile' element={<Profile />} />
          </Route>
          <Route path='restaurant/:restaurantId' element={<Restaurant />} />
          <Route path='restaurant/:restaurantId/reviews' element={<Reviews />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App;
