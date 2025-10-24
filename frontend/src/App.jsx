import { Routes, Route} from 'react-router-dom';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Home from './components/home/Home';
import Decider from './decider/Decider';
function App() {

  return (
    <>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path="/decider" element={<Decider/>}/>
      </Routes>
      
    </>
  )
}

export default App
