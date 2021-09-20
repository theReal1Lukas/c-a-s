import axios from "axios";
import { useState, useEffect } from "react";
import "./Conversation.css";
import logo from "../../assets/anonymus.png";

export default function Conversation({
  onlineUsers,
  conversation,
  currentUser,
}) {
  const [user, setUser] = useState(null);
  const onlineUser = onlineUsers.map((onlineUser) => onlineUser);
  const onlineUserId = onlineUser.find((ou) => ou === user?._id);

  const isFriendOnline = onlineUserId === user?._id;

  useEffect(() => {
    const friendId = conversation.members.find(
      (member) => member !== currentUser._id
    );
    const getUser = async () => {
      try {
        const res = await axios.get(
          "https://pure-savannah-29011.herokuapp.com/api/users/" + friendId
        );

        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [conversation, currentUser]);

  return (
    <>
      <div className="conversation d-flex ">
        <div className="mt-3">
          <img
            style={{ width: "50px", marginRight: "10px" }}
            src={logo}
            alt=""
          />
          <div
            className="online-circle"
            style={
              isFriendOnline ? { background: "green" } : { background: "red" }
            }
          />
        </div>
        <ul className="ul-conversation">
          <li
            style={!user?.username ? { display: "none" } : { display: "block" }}
          >
            <div className="friends">
              <span></span>

              <h4 className="conversation-username"> {user?.username} </h4>
            </div>
          </li>
        </ul>
      </div>
      <hr style={{ color: "white", margin: "5", padding: "0" }} />
    </>
  );
}
