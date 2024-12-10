// import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import AuthProvider from './middleware/Auth';

import RegisterScreen from './routes/RegisterScreen';
import LoginScreen from './routes/LoginScreen';

//nutr
import HomeScreen from './routes/nutr/HomeScreen';
import MenuScreen from './routes/nutr/MenuScreen';
import TriviaScreen from './routes/nutr/TriviaScreen';
import TopicScreen from './routes/nutr/TopicScreen'
import Menu from './routes/nutr/Menu';
import Trivia from './routes/nutr/Trivia';
import IngrScreen from './routes/nutr/IngrScreen';
import ProfileScreen from './routes/nutr/ProfileScreen';
import EditProfile from './routes/nutr/EditProfile';
import MenuDetailScreen from './routes/nutr/MenuDetailScreen';
import AnswerTopic from './routes/nutr/AnswerTopic';
import TriviaDetailScreen from './routes/nutr/TriviaDetailScreen';
import Jodit from './routes/Jodit';

//admin
import AdminHome from './routes/admin/AdminHome';
import ReportScreen from './routes/admin/ReportScreen';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* nutr */}
          <Route path='/' element={<HomeScreen />} />
          <Route path='/menus' element={<MenuScreen />} />
          <Route path='/menu-detail' element={<MenuDetailScreen />} />
          <Route path='/trivias' element={<TriviaScreen />} />
          <Route path='/topics' element={<TopicScreen />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/trivia' element={<Trivia />} />
          <Route path='/trivia-detail' element={<TriviaDetailScreen />} />
          <Route path='/ingredients' element={<IngrScreen />} />
          <Route path='/profile' element={<ProfileScreen />} />
          <Route path='/profile-edit' element={<EditProfile />} />
          <Route path='/topic-answer' element={<AnswerTopic />} />
          <Route path='/jodit' element={<Jodit />} />

          {/* nutr */}
          <Route path='/admin/home' element={<AdminHome />} />
          <Route path='/admin/report' element={<ReportScreen />} />

          <Route path='/signup' element={<RegisterScreen />} />
          <Route path='/signin' element={<LoginScreen />} />
        </Routes>
      </div>
    </AuthProvider> 
  );
}

export default App;
