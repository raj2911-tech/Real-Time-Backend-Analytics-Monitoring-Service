import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;


function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const data = response.data;

      setMessage("Login successful!");

      console.log("User:", data.user);

      setFormData({
        email: "",
        password: ""
      });

    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Something went wrong");
      }

      console.error(error);
    }
  };

  return (
    <div style={{ width: "400px", margin: "100px auto", fontFamily: "Arial" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <button
          type="submit"
          style={{ padding: "10px", width: "100%", cursor: "pointer" }}
        >
          Login
        </button>

      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;