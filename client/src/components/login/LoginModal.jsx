import { useState, useContext } from "react";
import { AuthenticationContext } from "../../context/AuthContext";
import { loginCall } from "../../apiCalls";
import {
  Modal,
  Form,
  FormControl,
  Button,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import "./LoginModal.css";

export default function LoginModal({ show, close }) {
  const [logUsername, setLogUsername] = useState("");
  const [logPassword, setLogPassword] = useState("");
  const { dispatch } = useContext(AuthenticationContext);

  function loginUser(e) {
    e.preventDefault();
    loginCall({ username: logUsername, password: logPassword }, dispatch);
    setLogUsername("");
    setLogPassword("");
  }

  return (
    <div className="d-flex justify-content-center">
      <Modal
        size="sm"
        className="login-modal"
        centered
        show={show}
        onHide={close}
      >
        <Modal.Header className="login-modal-header">Login</Modal.Header>
        <Modal.Body className="login-modal-body">
          <Container>
            <Row>
              <Col xs={1} />
              <Col xs={10}>
                <Form className="login-modal-form" onSubmit={loginUser}>
                  <FormControl
                    value={logUsername}
                    onChange={(e) => setLogUsername(e.target.value)}
                    type="text"
                    className="mb-3"
                    placeholder="Username"
                    size="lg"
                  />
                  <FormControl
                    value={logPassword}
                    onChange={(e) => setLogPassword(e.target.value)}
                    className="mb-5"
                    type="password"
                    placeholder="Password"
                    size="lg"
                  />
                  <hr className="login-hr" />
                  <Button
                    style={{ width: "100%" }}
                    className="login-button"
                    variant="success"
                    size="lg"
                    type="submit"
                  >
                    Enter Chat
                  </Button>
                </Form>
              </Col>
              <Col xs={1} />
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
      )
    </div>
  );
}
