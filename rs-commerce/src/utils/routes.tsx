import { ROUTE_PATH } from 'constants/constants';
import Login from 'views/login/Login';
import Main from 'views/main/Main';
import NotFound from 'views/notFound/NotFound';
import Registration from 'views/registration/Registration';
import UserProfile from 'views/user-profile/UserProfile';
import ChangePassword from 'views/user-profile/change-password/ChangePassword';

const routes = [
  {
    path: ROUTE_PATH.main,
    component: <Main />,
  },
  {
    path: ROUTE_PATH.login,
    component: <Login />,
  },
  {
    path: ROUTE_PATH.registration,
    component: <Registration />,
  },
  {
    path: ROUTE_PATH.profile,
    component: <UserProfile />,
  },
  {
    path: ROUTE_PATH.changePassword,
    component: <ChangePassword />,
  },
  {
    path: '*',
    component: <NotFound />,
  },
];

export default routes;
