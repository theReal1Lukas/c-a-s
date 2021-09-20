import "./Message.css";
import jwt_decode from "jwt-decode";
import TimeAgo from "timeago-react";

export default function Message({ friend, message, currentUser }) {
  const token = message.text;
  const decode = jwt_decode(token);
  return (
    <div>
      <div
        className={
          message.senderId === currentUser._id
            ? "d-flex  justify-content-end "
            : "d-flex justify-content-start"
        }
      >
        <p
          style={
            message.senderId === currentUser._id
              ? { background: "rgb(2, 162, 236)", color: "white" }
              : { background: "rgb(236, 193, 2)", color: "white" }
          }
          className="message"
        >
          {decode.data}
        </p>
      </div>
      <div
        style={
          message.senderId === currentUser._id
            ? { display: "flex", justifyContent: "end", marginRight: "10px" }
            : { display: "flex", justifyContent: "start", marginLeft: "10px" }
        }
        className="message-author"
      >
        {message.senderId === currentUser._id
          ? currentUser.username
          : friend?.username}
      </div>
      <div
        className="time-ago"
        style={
          message.senderId === currentUser._id
            ? { display: "flex", justifyContent: "end", marginRight: "10px" }
            : { display: "flex", justifyContent: "start", marginLeft: "10px" }
        }
      >
        <TimeAgo datetime={message.createdAt} locale="vi" />
      </div>
    </div>
  );
}
