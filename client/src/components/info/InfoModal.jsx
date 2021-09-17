import { Modal, Button } from "react-bootstrap";
import "./InfoModal.css";
export default function InfoModal({ show, close }) {
  return (
    <div>
      <Modal centered show={show} onHide={close}>
        <Modal.Header>Info</Modal.Header>
        <Modal.Body className="info-modal-description">
          Since we live in times when privacy is hard to achieve, I have created
          this chat-app. This is anonymus and encrypted chat application, that
          is why you need only your username and password. Anonymus means that
          every message you send will reach database encrypted. What is more,
          for extra security, every user can delete all messages from selected
          conversation and from database at the same time. Please register and
          follow instructions how to use it.
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={close}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
