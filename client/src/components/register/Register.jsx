import "./Register.css";
import { useState, useContext, useEffect } from "react";
import { AuthenticationContext } from "../../context/AuthContext";
import {
  Form,
  FormControl,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import axios from "axios";
import LoginModal from "../login/LoginModal";
import "./Register.css";
import logo from "../../assets/anonymus.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import InfoModal from "../info/InfoModal";
import Loader from "../loader/Loader";

export default function Register() {
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [pin, setPin] = useState("");
  const { isFetching } = useContext(AuthenticationContext);
  const infoIcon = <FontAwesomeIcon icon={faInfoCircle} />;

  const [modalShow, setModalShow] = useState(false);
  const [infoModalShow, setInfoModalShow] = useState(false);

  const handleClose = () => setModalShow(false);
  const handleOpen = () => setModalShow(true);

  const infoModalClose = () => setInfoModalShow(false);
  const infoModalOpen = () => setInfoModalShow(true);

  const [allUsers, setAllUsers] = useState(null);

  // get all users
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get(
          "https://pure-savannah-29011.herokuapp.com/api/users/"
        );
        setAllUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, []);

  const isRegistered = allUsers?.find((user) => user.username === regUsername);

  function addUser(e) {
    e.preventDefault();
    const user = { username: regUsername, password: regPassword, pin };
    axios.post(
      "https://pure-savannah-29011.herokuapp.com/api/auth/register",
      user
    );
    setRegPassword("");
    setRegUsername("");
    setPin("");
    handleOpen();
  }

  return (
    <div>
      {isFetching ? (
        <Loader />
      ) : (
        <>
          <div
            className="main-register-container d-flex flex-column justify-content-center align-items-center text-center"
            style={{ height: "100vh" }}
          >
            <div className="register-form-container d-flex flex-column ">
              <Form className="register-form-inputs" onSubmit={addUser}>
                <div className="d-flex justify-content-center">
                  <img className="anonymus-img" src={logo} alt="anonymus" />
                </div>

                <FormControl
                  type="text"
                  className="mt-3"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="username"
                  required
                />
                <div
                  style={
                    !isRegistered
                      ? { display: "none" }
                      : { display: "block", color: "red" }
                  }
                >
                  Username already exists
                </div>
                <FormControl
                  type="password"
                  minLength="8"
                  className="mb-3 mt-3"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="password"
                  required
                />
                <Button
                  style={{ width: "100%" }}
                  variant="success"
                  size="lg"
                  type="submit"
                  className="mb-5"
                >
                  Register
                </Button>
                <p style={{ color: "whitesmoke", fontWeight: "bold" }}>
                  Already registered ?
                </p>
                <Button
                  className="login-button"
                  style={{ width: "100%" }}
                  variant="info"
                  size="lg"
                  onClick={handleOpen}
                >
                  Login
                </Button>
              </Form>

              <div className="info-section d-flex justify-content-end">
                <OverlayTrigger
                  key="top"
                  placement="top"
                  overlay={
                    <Tooltip id={`tooltip-top`}>
                      What's cool about this chat ?
                    </Tooltip>
                  }
                >
                  <Button
                    style={{
                      background: "inherit",
                      border: 0,
                      outline: "none",
                      boxShadow: "none",
                      fontSize: "30px",
                    }}
                    className="info-icon text-info"
                    onClick={infoModalOpen}
                  >
                    {infoIcon}
                  </Button>
                </OverlayTrigger>
              </div>
            </div>
            <InfoModal show={infoModalShow} close={infoModalClose} />
            <LoginModal show={modalShow} close={handleClose} />
          </div>
        </>
      )}
    </div>
  );
}
