import { Modal, Button } from "react-bootstrap";
import "./InfoModal.css";
export default function InfoModal({ show, close }) {
  return (
    <div>
      <Modal centered show={show} onHide={close}>
        <Modal.Header>
          <h4>Info</h4>
        </Modal.Header>
        <Modal.Body className="info-modal-description">
          <p>
            This is anonymus and encrypted chat application, that is why you
            need only your username and password. Anonymus means that every
            message you send will reach database encrypted. What is more, for
            extra security, every user can delete all messages from selected
            conversation and from database at the same time.
          </p>
          <h4>How to use it?</h4>
          <p>
            After registration, login window will appear. You must know your
            friend's ID to start conversation, ID can be found at the top of the
            page. After you find your friend, it will be added to conversations
            section. Press "Open Conversations" and start chatting.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={close}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
