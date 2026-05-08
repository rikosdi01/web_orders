import './App.css';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { useCallback, useContext, useState } from 'react';

// Context
import { AuthContext } from './context/AuthContext';
import { OrderProvider } from './context/OrdersContext';

// Sidebar
import SidebarPages from './components/sidebar/SidebarPages';

// Sign In
import SignIn from './pages/authentication/signin/SignIn';

// Sign Up
import SignUp from './pages/authentication/signup/SignUp';

// Dashboard
import Dashboard from './pages/features/dashboard/Dashboard';

// Order
import Order from './pages/features/order/Order';
import OrderDetails from './pages/features/order/children/OrderDetails/OrderDetails';
import OrderProcess from './pages/features/order/children/OrderProcess/OrderProcess';
import OrderAdd from './pages/features/order/children/OrderAdd/OrderAdd';

// Not Found
import NotFound from './pages/features/notfound/NotFound';

// Settings
import Settings from './pages/personalization/settings/Settings';

// Scanner
import Scanner from './pages/features/scanner/Scanner';
import useFirebaseMessaging from './services/NotificationPush';
import { ToastProvider } from './context/ToastContext';
import Chat from './pages/features/chat/Chat';
import { ChatProvider } from './context/ChatsContext';
import { UserProvider } from './context/UserContext';
import { MessagesProvider } from './context/MessageContext';

function AppContent() {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext)
  console.log(currentUser);
  useFirebaseMessaging();  // Ambil notifikasi


  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/signin" />
  }

  // Daftar halaman yang tidak menampilkan sidebar
  const hideSidebarRoutes = ["/signin", "/signup", "/404"];

  return (
    <div className="app-container">
      {!hideSidebarRoutes.includes(location.pathname) && <SidebarPages />}

      <div className="main-content">
        <Routes>
          {/* Authentication */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Dashboard */}
          <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>}

          />{/* Customer Pages */}
          <Route path="/customers" element={<RequireAuth><Order /></RequireAuth>} />
          <Route path="/customer/:id" element={<RequireAuth><OrderDetails /></RequireAuth>} />

          {/* Orders Pages */}
          <Route path="/orders" element={<RequireAuth><Order /></RequireAuth>} />
          <Route path="/order/create" element={<RequireAuth><OrderAdd /></RequireAuth>} />
          <Route path="/order/:id" element={<RequireAuth><OrderDetails /></RequireAuth>} />
          <Route path="/order/:id/process" element={<RequireAuth><OrderProcess /></RequireAuth>} />

          {/* Scanner Pages */}
          <Route path="/scanner" element={<RequireAuth><Scanner /></RequireAuth>} />

          {/* Scanner Pages */}
          <Route path="/chat" element={<RequireAuth><Chat /></RequireAuth>} />
          <Route path="/chat/:id?" element={<RequireAuth><Chat /></RequireAuth>} />

          {/* Settings */}
          <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />

          {/* Not Found Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <UserProvider>
        <ChatProvider>
          <MessagesProvider>
            <OrderProvider>
              <Router>
                <AppContent />
              </Router>
            </OrderProvider>
          </MessagesProvider>
        </ChatProvider>
      </UserProvider>
    </ToastProvider>
    // <Testing />
  );
}

// const Testing = () => {
//   const { fcmToken, notification } = useFirebaseMessaging();

//   return (
//     <div>
//       <h1>Firebase Cloud Messaging</h1>
//       {fcmToken && <p><strong>FCM Token:</strong> {fcmToken}</p>}
//       {notification && (
//         <div>
//           <h2>New Notification</h2>
//           <p><strong>Title:</strong> {notification.title}</p>
//           <p><strong>Body:</strong> {notification.body}</p>
//         </div>
//       )}
//     </div>
//   );
// }

export default App;