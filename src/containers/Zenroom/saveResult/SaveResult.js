import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

const Save = props => {
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const nameInput = useRef(null);
    const userForm = useRef(null);

    const handleClose = () => {
        props.showSave(false);
    };

    const saveHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
        const name = nameInput.current.value;
        props.saveContract(name);
        setLoading(true);
    }

    useEffect(() => {
        if(props.savedSuccess) {
            props.showSave(false);
            setLoading(false); 
        }
        
        if(props.saveError)
            setLoading(false); 
    }, [props.savedSuccess, props.saveError]);

    return (

        <Modal show={props.show} onHide={handleClose}>
            <Modal.Header closeButton>
                Save Contract
            </Modal.Header>
            <Form ref={userForm} validated={validated} onSubmit={saveHandler}>
                <Modal.Body className={'px-5 pb-1 pt-5'}>


                    {props.zencode
                        ? (<Form.Group controlId="formBasicPassword">
                            {/* <Form.Label>Password</Form.Label> */}
                            <Form.Control ref={nameInput} type="text" placeholder="Name the Contract" minLength="3" required />
                            <Form.Control.Feedback type="invalid">
                                Please enter a name.
                        </Form.Control.Feedback>
                        </Form.Group>)
                        : <h5>You must provide a contract before saving :)</h5>
                    }

                    {props.saveError && (
                        <div style={{ color: 'red' }}>{props.saveError}</div>
                    )}

                </Modal.Body>
                <Modal.Footer className={'px-5 pb-3 pt-0'} style={{ border: 0 }}>
                    {props.zencode &&
                    <Button variant="primary" type="submit">
                        {loading &&
                            (<Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />)
                        }
                        { loading ? 'Saving' : 'Save'}    
                    </Button>}
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                </Button>

                </Modal.Footer>
            </Form>
        </Modal>

    );
}

export default Save;