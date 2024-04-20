import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import { Game } from './screens/Game';
import { Landing } from './screens/Landing';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='h-screen bg-slate-950'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}/>
          <Route path="/game" element={<Game />}/>
        </Routes>
      </BrowserRouter>
      {/* <button className='bg-red-400'>Join the room</button> */}
    </div>
  )
}

export default App
