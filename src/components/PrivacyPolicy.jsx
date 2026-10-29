import { Modal, Button } from "react-bootstrap";

export default function PrivacyPolicy({ show, onHide }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      scrollable
      aria-labelledby="privacy-policy-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="privacy-policy-title">
          Política de Privacidad
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        Aquí va el contenido de la política de privacidad.
      </Modal.Body>

      <Modal.Footer>
        <Button variant="success" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}