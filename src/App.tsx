import { FunctionComponent} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { routeList } from './constants/routes';
import { Pagenotfound } from './containers/pagenotfoundContainer';

const AuthWrapper: FunctionComponent<{isAuthenticated : boolean}> = ({isAuthenticated}) => {
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

const App = () => {
  const isAuthenticated = false;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthWrapper isAuthenticated={isAuthenticated} />}/>
        {routeList.map(route => {
          return (
            <Route key={route.path} path={route.path} element={<route.component />} />
          )
        })}
        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
