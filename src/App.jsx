import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from "./auth/AuthContext";
import AuthModal from "./auth/AuthModal";
import { auth } from "./auth/config/firebase-config";
import MainContent from "./components/MainContent";
import Navbar from "./components/Navbar";
import './index.css';
import { Footer } from "./widgets/Footer";
import UserInfoPopup from "./widgets/userInfo";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModel, setShowAuthModel] = useState(false);
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleStartLoading = () => setIsLoading(true);
    const handleStopLoading = () => setIsLoading(false);

    handleStartLoading();
    const timer = setTimeout(handleStopLoading, 500);

    return () => clearTimeout(timer);
  }, [location]);

  const toggleProfileWidget = () => setIsProfileClicked(!isProfileClicked);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
    themeCheck();

    return () => unsubscribe();
  }, []);

  const navigate = useNavigate();

  const handleExploreClick = (title, link) => {
    if (isAuthenticated) {
      if (link) {
        navigate(link);
      }
    } else {
      setShowAuthModel(true);
    }
  };

  const themeCheck = () => {
    const userTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (localStorage.theme === "dark" || (!userTheme && systemTheme)) {
      document.documentElement.classList.add("dark");
      setIsDarkTheme(true);
    } else {
      document.documentElement.classList.add("light");
      setIsDarkTheme(false);
    }
  };

  const themeSwitch = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
      setIsDarkTheme(false);
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
      setIsDarkTheme(true);
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const [user, setUser] = useState({
    isAuthenticated: false,
    name: '',
    email: '',
    photoURL: ''
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser({
          isAuthenticated: true,
          name: user.displayName || 'No Name',
          email: user.email,
          photoURL: user.photoURL || 'path/to/default/image.png'
        });
      } else {
        setUser({
          isAuthenticated: false,
          name: '',
          email: '',
          photoURL: ''
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthProvider>
      <div className="flex flex-col">
        <Routes>
          <Route path="/" element={
            <>
              {showAuthModel && (
                <AuthModal onClose={() => setShowAuthModel(false)} />
              )}
              {isProfileClicked && (
                <UserInfoPopup
                  onClose={() => setIsProfileClicked(false)}
                  userName={user.name}
                  userEmail={user.email}
                  userPhotoURL={user.photoURL}
                />
              )}
              <Navbar
                isDarkTheme={isDarkTheme}
                themeSwitch={themeSwitch}
                toggleMobileMenu={toggleMobileMenu}
                isMobileMenuOpen={isMobileMenuOpen}
                onProfileClick={toggleProfileWidget}
              />
              <MainContent handleExploreClick={handleExploreClick} />
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
