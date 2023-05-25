import React, {useEffect, useState} from "react";
import { Table, Button, Modal, Form, InputGroup } from "react-bootstrap";
import axios from "axios";
import {useForm} from "react-hook-form";
import {Alert} from "reactstrap";

const url = "http://chatdoc.eastus.cloudapp.azure.com:8000/api/form";

function UpdateModal({show, onHide, onSuccess, modalObject}){

  const {register
      ,handleSubmit
    , formState: {errors, isValid}
    , setError
    , reset} = useForm({defaultValues:{...modalObject}});

  const [alertError, setAlertError] = useState("");
  const handleError = (err) =>
  {
    console.log(err);
    if(err.response)
    {
      console.log("a")
      if(err.response.status === 422){
        console.log("b")
        setError("code", err.response.data.message)
        setAlertError(err.response.data.message)
      }
      else
        setAlertError("Error indeterminado");
    }
    else {
      setAlertError("Error de conexión con servidor.")
    }
  }
  console.log(modalObject);
  const handleAdd = (data) => {
    const form = {...data};
    reset();
    axios.post(url,data)
        .then(()=>{
          setAlertError("")
          onSuccess(form);
          onHide();
        })
        .catch(err => handleError(err))
  }

  const handleUpdate = (data) => {
    const form = {...data};
    reset();
    axios.put(`${url}/${modalObject.id}`,data)
        .then(()=>{
          setAlertError("")
          onSuccess(form);
          onHide();
        })
        .catch(err => handleError(err))
  }

  return (
      <Modal show={show} onHide={onHide} onSubmit={handleSubmit(modalObject? handleAdd : handleUpdate)}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir nuevo formulario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alertError !== "" && <Alert variant="danger"> {alertError} </Alert>}
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Código</Form.Label>
              <Form.Control type="text" placeholder="Código" defaultValue={modalObject?.code}
                            {...register("code", {required: "Campo Obligatorio"})}/>
              {errors.code && <Form.Text className="text-muted">{errors.code?.message}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Nombre" defaultValue={modalObject?.name}
                            {...register("name", {required: "Campo Obligatorio"})}/>
              {errors.name && <Form.Text className="text-muted">{errors.name?.message}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Descripcción</Form.Label>
              <Form.Control type="text" placeholder="Descripcción" defaultValue={modalObject?.description}
                            {...register("description", {required: "Campo Obligatorio"})}/>
              {errors.description && <Form.Text className="text-muted">{errors.description?.message}</Form.Text>}
            </Form.Group>

            <Button variant="secondary" onClick={() => {reset(); onHide();}}>
              Cerrar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
  );
}

function TableBody({elementsList, onUpdate, onDelete}){
  const handleUpdate = (element)=>{onUpdate(element)};
  const handleDelete = (element)=>{onDelete(element)};
  return(
      <tbody>
      {elementsList.map((element) => {
        return(
        <tr key={element.id}>
          <td>{element.code}</td>
          <td>{element.name}</td>
          <td>{element.description}</td>
          <td>
            <Button onClick={() => {onDelete(element)}}>Borrar</Button>
            <Button onClick={() => {onUpdate(element)}}>Cambiar</Button>
          </td>
        </tr>
        )
      })}
      </tbody>
  )
}
function App() {
  const [alertError, setAlertError] = useState("");

  const [show, setShow] = useState(false);
  const [modalObject, setModalObject] = useState({});

  const [objectList, setObjectList] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [useSearchList, setUseSearchList] = useState(false)

  useEffect( () => {axios.get(url).then((response) => setObjectList(response.data))},{});
  const handleClose = () => setShow(false);
  const handleShow = (element = {}) => {
    setShow(true);
    console.log(element);
    setModalObject(element);
  }

  const handleModalUpdate = (item) =>
  {
    console.log(objectList.find(form => form.id === item.id));
    if(objectList.find(form => form.id === item.id) >= 0)
    {
      setObjectList(objectList.map((form) => {
        if(form.id === item.id)
          return{...item};
        else
          return form;
      }));
    }
    else
      setObjectList([item, ...objectList]);
    handleSearch();
  }
  const handleDelete = (item) => {
    axios.delete(`${url}/${item.id}`)
        .then(() => {
          setObjectList(objectList.filter( form => form.id !== item.id ))
          setAlertError("");
        })
        .catch(err => {
          console.log(err)

        })
  }

  const handleSearch = () => {
    console.log(searchTerm)
    console.log(objectList)
    const filteredList = objectList.filter( (item) => {
      console.log(item)
      if (item.code === searchTerm) {
        console.log("aceptado")
        return true;
      }
      else if (item.name === searchTerm )
        return true;
      else if (item.description === searchTerm)
        return true;
      else
        return false;
    } );
    const newList = filteredList;
    console.log(newList)
    setSearchList(newList);
    setUseSearchList(!!searchTerm);
  }

  return (
    <>
    <div className="p-3">
    <h1 className="text-center mt-4 mb-4">Formularios</h1>
      {alertError !== "" && <Alert variant="danger"> {alertError} </Alert>}
      <div class="row">
        <div class="col-2">
          <Button variant="primary" onClick={handleShow} className="mb-2">
            Añadir
          </Button>
        </div>
        <div class="col-10">
          <InputGroup className="mb-3">
            <Form.Control onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar en formularios"
              aria-label="Buscar en formularios"
              aria-describedby="basic-addon2"
            />
            <Button variant="outline-secondary" id="button-addon2" onClick={handleSearch}>
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
        <TableBody elementsList={useSearchList? searchList: objectList}
                   onUpdate={handleShow}
                   onDelete={handleDelete}></TableBody>
      </Table>

      <UpdateModal show={show} onHide={handleClose} onSuccess={handleModalUpdate} modalObject={modalObject}/>
    </div>
    
    </>
  );
}

export default App;
