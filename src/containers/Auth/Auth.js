import React, { Fragment, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

import Login from './Login';
import Register from './Register';
import * as actions from '../../store/actions/index';

const Auth = props => {
    const [validated, setValidated] = useState(false);
    const [isregistering, setIsregistering] = useState(false);
    const [userValidation, setUserValidation] = useState({
        spaces: false,
        symbols: false,
        length: false
    });

    const userInput = useRef(null);
    const passwordInput = useRef(null);
    const userForm = useRef(null);

    const handleClose = () => {
        props.showLogin(false);
    };

    const userLoginHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const username = userInput.current.value;
        const password = passwordInput.current.value;

        if (username.length > 4 && checkUserNameValidation(username)) {
            setValidated(true);
            props.onAuth(username, password, isregistering);
        } else {
            setValidated(false);
            setUserValidation({ ...userValidation, length: true })
        }
        // props.auth(email, password, isregistering);
    }

    const isRegisteringHandler = () => {
        setIsregistering(!isregistering);
    }

    const onUserChangeHandler = (e) => {
        const input = {
            name: e.target.name,
            value: e.target.value,
        }
        const valid = checkUserNameValidation(input.value);

    }

    const checkUserNameValidation = (value) => {
        //Check if username contains spaces
        if (/\s/.test(value)) {
            setUserValidation({ ...userValidation, spaces: true })
            return false;
        }
        else if (/^[0-9a-zA-Z]+$/.test(value) !== true) {
            setUserValidation({ ...userValidation, symbols: true })
            return false;
        } else {
            setUserValidation({ spaces: false, symbols: false })
            return true;
        }
    }

    // let authRedirect = null;
    // if (this.props.isAuthenticated) {
    //     authRedirect = <Redirect to={this.props.authRedirectPath}/>
    // }

    useEffect(() => {
        if (props.isAuthenticated && !props.loading && !props.error) {
            handleClose();
        }
        if (props.error) {
            setValidated(false);
        }
    }, [props.isAuthenticated, props.loading, props.error]);

    useEffect(() => {
        props.authFail(null);
    }, [])

    return (

        <Modal show={props.show} onHide={handleClose}>
            {/* <Modal.Header closeButton>
                {isregistering
                    ? (<Modal.Title className={'ml-5'}>Register</Modal.Title>)
                    : (<Modal.Title className={'ml-5'}>Sign in</Modal.Title>)}
            </Modal.Header> */}

            {/* <Modal.Body className={''}> */}

            {isregistering
            ? <Register isRegistering={isRegisteringHandler}/>
            : <Login isRegistering={isRegisteringHandler}/>
            }

            {/* </Modal.Body> */}
            {/* <Modal.Footer className={'px-5 pb-3 pt-0'} style={{ border: 0 }}>
                <Button variant="secondary" onClick={isRegisteringHandler}>
                    {isregistering
                        ? 'Login Instead'
                        : 'Register Instead'}
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>

            </Modal.Footer> */}
        </Modal>

    );
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,

    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        authFail: (error) => dispatch(actions.authFail(error)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);


// auth = { props.onAuth }
// isAuthenticated = { props.isAuthenticated }
// loading = { props.loading }
// error = { props.error } 