
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './Component/NavBar';
import  Home  from "./Pages/Home";
import Login from "./Pages/Login"
import ManageSite from "./Pages/ManageSite";
import MainTrips from "./Pages/MainTrips";
import MainPlaces from "./Component/Places/MainPlaces";
import Create from "./Pages/Create";
import Search from "./Pages/Search";
import View from "./Pages/View"
import Edit from "./Pages/Edit"
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from "./Component/ProtectedRoute";
import { Navigate } from 'react-router-dom';

function AppContent() {
  
  return (
    <>
      <NavBar/>
        <Routes>
          <Route exact path="/" element={ <Home /> } />
          <Route path="/Login" element={ <Login/>}/>
          <Route path="/Trips" element={ <MainTrips/>}/>
          <Route path="/Places" element={ <MainPlaces/>}/>
          <Route path="/ManageSite" element={<ProtectedRoute><ManageSite/></ProtectedRoute>}/>
          <Route path="/Create/:opt" element={ <ProtectedRoute><Create/></ProtectedRoute>}/>
          <Route path="/Search/:opt" element={<Search/>}/>
          <Route path="/View/:opt/:id" element={<View/>}/>
          <Route path="/Edit/:opt/:id" element={<ProtectedRoute> <Edit /> </ProtectedRoute>}/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </> );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          backgroundImage: 'url(/Background.JPEG)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          flexGrow: 1}}>
          <AppContent />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}