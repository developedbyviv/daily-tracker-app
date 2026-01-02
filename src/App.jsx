import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ExpenseTracker from './features/expenses/ExpenseTracker';
import WaterTracker from './features/water/WaterTracker';
import SmokingTracker from './features/smoking/SmokingTracker';
import SleepTracker from './features/sleep/SleepTracker';
import ThoughtsJournal from './features/thoughts/ThoughtsJournal';
import GymTracker from './features/gym/GymTracker';
import './components/Layout.css';
import './components/Modal.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="expenses" element={<ExpenseTracker />} />
          <Route path="water" element={<WaterTracker />} />
          <Route path="smoking" element={<SmokingTracker />} />
          <Route path="sleep" element={<SleepTracker />} />
          <Route path="thoughts" element={<ThoughtsJournal />} />
          <Route path="gym" element={<GymTracker />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
