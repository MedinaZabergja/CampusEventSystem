import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import toast from 'react-hot-toast';
import './App.css';

import Events from './pages/Events';
import Login from './pages/Login';
import Register from './pages/Register';
import MyRegistrations from './pages/MyRegistrations';
import CreateEvent from './pages/CreateEvents';
import Feedback from './pages/Feedback';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import EditEvent from './pages/EditEvents';
import ChangePassword from './pages/ChangePassword';
import { LanguageContext } from './context/LanguageContext';

function App() {
  const { language, setLanguage } = useContext(LanguageContext);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);

    toast.success(
      language === 'en'
        ? 'Logged out successfully!'
        : 'Dolët me sukses!'
    );
  };

  return (
    <BrowserRouter>
      <nav>
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <img
              src="/umib-logo.png"
              alt="UMIB"
              className="navbar-logo"
            />

            <div>
              <h3>UMIB</h3>
              <p>Campus Events</p>
            </div>
          </Link>

          <div className="nav-links">
            <Link to="/">
              {language === 'en' ? 'Home' : 'Ballina'}
            </Link>

            <Link to="/events">
              {language === 'en' ? 'Events' : 'Eventet'}
            </Link>

            {user && (
              <>
                <Link to="/my-registrations">
                  {language === 'en'
                    ? 'My Registrations'
                    : 'Regjistrimet'}
                </Link>

                <Link to="/feedback">
                  {language === 'en'
                    ? 'Feedback'
                    : 'Vlerësime'}
                </Link>

                <Link to="/change-password">
                  {language === 'en'
                    ? 'Change Password'
                    : 'Fjalëkalimi'}
                </Link>

                {user.role === 'admin' && (
                  <Link to="/create-event">
                    {language === 'en'
                      ? 'Create Event'
                      : 'Krijo Event'}
                  </Link>
                )}
              </>
            )}

            {!user && (
              <>
                <Link to="/login">
                  {language === 'en' ? 'Login' : 'Kyçu'}
                </Link>

                <Link to="/register">
                  {language === 'en'
                    ? 'Register'
                    : 'Regjistrohu'}
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="nav-right">
          {user && (
            <div className="nav-user-box">
              <span>
                {language === 'en'
                  ? 'Hello,'
                  : 'Përshëndetje,'}
              </span>
              <strong>{user.fullName}!</strong>
            </div>
          )}

          <button
            className="language-btn"
            onClick={() =>
              setLanguage(language === 'en' ? 'sq' : 'en')
            }
          >
            {language === 'en'
              ? '🇦🇱 Shqip'
              : '🇬🇧 English'}
          </button>

          {user && (
            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              {language === 'en' ? 'Logout' : 'Dil'}
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/events" element={<Events />} />

        <Route path="/events/:id" element={<EventDetails />} />

        <Route path="/login" element={<Login setUser={setUser} />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/my-registrations"
          element={<MyRegistrations />}
        />

        <Route
          path="/create-event"
          element={
            user?.role === 'admin' ? <CreateEvent /> : <Events />
          }
        />

        <Route
          path="/edit-event/:id"
          element={
            user?.role === 'admin' ? <EditEvent /> : <Events />
          }
        />

        <Route path="/feedback" element={<Feedback />} />

        <Route
          path="/change-password"
          element={<ChangePassword />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;