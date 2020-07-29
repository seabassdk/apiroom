import React, { Fragment, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

import * as actions from '../../store/actions/index';

import './LoginRegister.css';
import bakingImage from '../../assets/images/cafudda.jpg';
import logo from '../../assets/images/logo.png'

const Register = props => {
    const [validated, setValidated] = useState(false);
    const [isregistering, setIsregistering] = useState(true);
    const [userValidation, setUserValidation] = useState({
        spaces: false,
        symbols: false,
        length: false
    });
    const [repeatValidation, setRepeatValidation] = useState(false);
    const [password, setPassword] = useState(null);
    const [repeatPassword, setRepeatPassword] = useState(null);

    const userInput = useRef(null);
    const passwordInput = useRef(null);
    const passwordRepeatInput = useRef(null);
    const secretCodeInput = useRef(null);
    const userForm = useRef(null);

    const handleClose = () => {
        props.showLogin(false);
    };

    const userRegisterHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const username = userInput.current.value;
        const code = secretCodeInput.current.value;

        if (checkUserNameValidation(username) && password === repeatPassword)  {
            setValidated(true);
            props.onAuth(username, password, isregistering, code);
        } else {
            setValidated(false);
            setUserValidation({ ...userValidation, length: true })
        }

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

    //Check if username contains spaces and only alpha numeric characters
    const checkUserNameValidation = (value) => {

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
        if(password && repeatPassword){
            if(password === repeatPassword){
                setRepeatValidation(false);
            } else {
                setRepeatValidation(true);
            }
        }

    }, [password, repeatPassword]);


    return (
        // <div>
        //     This is the landing page.
        // </div>
        // <div class="jumbotron d-flex align-items-center" style={{ backgroundColor: 'white', height: '100vh' }}>
        <div className='container p-5'>
            <div className='row justify-content-center' >
                <div className="col-sm-12 justify-content-center text-center">
                    {/* <img
                        src={logo}
                        width="150"
                        height="30"
                        className="d-inline-block align-top mb-2"
                        alt="Zenroom logo"
                    /> */}
                    {/* <h2 className="title has-text-grey">Apiroom</h2> */}
                    <p className="subtitle has-text-grey">sign up for a new account</p>

                    <div className="box border p-3">
                        <figure className="avatar">
                            <img className={'w-75'} src={bakingImage} />
                        </figure>
                        <Form ref={userForm} validated={validated} onSubmit={userRegisterHandler}>

                            <Form.Group controlId="formBasicEmail">
                                {/* <Form.Label>Email address</Form.Label> */}
                                <Form.Control
                                    name='user'
                                    placeholder="Username"
                                    ref={userInput}
                                    required
                                    onChange={onUserChangeHandler}
                                    isInvalid={userValidation.spaces || userValidation.symbols}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Username can't contain spaces or symbols.
                                    </Form.Control.Feedback>

                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                {/* <Form.Label>Password</Form.Label> */}
                                <Form.Control 
                                    ref={passwordInput} 
                                    type="password" 
                                    placeholder="Password" 
                                    minLength="8" 
                                    required 
                                    onChange={(e)=> setPassword(e.target.value)}
                                    />
                                <Form.Control.Feedback type="invalid">
                                    Please enter password with min 8 characters.
                                    </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formBasicPasswordRepeat">
                                {/* <Form.Label>Password</Form.Label> */}
                                <Form.Control
                                    ref={passwordRepeatInput}
                                    type="password"
                                    placeholder="Repeat Password"
                                    required
                                    isInvalid={repeatValidation}
                                    onChange={(e)=> setRepeatPassword(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Passwords must match.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formBasicSecretPassword">
                                {/* <Form.Label>Password</Form.Label> */}
                                <Form.Control ref={secretCodeInput} type="password" placeholder="Secret Code (ask Andrea)" required />
                                <Form.Control.Feedback type="invalid">
                                    Please enter the secret code.
                                    </Form.Control.Feedback>
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                {props.loading &&
                                    (<Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />)
                                }
                                    Register
                                </Button>
                            {props.error && (
                                <div style={{ color: 'red' }}>{props.error}</div>
                            )}


                        </Form>
                    </div>



                    <p className="subtitle has-text-grey">...or <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => props.isRegistering(false)}>login to your account</span></p>
                </div>

            </div>

        </div>
        // </div>
    )
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,

    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup, code) => dispatch(actions.auth(email, password, isSignup, code)),
        authFail: (error) => dispatch(actions.authFail(error)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);