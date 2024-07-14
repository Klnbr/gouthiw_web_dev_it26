// import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomeScreen from './routes/HomeScreen';
import MenuScreen from './routes/MenuScreen';
import TriviaScreen from './routes/TriviaScreen';
import TopicScreen from './routes/TopicScreen'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<HomeScreen />} />
        <Route path='/menus' element={<MenuScreen />} />
        <Route path='/trivias' element={<TriviaScreen />} />
        <Route path='/topics' element={<TopicScreen />} />
      </Routes>
    </div>
  );
}

export default App;
