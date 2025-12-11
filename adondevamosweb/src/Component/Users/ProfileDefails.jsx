import React from "react";

export default function ProfileDetails({ user }) {
    return (
        <div>
            <h2>Profile Details</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
        </div>
    );
}