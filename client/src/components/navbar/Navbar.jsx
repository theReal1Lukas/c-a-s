import axios from "axios";
import { useState } from "react";
import { Navbar, Form, FormControl, Button } from "react-bootstrap";
import "./Navbar.css";
import logo from "../../assets/anonymus.png";

export default function NavigationBar({ user }) {
  const [addFriend, setAddFriend] = useState("");

  function logout() {
    localStorage.clear();
    window.location.reload();
    window.location.href = "/";
  }

  const searchFriend = async () => {
    const convMembers = {
      senderId: user._id,
      receiverId: addFriend,
    };
    try {
      await axios.post(
        "https://pure-savannah-29011.herokuapp.com/api/conversations",
        convMembers
      );
      setAddFriend("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Navbar className="navigation-bar" variant="dark" expand="lg">
      <Navbar.Brand>
        <img className="navbar-logo" src={logo} alt="logo" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarScroll" className="toggler" />
      <Navbar.Collapse className="justify-content-center" id="navbarScroll">
        <div className="current-user-id">
          <h4>Your ID</h4>
          <h6>
            <em style={{ color: "white" }}>{user._id}</em>
          </h6>
        </div>
        <Form
          className="navbar-search-form d-flex search-form"
          onSubmit={searchFriend}
        >
          <FormControl
            style={{ marginRight: "25px" }}
            value={addFriend}
            onChange={(e) => setAddFriend(e.target.value)}
            type="search"
            placeholder="Enter Friend's ID"
            aria-label="Search"
          />
          <Button type="submit" variant="success">
            Search
          </Button>
        </Form>
        <Button className="logout-button" variant="info" onClick={logout}>
          Log Out
        </Button>
      </Navbar.Collapse>
    </Navbar>
  );
}
