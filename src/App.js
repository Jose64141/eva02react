import React, { useState } from "react";
import { Table, Button, Modal, Form, InputGroup } from "react-bootstrap";

function App() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
    <div className="p-3">
    <h1 className="text-center mt-4 mb-4">Formularios</h1>
      <div class="row">
        <div class="col-2">
          <Button variant="primary" onClick={handleShow} className="mb-2">
            Añadir
          </Button>
        </div>
        <div class="col-10">
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Buscar en formularios"
              aria-label="Buscar en formularios"
              aria-describedby="basic-addon2"
            />
            <Button variant="outline-secondary" id="button-addon2">
              Buscar
            </Button>
          </InputGroup>
        </div>
      </div>

      <Table striped bordered hover>
        <thead className="bg-secondary text-white">
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir nuevo formulario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Código</Form.Label>
              <Form.Control type="text" placeholder="Código" />
              <Form.Text className="text-muted">Error código</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Nombre" />
              <Form.Text className="text-muted">Error Nombre</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Descripcción</Form.Label>
              <Form.Control type="text" placeholder="Descripcción" />
              <Form.Text className="text-muted">Error Descripcción</Form.Text>
            </Form.Group>

            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
    
    </>
  );
}

export default App;
