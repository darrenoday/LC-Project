//For EventDetails About and Contact Pages

// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import EventDetails from './components/EventDetails';
// import About from './components/About';
// import Contact from './components/Contact';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<EventDetails />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         {/* Add other routes here */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;
//  -----------------------------------------------------------------------------------------------------

//For Admin Dashboard

// import React from 'react'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import AdminDashboard from './components/AdminDashboard'
// import EventDetails from './components/EventDetails'


// function App() {
  

//   return (
//     <>
//       <div>
//         {/* <EventDetails/> */}
//         <AdminDashboard/>
//       </div>
      
//     </>
//   )
// }

// export default App

//----------------------------------------------------------------------------------------------------------

// FOr registration and login 

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import RegistrationForm from './components/RegistrationForm';
// import LoginForm from './components/LoginForm';
// import EventDetails from './components/EventDetails';
// import LoginStatus from './components/LoginStatus';
// import Events from './components/Events';
// import AdminDashboard from './components/AdminDashboard';
// import About from './components/About';
// import Contact from './components/Contact';
// import { AuthProvider, useAuth } from './auth/AuthContext';

// // A component to protect routes based on authentication
// function ProtectedRoute({ children }) {
//   const { user } = useAuth();
//   return user ? children : <Navigate to="/login" />;
// }

// // A component to protect routes based on admin role
// function AdminRoute({ children }) {
//   const { user } = useAuth();
//   return user && user.role === 'admin' ? children : <Navigate to="/events" />;
// }

// // A component to show different navigation links based on authentication
// function Navigation() {
//   const { user, logout } = useAuth();

//   return (
//     <nav>
//       {user && (
//         <>
//           <a href="/events">Home</a> | 
//           <a href="/about">About</a> | 
//           <a href="/contact">Contact</a> | 
//           <button onClick={logout}>Logout</button>
//           {user.role === 'admin' && <a href="/admin-dashboard">Admin Dashboard</a>}
//         </>
//       )}
//       {!user && (
//         <>
//           <a href="/login">Login</a> | 
//           <a href="/register">Register</a>
//         </>
//       )}
//     </nav>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <LoginStatus /> {/* Display login status */}
//         <Navigation /> {/* Display navigation links */}
//         <Routes>
//           <Route path="/" element={<EventDetails />} /> {/* Set EventDetails as the home page */}
//           <Route path="/register" element={<RegistrationForm />} />
//           <Route path="/login" element={<LoginForm />} />
//           <Route path="/events" element={
//             <ProtectedRoute>
//               <Events />
//             </ProtectedRoute>
//           } />
//           <Route path="/event-details/:id" element={<EventDetails />} />
//           <Route path="/admin-dashboard" element={
//             <AdminRoute>
//               <AdminDashboard />
//             </AdminRoute>
//           } />
//           <Route path="/contact" element={<Contact />} /> {/* Route for Contact page */}
//           <Route path="/about" element={<About />} /> {/* Route for About page */}
//           <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown routes to default */}
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;
//--------------------------------------------------------------------------------------------------------------
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import EventDetails from './components/EventDetails';
import LoginStatus from './components/LoginStatus';
import Events from './components/Events';
import About from './components/About';
import Contact from './components/Contact';
import { AuthProvider, useAuth } from './auth/AuthContext';

// A component to protect routes based on authentication
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

// A component to show different navigation links based on authentication
function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav>
      {user ? (
        <>
          <a href="/events">Home</a> | 
          <a href="/about">About</a> | 
          <a href="/contact">Contact</a> | 
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <a href="/login">Login</a> | 
          <a href="/register">Register</a>
        </>
      )}
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <LoginStatus /> {/* Display login status */}
        <Navigation /> {/* Display navigation links */}
        <Routes>
          <Route path="/" element={<EventDetails />} /> {/* Set EventDetails as the home page */}
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/events" element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          } />
          <Route path="/event-details/:id" element={<EventDetails />} />
          <Route path="/contact" element={<Contact />} /> {/* Route for Contact page */}
          <Route path="/about" element={<About />} /> {/* Route for About page */}
          <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown routes to default */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
