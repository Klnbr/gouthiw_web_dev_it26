// import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomeScreen from './routes/HomeScreen';
import MenuScreen from './routes/MenuScreen';
import TriviaScreen from './routes/TriviaScreen';
import TopicScreen from './routes/TopicScreen'
import RegisterScreen from './routes/RegisterScreen';
import LoginScreen from './routes/LoginScreen';
import Menu from './routes/Menu';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<HomeScreen />} />
        <Route path='/menus' element={<MenuScreen />} />
        <Route path='/trivias' element={<TriviaScreen />} />
        <Route path='/topics' element={<TopicScreen />} />
        <Route path='/signup' element={<RegisterScreen />} />
        <Route path='/login' element={<LoginScreen />} />
        <Route path='/create-menu' element={<Menu />} />
      </Routes>
    </div>
  );
}

export default App;
