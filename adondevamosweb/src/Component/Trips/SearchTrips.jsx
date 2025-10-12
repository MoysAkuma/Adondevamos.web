import React from "react";
import { useState, useEffect } from "react";
import TripFilters from "./TripFilters";
export default function SearchTrips() {
    return ( <>
        <h2>Search Trips</h2>
        <TripFilters />
    </>);
}