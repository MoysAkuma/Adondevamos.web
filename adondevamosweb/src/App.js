import { BrowserRouter, Routes, Route } from "react-router-dom";
import  Home  from "./Router/Home";
import CreateUser from "./Router/CreateUser";
import CreatePlace from "./Router/CreatePlace";
import CreateTrip from "./Router/CreateTrip";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/CreateUser" element={<CreateUser/>}/>
        <Route path="/CreatePlace" element={<CreatePlace/>}/>
        <Route path="/CreateTrip" element={<CreateTrip/>}/>
      </Routes>
    </BrowserRouter>
  );
}