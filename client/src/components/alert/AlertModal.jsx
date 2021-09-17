import { Modal, Button } from "react-bootstrap";

export default function AlertModal({ show, close, deleteMessages, friend }) {
  return (
    <div>
      <Modal className="alert-modal" show={show} onHide={close}>
        <Modal.Header className="alert-modal-header">
          <Modal.Title className="alert-modal-title">
            Delete all messages with "{friend?.username}"?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="alert-modal-body">
          If you select 'Yes' , all your messages with "{friend?.username}" will
          be deleted from chat and from database.
        </Modal.Body>
        <Modal.Footer className="alert-modal-footer">
          <Button variant="danger" onClick={deleteMessages}>
            Yes, delete
          </Button>
          <Button onClick={close}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
