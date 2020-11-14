import { BrowserRouter as Router } from 'react-router-dom';

import './App.css';

import Routes from './Routes';

import Header from './components/metacomponents/Header';
import Navbar from './components/metacomponents/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Header />
        <Routes />
      </div>
    </Router>
  );
}

export default App;
