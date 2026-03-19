
import { BrowserRouter, Routes, Route } from "react-router-dom";
import  Home  from "./Pages/Home";
import Login from "./Pages/Login"
import ManageSite from "./Pages/ManageSite";
import MainTrips from "./Pages/MainTrips";
import MainPlaces from "./Component/Places/MainPlaces";
import Create from "./Pages/Create";
import Search from "./Pages/Search";
import View from "./Pages/View"
import Edit from "./Pages/Edit"
import Profile from "./Pages/Profile";
import FAQ from "./Pages/FAQ";
import RankingPage from "./Pages/Ranking";
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from "./Component/Commons/ProtectedRoute";
import SessionWarning from "./Component/Commons/SessionWarning";
import { Navigate } from 'react-router-dom';
import AppBar from "./Component/Commons/AppBar";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  typography: {
    fontFamily: "'Press Start 2P', cursive, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    h1: { fontFamily: "'Press Start 2P', cursive" },
    h2: { fontFamily: "'Press Start 2P', cursive" },
    h3: { fontFamily: "'Press Start 2P', cursive" },
    h4: { fontFamily: "'Press Start 2P', cursive" },
    h5: { fontFamily: "'Press Start 2P', cursive" },
    h6: { fontFamily: "'Press Start 2P', cursive" },
    body1: { fontFamily: "'Press Start 2P', cursive" },
    body2: { fontFamily: "'Press Start 2P', cursive" },
    button: { fontFamily: "'Press Start 2P', cursive" },
  },
});

function AppContent() {
  
  return (
    <>
      <AppBar/>
      <SessionWarning />
        <Routes>
          <Route exact path="/" element={ <Home /> } />
          <Route path="/Login" element={ <Login/>}/>
          <Route path="/Trips" element={ <MainTrips/>}/>
          <Route path="/Places" element={ <MainPlaces/>}/>
          <Route path="/ManageSite" element={<ProtectedRoute 
          requiredRole="admin"><ManageSite/></ProtectedRoute>}/>
          <Route path="/Create/:opt" requiredRole="user" element={<Create />}/>
          <Route path="/Edit/:opt/:id" requiredRole="user" element={<ProtectedRoute> <Edit /> </ProtectedRoute>}/>
          <Route path="/Search/:opt" element={<Search/>}/>
          <Route path="/View/:opt/:id" element={<View/>}/>
          <Route path="/Ranking" element={<RankingPage/>}/>
          <Route path="/Ranking/:entityType" element={<RankingPage/>}/>
          <Route path="/Profile" requiredRole="user" element={<ProtectedRoute> <Profile/> </ProtectedRoute>}/>
          <Route path="/FAQ" element={<FAQ/>}/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </> );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
            <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}