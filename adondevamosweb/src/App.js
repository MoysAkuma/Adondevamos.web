
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './Component/NavBar';
import  Home  from "./Pages/Home";
import Login from "./Pages/Login"
import ManageSite from "./Pages/ManageSite";

//Import of users
import CreateUser from "./Pages/CreateUser";
import ViewUser from "./Pages/ViewUser";

//Trips
import CreateTrip from "./Pages/CreateTrip";
import ViewTrip from "./Pages/ViewTrip"
import MainTrips from "./Pages/MainTrips";
import EditTrip from "./Pages/EditTrip";

//Places
import MainPlaces from "./Component/Places/MainPlaces";
import CreatePlace from "./Pages/CreatePlace";
import ViewPlace from "./Pages/ViewPlace";

import Search from "./Pages/Search";
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
          <Route path="/EditTrip/:TripId" element={<ProtectedRoute><EditTrip /></ProtectedRoute>}/>
          <Route path="/CreateAccount" element={ <CreateUser/>}/>
          <Route path="/CreatePlace" element={<ProtectedRoute><CreatePlace/></ProtectedRoute>} />
          <Route path="/CreateTrip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>}/>
          <Route path="/ManageSite" element={<ProtectedRoute><ManageSite/></ProtectedRoute>}/>
          <Route path="/Search/:opt" element={<Search/>}/>
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