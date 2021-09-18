import axios from "axios";
import { useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { AuthenticationContext } from "../../context/AuthContext";
import "./Dashboard.css";
import Message from "../messages/Message";
import Conversation from "../conversations/Conversation";
import jwt_decode from "jwt-decode";
import jwt from "jsonwebtoken";
import {
  Container,
  Row,
  Col,
  Button,
  FormControl,
  Form,
  Offcanvas,
} from "react-bootstrap";
import NavigationBar from "../navbar/Navbar";
import AlertModal from "../alert/AlertModal";

export default function Dashboard() {
  const socket = useRef();
  const { user } = useContext(AuthenticationContext);
  const [currentChat, setCurrentChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [friend, setFriend] = useState(null);
  const scrollDownRef = useRef();

  // get friends
  const friendId = currentChat?.members.find((member) => member !== user._id);

  useEffect(() => {
    const getFriend = async () => {
      try {
        if (friendId) {
          const res = await axios.get(
            "https://rocky-reaches-36155.herokuapp.com/api/users/" + friendId
          );
          setFriend(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getFriend();
  }, [friendId]);

  // get conversations

  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await axios.get(
          "https://rocky-reaches-36155.herokuapp.com/api/conversations/" +
            user._id
        );
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversation();
  }, [user]);

  // get messages

  useEffect(() => {
    const getMessage = async () => {
      try {
        const res = await axios.get(
          "https://rocky-reaches-36155.herokuapp.com/api/messages/" +
            currentChat?._id
        );

        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessage();
  }, [currentChat]);

  //  delete all messages from conversation

  const handleDeleteMessages = async () => {
    try {
      await axios.delete(
        "https://rocky-reaches-36155.herokuapp.com/api/messages/delete/" +
          currentChat?._id
      );
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    socket.current = io();
    socket.current.on("getMessage", (data) => {
      const cryptMessage = jwt.sign(
        {
          data: data.text,
        },
        "MyOtherBiggestSecret",
        { expiresIn: "1h" }
      );
      const decode = jwt_decode(cryptMessage);
      setArrivalMessage({
        sender: data.senderId,
        text: decode.data,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(users.map((user) => user.userId));
    });
  }, [user]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const msng = {
      conversationId: currentChat._id,
      senderId: user._id,
      text: newMessage,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post(
        "https://rocky-reaches-36155.herokuapp.com/api/messages/",
        msng
      );
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };
  const [showCanvas, setShowCanvas] = useState(false);

  const handleCloseCanvas = () => setShowCanvas(false);
  const handleShowCanvas = () => setShowCanvas(true);
  // ///////////////
  const [alertModal, setAlertModal] = useState(false);

  const closeAlertModal = () => setAlertModal(false);
  const showAlertModal = () => setAlertModal(true);

  useEffect(() => {
    scrollDownRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container className="dashboard-container">
      <NavigationBar user={user} />
      <Row className="dashboard-messenger">
        <Col xs={1}></Col>
        <Col
          xs={{ span: 12, order: 4 }}
          md={3}
          lg={2}
          className="d-flex justify-content-center conversations-container text-center"
        >
          <Button
            className="open-conversations-button"
            variant="info"
            onClick={handleShowCanvas}
          >
            Open Conversations
          </Button>
          {currentChat && (
            <Button
              className="delete-messages-button"
              variant="info"
              onClick={showAlertModal}
            >
              Delete Messages
            </Button>
          )}

          <AlertModal
            show={alertModal}
            close={closeAlertModal}
            friend={friend}
            deleteMessages={handleDeleteMessages}
          />

          <Offcanvas show={showCanvas} onHide={handleCloseCanvas}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>
                <p className="offcanvas-title">Conversations</p>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <div className="conversation-box ">
                {conversations.map((conv) => (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setCurrentChat(conv);
                      handleCloseCanvas();
                    }}
                  >
                    <Conversation
                      className="conversation"
                      onlineUsers={onlineUsers}
                      key={conv._id}
                      conversation={conv}
                      currentUser={user}
                    />
                  </div>
                ))}
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </Col>

        <Col xs={12} md={7} className="messages-container">
          {currentChat ? (
            <>
              <div className="chat-box">
                {messages.map((m) => (
                  <div ref={scrollDownRef}>
                    <Message
                      key={m._id}
                      message={m}
                      friend={friend}
                      currentUser={user}
                    />
                  </div>
                ))}
              </div>
              <Form
                style={{ paddingTop: "10px" }}
                className="d-flex"
                onSubmit={sendMessage}
              >
                <FormControl
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="messages-input "
                  type="text"
                  placeholder="message"
                ></FormControl>

                <Button
                  type="submit"
                  className="messages-button bg-warning border-0"
                >
                  Send
                </Button>
              </Form>
            </>
          ) : (
            <div
              style={{ height: "100%" }}
              className="d-flex justify-content-center align-items-center"
            >
              <p className="before-conversation-start-text">
                Select conversation to start chatting
              </p>
            </div>
          )}
        </Col>

        <Col xs={1}></Col>
      </Row>
    </Container>
  );
}
