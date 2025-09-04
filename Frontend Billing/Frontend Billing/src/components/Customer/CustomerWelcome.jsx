import React from "react";

export default function AdminWelcome() {
  return (
    
    <>
    <div style={{

        textAlign:"center",
        paddingTop: "180px",
        backgroundImage: "url(../../assets/HomeBackground.jpg)"
        
      }}> 
      <h2 style={{
        fontSize: "28px",
        color: "#263238",
        marginBottom: "22px",
        fontWeight: "700"
      }}>Welcome to the Customer Dashboard</h2>
      <p style={{
        fontSize: "19px",
        color: "#50707b"
      }}>
        Select an option from the left.
      </p>
    </div>
    </>
  );
}
