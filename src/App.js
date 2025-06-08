import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Details from './components/Details/Details';
import Tips from './components/Tips/Tips';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/details" element={<Details />} />
        <Route path="/tips" element={<Tips />} />
      </Routes>
    </Router>
  );
}

export default App;