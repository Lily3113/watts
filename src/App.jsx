
// import EstimatorPage from './EstimatorPage';
// import React, { useState, useEffect, createContext, useContext } from 'react';
// import { initializeApp } from 'firebase/app';
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   signOut
// } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import './App.css';

// const firebaseConfig = {
//   apiKey: "AIzaSyCjhrDxbpbQGzhFMsHC0gIbKACNYvTNzMU",
//   authDomain: "test-da209.firebaseapp.com",
//   projectId: "test-da209",
//   storageBucket: "test-da209.firebasestorage.app",
//   messagingSenderId: "183425406353",
//   appId: "1:183425406353:web:f499c46d8cfae3567bb630",
//   measurementId: "G-V79Z1H5QF1"
// };

// const AppContext = createContext(null);

// const AppProvider = ({ children }) => {
//   const [app, setApp] = useState(null);
//   const [db, setDb] = useState(null);
//   const [auth, setAuth] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [isAuthReady, setIsAuthReady] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     try {
//       const initializedApp = initializeApp(firebaseConfig);
//       const firestoreDb = getFirestore(initializedApp);
//       const firebaseAuth = getAuth(initializedApp);

//       setApp(initializedApp);
//       setDb(firestoreDb);
//       setAuth(firebaseAuth);

//       const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
//         if (user) {
//           setUserId(user.uid);
//           console.log("User signed in:", user.uid);
//         }
//         setIsAuthReady(true);
//       });

//       return () => unsubscribe();
//     } catch (initError) {
//       console.error("Firebase initialization error:", initError);
//       setError("Failed to initialize Firebase. Please check your configuration.");
//     }
//   }, []);

//   const value = { app, db, auth, userId, isAuthReady, error };

//   return (
//     <AppContext.Provider value={value}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// const LoginPage = () => {
//   const { auth, userId, isAuthReady } = useContext(AppContext);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [showApp, setShowApp] = useState(false);
//   const [error, setError] = useState('');

//   const handleAuth = async () => {
//     try {
//       if (isRegistering) {
//         await createUserWithEmailAndPassword(auth, email, password);
//       } else {
//         await signInWithEmailAndPassword(auth, email, password);
//       }
//       setShowApp(true);
//       setError('');
//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//     }
//   };

//   if (!isAuthReady) {
//     return (
//       <div className="loading-container">
//         <div className="loading-card">
//           <p className="loading-text">Loading...</p>
//           <p className="loading-subtext">Initializing app services.</p>
//         </div>
//       </div>
//     );
//   }

//   if (showApp) {
//     return <EstimatorPage setShowLoginPage={setShowApp} />;
//   }

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <h1 className="login-title">
//           {isRegistering ? 'Create Account' : 'Login to'} <span className="login-highlight">WattWise</span>
//         </h1>
//         <p className="login-description">
//           Your smart assistant for estimating electricity usage and saving energy.
//         </p>

//         {error && <p className="error-message">{error}</p>}

//         <input
//           type="email"
//           placeholder="Email"
//           className="input-field"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="input-field"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button onClick={handleAuth} className="login-button">
//           {isRegistering ? 'Sign Up' : 'Log In'}
//         </button>

//         <p className="toggle-text">
//           {isRegistering ? 'Already have an account?' : 'New here?'}{' '}
//           <button className="link-button" onClick={() => setIsRegistering(!isRegistering)}>
//             {isRegistering ? 'Log In' : 'Sign Up'}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// const App = () => {
//   return (
//     <AppProvider>
//       <LoginPage />
//     </AppProvider>
//   );
// };

// export default App;
// export { AppContext };


import EstimatorPage from './EstimatorPage';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import './App.css';

const firebaseConfig = {
  apiKey: "AIzaSyCjhrDxbpbQGzhFMsHC0gIbKACNYvTNzMU",
  authDomain: "test-da209.firebaseapp.com",
  projectId: "test-da209",
  storageBucket: "test-da209.firebasestorage.app",
  messagingSenderId: "183425406353",
  appId: "1:183425406353:web:f499c46d8cfae3567bb630",
  measurementId: "G-V79Z1H5QF1"
};

const AppContext = createContext(null);

const AppProvider = ({ children }) => {
  const [app, setApp] = useState(null);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const initializedApp = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(initializedApp);
      const firebaseAuth = getAuth(initializedApp);

      setApp(initializedApp);
      setDb(firestoreDb);
      setAuth(firebaseAuth);

      const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
        setUser(currentUser);
        setIsAuthReady(true);
      });

      return () => unsubscribe();
    } catch (initError) {
      console.error("Firebase initialization error:", initError);
      setError("Failed to initialize Firebase. Please check your configuration.");
      setIsAuthReady(true);
    }
  }, []);

  const value = { app, db, auth, user, isAuthReady, error, setError, setUser };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const LoginPage = () => {
  const { auth, user, isAuthReady, error, setError, setUser } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const clearInputs = () => {
    setEmail('');
    setPassword('');
  };

  const handleAuth = async () => {
    setLoading(true);
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      clearInputs();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="loading-container">
        <div className="loading-card">
          <p className="loading-text">Loading...</p>
          <p className="loading-subtext">Initializing app services.</p>
        </div>
      </div>
    );
  }

  // If user is already logged in, show the EstimatorPage
  if (user) {
    return <EstimatorPage />;
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">
          {isRegistering ? 'Create Account' : 'Login to'} <span className="login-highlight">WattWise</span>
        </h1>
        <p className="login-description">
          Your smart assistant for estimating electricity usage and saving energy.
        </p>

        {error && <p className="error-message">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button onClick={handleAuth} className="login-button" disabled={loading}>
          {loading ? 'Please wait...' : isRegistering ? 'Sign Up' : 'Log In'}
        </button>

        <p className="toggle-text">
          {isRegistering ? 'Already have an account?' : 'New here?'}{' '}
          <button
            className="link-button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              clearInputs();
            }}
            disabled={loading}
          >
            {isRegistering ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

// Modify EstimatorPage to accept signOut prop or provide logout button
// For example, adding a logout button here:

const EstimatorPageWithLogout = () => {
  const { auth, setUser } = useContext(AppContext);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
      <EstimatorPage />
    </>
  );
};

const App = () => {
  return (
    <AppProvider>
      <LoginPage />
    </AppProvider>
  );
};

export default App;
export { AppContext };
