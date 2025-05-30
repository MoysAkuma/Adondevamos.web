
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

export default function App() {
  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/CreateUser" element={<CreateUser/>}/>
        <Route path="/CreatePlace" element={<CreatePlace/>}/>
        <Route path="/CreateTrip" element={<CreateTrip/>}/>
        <Route path="/ManageSite" element={<ManageSite/>}/>
        <Route path="/ViewUser" element={<ViewUser/>}/>
        <Route path="/ViewPlace" element={<ViewPlace/>}/>
        <Route path="/ViewTrip" element={<ViewTrip/>}/>
      </Routes>
    </BrowserRouter>
  );
}