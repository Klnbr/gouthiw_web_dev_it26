// import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import AuthProvider from './middleware/Auth';

import HomeScreen from './routes/HomeScreen';
import MenuScreen from './routes/MenuScreen';
import TriviaScreen from './routes/TriviaScreen';
import TopicScreen from './routes/TopicScreen'
import RegisterScreen from './routes/RegisterScreen';
import LoginScreen from './routes/LoginScreen';
import Menu from './routes/Menu';
import Trivia from './routes/Trivia';
import IngrScreen from './routes/IngrScreen';
import ProfileScreen from './routes/ProfileScreen';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path='/' element={<HomeScreen />} />
          <Route path='/menus' element={<MenuScreen />} />
          <Route path='/trivias' element={<TriviaScreen />} />
          <Route path='/topics' element={<TopicScreen />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/trivia' element={<Trivia />} />
          <Route path='/ingredients' element={<IngrScreen />} />
          <Route path='/profile' element={<ProfileScreen />} />

          <Route path='/signup' element={<RegisterScreen />} />
          <Route path='/signin' element={<LoginScreen />} />
        </Routes>
      </div>
    </AuthProvider> 
  );
}

export default App;
