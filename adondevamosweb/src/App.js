
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
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from "./Component/Commons/ProtectedRoute";
import SessionWarning from "./Component/Commons/SessionWarning";
import { Navigate } from 'react-router-dom';
import AppBar from "./Component/Commons/AppBar";

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
          <Route path="/Create/:opt" element={<Create />}/>
          <Route path="/Edit/:opt/:id" element={<ProtectedRoute> <Edit /> </ProtectedRoute>}/>
          <Route path="/Search/:opt" element={<Search/>}/>
          <Route path="/View/:opt/:id" element={<View/>}/>
          <Route path="/Profile" element={<ProtectedRoute> <Profile/> </ProtectedRoute>}/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </> );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
          <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}