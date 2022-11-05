import { FunctionComponent} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { routeList } from './constants/routes';
import { Pagenotfound } from './containers/pagenotfoundContainer';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import 'react-phone-input-2/lib/material.css'
import './App.css'

const theme = createTheme({
  palette: {
    background: {
      default: "#DCE8EF"
    },
  },
  typography: {
    fontFamily: 'Signika'
  }
});

const AuthWrapper: FunctionComponent<{isAuthenticated : boolean}> = ({isAuthenticated}) => {
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

const App = () => {
  const accesstoken = localStorage.getItem('accesstoken');
  const isAuthenticated = (accesstoken && accesstoken.length > 0) ? true : false;

  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

export default App;
