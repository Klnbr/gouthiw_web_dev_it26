// import logo from './logo.svg';
import React from 'react';
import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import AuthProvider, { useAuth }  from './middleware/Auth';

import RegisterScreen from './routes/RegisterScreen';
import LoginScreen from './routes/LoginScreen';
import Welcome from './routes/Welcome';

import Jodit from './routes/Jodit';
import Unauthorized from './routes/Unauthorized';

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

//admin
import AdminHome from './routes/admin/AdminHome';
import ReportScreen from './routes/admin/ReportScreen';
import UserInformation from './routes/admin/UserInformation';


function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, nutrData } = useAuth();

  // ตรวจสอบว่าผู้ใช้เข้าสู่ระบบแล้วและมี role ตรงตามที่กำหนด
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  if (nutrData.role !== allowedRole) {
    return <Navigate to="/unauthorized" />; // ถ้า role ไม่ตรงให้กลับไปที่หน้าอื่น
  }

  return children;
}

const nutrRoutes = [
  { path: '/home', component: <HomeScreen /> },
  { path: '/menus', component: <MenuScreen /> },
  { path: '/menu-detail', component: <MenuDetailScreen /> },
  { path: '/trivias', component: <TriviaScreen /> },
  { path: '/topics', component: <TopicScreen /> },
  { path: '/menu', component: <Menu /> },
  { path: '/trivia', component: <Trivia /> },
  { path: '/trivia-detail', component: <TriviaDetailScreen /> },
  { path: '/ingredients', component: <IngrScreen /> },
  { path: '/profile', component: <ProfileScreen /> },
  { path: '/profile-edit', component: <EditProfile /> },
  { path: '/topic-answer', component: <AnswerTopic /> },
];

const adminRoutes = [
  { path: '/admin/home', component: <AdminHome /> },
  { path: '/admin/report', component: <ReportScreen /> },
  { path: '/admin/information', component: <UserInformation /> },
];

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path='/' element={<Welcome />} />
          <Route path='/signup' element={<RegisterScreen />} />
          <Route path='/signin' element={<LoginScreen />} />
          <Route path='/unauthorized' element={<Unauthorized />} />
          <Route path='/jodit' element={<Jodit />} />

          {/* nutr routes */}
          {nutrRoutes.map(({ path, component }) => (
            <Route 
              key={path} 
              path={path} 
              element={
                <ProtectedRoute allowedRole="0">
                  {component}
                </ProtectedRoute>
              }
            />
          ))}

          {/* admin routes */}
          {adminRoutes.map(({ path, component }) => (
            <Route 
              key={path} 
              path={path} 
              element={
                <ProtectedRoute allowedRole="1">
                  {component}
                </ProtectedRoute>
              }
            />
          ))}
          
        </Routes>
      </div>
    </AuthProvider> 
  );
}

export default App;
