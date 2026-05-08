import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import Welcome from '../pages/Welcome'
import Profile from '../pages/Profile'
import Experiences from '../pages/Experiences'
import Listening from '../pages/Listening'
import Compass from '../pages/Compass'
import Weaving from '../pages/Weaving'
import Synthesis from '../pages/Synthesis'
import Collective from '../pages/Collective'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/listening" element={<Listening />} />
        <Route path="/compass" element={<Compass />} />
        <Route path="/weaving" element={<Weaving />} />
        <Route path="/synthesis" element={<Synthesis />} />
        <Route path="/collective" element={<Collective />} />
      </Routes>
    </BrowserRouter>
  )
}
