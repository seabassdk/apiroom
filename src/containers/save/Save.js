import React, { Fragment, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

import * as actions from '../../store/actions/index';

const Save = props => {
    const [validated, setValidated] = useState(false);
    const [isInvalid, setIsInvalid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formatError, setFormatError] = useState(null);
    const [isSaveContract, setIsSaveContract] = useState(true);
    const [typeCheck, setTypeCheck] = useState({
        zencode: true,
        keys: true,
        data: true,
        config: true,
        result: true
    });
    const contractNameInput = useRef(null);
    const zencodeNameInput = useRef(null);
    const keysNameInput = useRef(null);
    const dataNameInput = useRef(null);
    const configNameInput = useRef(null);
    const resultNameInput = useRef(null);
    const userForm = useRef(null);
    const radioSave = useRef(null);

    const handleClose = () => {
        props.showSave(false);
    };

    const checkAlaphaNumeric = (value) => {

        // const test = (/^[0-9a-zA-Z]+$/.test(value));
        const test = (/^[0-9A-Za-z_-\s]+$/.test(value));
        return test;
    }

    const saveHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();

        try {
            let valid = true;
            const typesToSave = [];
            if (isSaveContract) {
                const name = contractNameInput.current.value;

                valid = checkAlaphaNumeric(name);
                if (valid) {
                    setFormatError(null);
                    setLoading(true);
                    props.saveContract(name);

                } else {
                    setFormatError('Please use only letters and numbers for name.');
                }


            } else {
                if (typeCheck.zencode && props.zencode) {
                    typesToSave.push({
                        name: zencodeNameInput.current.value,
                        content: props.zencode,
                        type: 'zencode'
                    })
                }

                if (typeCheck.keys && props.keys) {
                    typesToSave.push({
                        name: keysNameInput.current.value,
                        content: JSON.parse(props.keys),
                        type: 'keys'
                    })
                }

                if (typeCheck.data && props.data) {
                    typesToSave.push({
                        name: dataNameInput.current.value,
                        content: JSON.parse(props.data),
                        type: 'data'
                    })
                }

                if (typeCheck.config && props.config) {
                    typesToSave.push({
                        name: configNameInput.current.value,
                        content: JSON.parse(props.config),
                        type: 'config'
                    })
                }

                if (typeCheck.result && props.result) {
                    typesToSave.push({
                        name: resultNameInput.current.value,
                        content: JSON.parse(props.result),
                        type: 'result'
                    })
                }

                typesToSave.forEach((value) => {
                    if (checkAlaphaNumeric(value.name) === false) {
                        valid = false;
                    }
                });

                if (valid) {
                    setFormatError(null);
                    setLoading(true);
                    props.saveAllTypes(typesToSave);
                } else {
                    setFormatError('Please use only letters and numbers for name.');
                }



            }
        } catch (error) {
            console.log('Cannot save Format error');
            console.log(error);
            setFormatError('Please check json formats are correct.');
        }




    }

    useEffect(() => {
        if (props.savedSuccess) {
            props.showSave(false);
            setLoading(false);
        }

        if (props.saveError)
            setLoading(false);
    }, [props.savedSuccess, props.saveError]);


    return (

        <Modal show={props.show} onHide={handleClose}>
            <Modal.Header closeButton>
                Save
            </Modal.Header>
            <Form ref={userForm} validated={validated} onSubmit={saveHandler}>
                <Modal.Body className={'px-5 pb-1'}>
                    <Form.Check
                        checked={isSaveContract ? true : false}
                        onChange={() => setIsSaveContract(!isSaveContract)}
                        name="groupOptions" label="Save Everything"
                        type='radio' />
                    <Form.Check
                        className={'mb-4'}
                        checked={!isSaveContract ? true : false}
                        onChange={() => setIsSaveContract(!isSaveContract)}
                        name="groupOptions"
                        label="Choose fields to save"
                        type='radio' />

                    {isSaveContract
                        ?
                        <Fragment>
                            {props.zencode
                                ? (<Form.Group controlId="formBasicPassword">
                                    {/* <Form.Label>Password</Form.Label> */}
                                    <Form.Control ref={contractNameInput} type="text" placeholder="Name the Contract" minLength="3" required />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a name.
                                    </Form.Control.Feedback>
                                </Form.Group>)
                                : <h5>You must provide zencode before saving :)</h5>
                            }
                        </Fragment>
                        :
                        <Fragment>
                            {props.zencode || props.data || props.keys || props.config
                                ? <Fragment>
                                    {props.zencode &&
                                        <div className={'row mb-1'}>
                                            <div className={'col-sm-3 pt-1'}>
                                                <Form.Check
                                                    inline
                                                    label="zencode"
                                                    type='checkbox'
                                                    checked={typeCheck.zencode}
                                                    onChange={() => setTypeCheck({ ...typeCheck, zencode: !typeCheck.zencode })} />
                                            </div>
                                            <div className={'col-sm-5'}>
                                                <Form.Control ref={zencodeNameInput} size="sm" type="text" placeholder="name" minLength="3" required disabled={typeCheck.zencode ? false : true} />
                                            </div>
                                            <div className={'col-sm-4'}></div>
                                        </div>
                                    }
                                    {props.keys &&
                                        <div className={'row mb-1'}>
                                            <div className={'col-sm-3 pt-1'}>
                                                <Form.Check
                                                    inline label="keys"
                                                    type='checkbox'
                                                    checked={typeCheck.keys}
                                                    onChange={() => setTypeCheck({ ...typeCheck, keys: !typeCheck.keys })} />
                                            </div>
                                            <div className={'col-sm-5'}>
                                                <Form.Control ref={keysNameInput} size="sm" type="text" placeholder="name" minLength="3" required disabled={typeCheck.keys ? false : true} />
                                            </div>
                                            <div className={'col-sm-4'}></div>
                                        </div>
                                    }
                                    {props.data &&
                                        <div className={'row mb-1'}>
                                            <div className={'col-sm-3 pt-1'}>
                                                <Form.Check
                                                    inline
                                                    label="data"
                                                    type='checkbox'
                                                    checked={typeCheck.data}
                                                    onChange={() => setTypeCheck({ ...typeCheck, data: !typeCheck.data })} />
                                            </div>
                                            <div className={'col-sm-5'}>
                                                <Form.Control ref={dataNameInput} size="sm" type="text" placeholder="name" minLength="3" required disabled={typeCheck.data ? false : true} />
                                            </div>
                                            <div className={'col-sm-4'}></div>
                                        </div>
                                    }
                                    {props.config &&
                                        <div className={'row mb-3'}>
                                            <div className={'col-sm-3 pt-1'}>
                                                <Form.Check
                                                    inline
                                                    label="config"
                                                    type='checkbox'
                                                    checked={typeCheck.config}
                                                    onChange={() => setTypeCheck({ ...typeCheck, config: !typeCheck.config })} />
                                            </div>
                                            <div className={'col-sm-5'}>
                                                <Form.Control ref={configNameInput} size="sm" type="text" placeholder="name" minLength="3" required disabled={typeCheck.config ? false : true} />
                                            </div>
                                            <div className={'col-sm-4'}></div>
                                        </div>
                                    }
                                    {props.result &&
                                        <div className={'row mb-3'}>
                                            <div className={'col-sm-3 pt-1'}>
                                                <Form.Check
                                                    inline
                                                    label="result"
                                                    type='checkbox'
                                                    checked={typeCheck.result}
                                                    onChange={() => setTypeCheck({ ...typeCheck, result: !typeCheck.result })} />
                                            </div>
                                            <div className={'col-sm-5'}>
                                                <Form.Control ref={resultNameInput} size="sm" type="text" placeholder="name" minLength="3" required disabled={typeCheck.result ? false : true} />
                                            </div>
                                            <div className={'col-sm-4'}></div>
                                        </div>
                                    }

                                </Fragment>

                                : <h5>You must provide some data to save :)</h5>
                            }
                        </Fragment>
                    }
                    {(props.saveError || formatError) && (
                        <Fragment>
                            <div style={{ color: 'red' }}>{props.saveError}</div>
                            <div style={{ color: 'red' }}>{formatError}</div>
                        </Fragment>
                    )}

                </Modal.Body>
                <Modal.Footer className={'px-5 pb-3 pt-0'} style={{ border: 0 }}>
                    {((isSaveContract && props.zencode) || (!isSaveContract && (props.zencode || props.data || props.keys || props.config || props.result))) &&
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
                            {loading ? 'Saving' : 'Save'}
                        </Button>}
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                </Button>

                </Modal.Footer>
            </Form>
        </Modal>

    );
}


const mapStateToProps = state => {
    return {
        zencode: state.zenroom.zencode,
        keys: state.zenroom.keys,
        data: state.zenroom.data,
        config: state.zenroom.config,
        result: state.zenroom.result,
        savedSuccess: state.zenroom.savedSuccess,
        saveError: state.zenroom.savedFail
    };
}

const mapDispatchToProps = dispatch => {
    return {
        saveContract: name => dispatch(actions.saveContract(name)),
        saveAllTypes: types => dispatch(actions.saveAllTypes(types))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Save);