import { useState, useEffect } from "react";

import  NewTrips  from "../Component/NewTrips";

function Home() {
    const [loading, setLoading] = useState(true);
    
    return (
      <div className="App">
        <h1>¿A donde vamos?</h1>
    
        <h2>What is Adondevamos.io? </h2>
        <p>Adondevamos.io is a website to share your trip info and itinerary with friend, vote where yo wanted to go and share to others!</p>

        <h2>New trips</h2>
         <NewTrips />

      </div>
    );
  };
  export default Home;