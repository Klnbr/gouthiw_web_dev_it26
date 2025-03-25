
import React,{ useEffect } from 'react';
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
// import EditMenu from './routes/nutr/EditMenu';
import Trivia from './routes/nutr/Trivia';
import IngrScreen from './routes/nutr/IngrScreen';
import ProfileScreen from './routes/nutr/ProfileScreen';
import EditProfile from './routes/nutr/EditProfile';
import MenuDetailScreen from './routes/nutr/MenuDetailScreen';
import AnswerTopic from './routes/nutr/AnswerTopic';
import TriviaDetailScreen from './routes/nutr/TriviaDetailScreen';
import EditTrivia from '../src/components/trivia-manage/EditTrivia'
import Report from './routes/nutr/ReportScreen';
import ReportHistory from './routes/nutr/ReportHistory';
import ReportHistoryDetail from './routes/nutr/HistoryReportDetail';
// import ReportDetailNutr from './routes/nutr/ReportDetailNutr';

//admin
import AdminHome from './routes/admin/AdminHome';
import ReportScreen from './routes/admin/ReportManage';
import UserInformation from './routes/admin/UserInformation';
import ReportDetail from './routes/admin/ReportDetail'
import TopicScreenAd from './routes/admin/TopicScreenAd'
import TopicDetail from './routes/admin/TopicDetail';
import MenuScreenAdmin from './routes/admin/MenuScreenAdmin';
import TriviaScreenAd from './routes/admin/TriviaAdmin';
import TriviaDetailAdmin from './routes/admin/TriviaDetailAdmin';
import ReportTopicDetail from './routes/admin/ReportTopicDetail';

import NotiScreen from './routes/admin/Noti'

import { messaging } from './firebase';
import { getToken, onMessage } from 'firebase/messaging';
import ReportDetailNutr from './routes/nutr/ReportDetailNutr';


function RedirectBasedOnRole() {
  const { isAuthenticated, nutrData } = useAuth();

  if (!isAuthenticated) {
    return <Welcome />;
  }

  if (nutrData.role === '0') {
    return <Navigate to="/home" />;
  }

  if (nutrData.role === '1') {
    return <Navigate to="/admin/home" />;
  }

  return <Navigate to="/unauthorized" />;
}

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
  { path: '/edit-trivia', component: <EditTrivia /> },
  { path: '/ingredients', component: <IngrScreen /> },
  { path: '/profile', component: <ProfileScreen /> },
  { path: '/profile-edit', component: <EditProfile /> },
  { path: '/topic-answer', component: <AnswerTopic /> },
  { path: '/report', component: <Report /> },
  { path: '/report-history', component: <ReportHistory /> },
  { path: '/report-history/detail', component: <ReportHistoryDetail /> },
  { path: '/notification', component: <NotiScreen /> },
  { path: '/report-trivia-detail', component: <ReportDetailNutr /> },
];

const adminRoutes = [
  { path: '/admin/home', component: <AdminHome /> },
  { path: '/admin/report', component: <ReportScreen /> },
  { path: '/admin/information', component: <UserInformation /> },
  { path: '/admin/report-trivia-detail', component: <ReportDetail /> },
  { path: '/admin/report-topic-detail', component: <ReportTopicDetail /> },
  { path: '/admin/menus', component: <MenuScreenAdmin />  },
  { path: '/admin/menu-detail', component: <MenuDetailScreen /> },
  { path: '/admin/trivias', component: <TriviaScreenAd /> },
  { path: '/admin/trivia-detail', component: <TriviaDetailAdmin /> },
  { path: '/admin/ingredients', component: <IngrScreen /> },
  { path: '/admin/topics', component: <TopicScreenAd /> },
  { path: '/admin/topic-detail', component:<TopicDetail /> },
  { path: '/admin/notification', component: <NotiScreen /> },
];

function App() {

  const requestPermission = async () => {
    try {
      const token = await getToken(messaging, { vapidKey: "BIcHuJzsuP581ZDGix1MmWx9Ql7DjD-u90v-9aPMoIFtnsVmjBwrEWmVZwlkycE6fFzPl1FemP9PnwcmOV8D3co" });
      if (token) {
        console.log("Token received:", token);
      } else {
        console.warn("Permission not granted for notifications.");
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
    }
  };
  
  const listenForMessages = () => {
    onMessage(messaging, (payload) => {
      console.log("Message received:", payload);
      alert(`${payload.notification.title}: ${payload.notification.body}`);
    });
  };
  
  useEffect(() => {
    requestPermission();
    listenForMessages();
  }, []);
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path='/' element={<RedirectBasedOnRole />} />
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
