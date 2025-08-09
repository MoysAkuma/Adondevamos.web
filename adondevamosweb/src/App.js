
import { BrowserRouter, Routes, Route } from "react-router-dom";
import  Home  from "./Router/Home";
import CreateUser from "./Router/CreateUser";
import CreatePlace from "./Router/CreatePlace";
import CreateTrip from "./Router/CreateTrip";
import Login from "./Router/Login"
import ManageSite from "./Router/ManageSite";
import ViewUser from "./Router/ViewUser";
import ViewPlace from "./Router/ViewPlace";
import ViewTrip from "./Router/ViewTrip"
import NavBar from './Component/NavBar';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from "./Component/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar/>
        <AuthProvider>
          <Routes>
            <Route exact path="/" element={ <Home /> } />
            <Route path="/login" element={<Login/>}/>
            <Route path="/CreateUser" element={<CreateUser/>}/>
            <Route path="/CreatePlace" element={<ProtectedRoute><CreatePlace/></ProtectedRoute>}/>
            <Route path="/CreateTrip" element={<ProtectedRoute><CreateTrip/></ProtectedRoute>}/>
            <Route path="/ManageSite" element={<ProtectedRoute><ManageSite/></ProtectedRoute>}/>
            <Route path="/ViewUser/:UserID" element={<ViewUser/>}/>
            <Route path="/ViewPlace/:PlaceID" element={<ViewPlace/>}/>
            <Route path="/ViewTrip/:Trip" element={<ViewTrip/>}/>
          </Routes>
        </AuthProvider>
    </BrowserRouter>
  );
}