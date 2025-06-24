import React, { useState } from "react";
import Login from "../Components/Login/Login";
import Signup from "../Components/Signup/Signup";
import "./HomePage.css"; // 👈 Import the CSS

function HomePage() {
  const [loginPage, setLoginPage] = useState(false);

  return (
    <div className="homepage-container">
      <div className="card">
        <div className="card-heading">Chat App</div>

        <div className="card-content">
          {/* Left image for larger screens */}
          <div className="left-image">
            <img
              src={require("../Assets/bg4.avif")}
              alt="Background"
              style={{ marginLeft:"2rem",  width: "90%", height: "90%"}}
            />
          </div>

          {/* Form */}
          <div className="form-area">
            {loginPage ? (
              <Login setLoginPage={setLoginPage} />
            ) : (
              <Signup setLoginPage={setLoginPage} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
