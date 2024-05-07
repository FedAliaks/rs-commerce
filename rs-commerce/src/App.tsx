import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import routes from 'utils/routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
