
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './Component/NavBar';
import  Home  from "./Router/Home";
import Login from "./Router/Login"
import ManageSite from "./Router/ManageSite";

//Import of users
import CreateUser from "./Router/CreateUser";
import ViewUser from "./Router/ViewUser";
//Trips
import CreateTrip from "./Router/CreateTrip";
import ViewTrip from "./Router/ViewTrip"
import MainTrips from "./Router/MainTrips";
//Places
import CreatePlace from "./Router/CreatePlace";
import ViewPlace from "./Router/ViewPlace";

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
          <Route path="/Place" element={ <CreateUser/>}/>
          <Route path="/CreatePlace" element={<ProtectedRoute><CreatePlace/></ProtectedRoute>} />
          <Route path="/CreateTrip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>}/>
          <Route path="/ManageSite" element={<ProtectedRoute><ManageSite/></ProtectedRoute>}/>
          <Route path="/ViewUser/:UserID" element={<ViewUser/>}/>
          <Route path="/ViewPlace/:PlaceID" element={<ViewPlace/>}/>
          <Route path="/ViewTrip/:tripId" element={<ViewTrip/>}/>
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