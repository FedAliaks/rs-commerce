import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Logo from 'assets/images/logo.png';
import { LOCAL_STORAGE_TOKEN, ROUTE_PATH } from 'constants/constants';
import { useAppSelector } from 'hooks/typed-react-redux-hooks';
import { apiAuthSlice } from 'redux/slices/api-auth-slice';
import style from './style.module.css';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuth =
    !!localStorage.getItem(LOCAL_STORAGE_TOKEN) && useAppSelector((state) => state.apiAuth.isAuth);

  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);

  const rightList = [
    {
      path: ROUTE_PATH.login,
      title: 'Login',
      className: style['underline'],
      withAuth: false,
    },
    {
      path: ROUTE_PATH.registration,
      title: 'Registration',
      className: style['underline'],
      withAuth: false,
    },
  ];

  const toggleBurgerMenu = () => setIsBurgerMenuOpen(!isBurgerMenuOpen);

  useEffect(() => {
    setIsBurgerMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN);
    apiAuthSlice.actions.resetApiAuthSlice();

    navigate(ROUTE_PATH.main);
  };

  return (
    <header className={`${style['header']} container`}>
      <Link to="/" className={style['logo']}>
        <img src={Logo} width="40" height="40" alt="Hurricane bookstore logo" />
        <span>Hurricane bookstore</span>
      </Link>

      <button
        className={style['burger_menu']}
        onClick={toggleBurgerMenu}
        type="button"
        aria-label="burger menu">
        <span />
      </button>

      <nav className={`${style['nav']} ${isBurgerMenuOpen ? style['nav-open'] : ''}`}>
        <ul className={style['nav-right']}>
          {rightList
            .filter((item) => (isAuth ? item.withAuth : true))
            .map((item) => (
              <li key={item.path}>
                <Link to={item.path} className={item.className} aria-label={item.title}>
                  {item.title}
                </Link>
              </li>
            ))}
          {isAuth && (
            <li>
              <button
                aria-label="Logout"
                onClick={handleLogout}
                className={style['logout']}
                type="button">
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
