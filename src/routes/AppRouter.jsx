import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import Welcome from '../pages/Welcome'
import Profile from '../pages/Profile'
import Experiences from '../pages/Experiences'
import ExperienceFlow from '../pages/ExperienceFlow'
import Synthesis from '../pages/Synthesis'
import Collective from '../pages/Collective'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/experience" element={<ExperienceFlow />} />
        <Route path="/synthesis" element={<Synthesis />} />
        <Route path="/collective" element={<Collective />} />
      </Routes>
    </BrowserRouter>
  )
}
