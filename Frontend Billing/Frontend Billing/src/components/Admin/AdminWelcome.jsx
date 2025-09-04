import React from "react";
import "./AdminWelcome.css"

export default function AdminWelcome() {
  return (
    <>
    <div className="welcome-background"></div>
    <div style={{
        textAlign:"center", 
        paddingTop: "180px",
      }}>
      <h2 style={{
        fontSize: "28px",
        color: "#263238",
        marginBottom: "22px",
        fontWeight: "700"
      }}>Admin Dashboard </h2>
      <p style={{
        fontSize: "19px",
        color: "#50707b"
      }}>
      </p>
    </div>
    
    </>
  );
}
