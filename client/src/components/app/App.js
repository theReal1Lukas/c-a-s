import { useContext } from "react";
import Register from "../register/Register";
import Dashboard from "../dashboard/Dashboard";
import { AuthenticationContext } from "../../context/AuthContext";
import "./App.css";

export default function App() {
  const { user } = useContext(AuthenticationContext);
  return <>{user !== null ? <Dashboard /> : <Register />}</>;
}
