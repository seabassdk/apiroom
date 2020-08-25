import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Button, DropdownButton, Dropdown, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap'
// import Navbar from 'react-bootstrap/Navbar';
// import Button from 'react-bootstrap/Button';
// import DropdownButton from 'react-bootstrap/DropdownButton';
import { withRouter } from 'react-router-dom';
import { linkToSwaggerUri } from '../../constants/api';

import './NavigationBar.css'

const NavigationBar = props => {


    const load = (index) => {
        props.loadContract(index);
    }

    const onLeaveProfileScreen = () => {
        props.profileLeave(false);
        props.history.push('/');
    }

    return (
        <Navbar variant="light" expand="md" style={{ backgroundColor: 'white' }}>
            <div className={'row w-100 m-0 p-0'}>

                <div className={'col-md-8 m-0 p-0 d-flex justify-content-between'}>
                    <div className='d-flex align-items-center'>
                        {props.location.pathname === '/profile' &&
                            (<div className='d-inline'>
                                <a onClick={onLeaveProfileScreen} style={{ cursor: 'pointer' }}>
                                    <img
                                        className={'mr-3'}
                                        src={require('../../assets/images/left.png')}
                                        height="30"
                                        alt="Zenroom logo"
                                    />
                                </a>
                            </div>)
                        }
                        <Navbar.Brand className={'mr-auto'}>
                            <Link to="/">
                                <img
                                    src={require('../../assets/images/logo.png')}
                                    width="150"
                                    height="30"
                                    className="d-inline-block align-top"
                                    alt="Zenroom logo"
                                />
                            </Link>
                        </Navbar.Brand>
                    </div>


                    {/* Zenroom buttons */}
                    <div className={'col-md-4 m-0 p-0 d-flex justify-content-end'}>
                        {/* Example button */}
                        {props.location.pathname === '/' &&
                            <DropdownButton className={'mr-3'} id="dropdown-variants-Secondary" title="Examples" variant='info'>
                                {props.contracts.map((contract, index) => {
                                    return (
                                        <Dropdown.Item key={index} onClick={() => { load(index) }}> {contract.name}</Dropdown.Item>
                                    );
                                })
                                }

                            </DropdownButton>
                        }
                        {/* Play button */}
                        {props.location.pathname === '/' && <Button variant="outline-success" className="" onClick={props.executeZenroom}>Play</Button>}
                    </div>
                </div>
                <div className={'col-md-4 p-0 m-0 d-flex justify-content-end'}>
                    {/* Settings buttons */}
                    {
                        !props.isAuthenticated
                            ? <Button variant="outline-primary" className="mr-sm-2" onClick={props.showLogin}>Login</Button>
                            : props.location.pathname === '/'
                                ? (<div>
                                    {props.userLoaded
                                        ? (
                                            <Fragment>
                                                <Button variant="outline-success" className="mr-sm-2" onClick={props.showSave}>Save As</Button>
                                                <Button variant="outline-success" className="mr-sm-2" onClick={props.updateContract}>Save</Button>
                                                {/* <Link to="/profile"><Button variant="outline-success" className="mr-sm-2" onClick={()=>{}}>Back</Button></Link> */}
                                                <Link to={{
                                                    pathname: '/profile',
                                                    state: { updated: true }
                                                }}>
                                                    <img
                                                        className={'ml-3'}
                                                        src={require('../../assets/images/right.png')}
                                                        height="30"
                                                        alt="Zenroom logo"
                                                    />
                                                </Link>
                                            </Fragment>
                                        )
                                        : (
                                            <Fragment>
                                                <Button variant="outline-success" className="mr-sm-2" onClick={props.showSave}>Save As</Button>
                                                <Link to="/profile">
                                                    <Button variant="outline-success" className="mr-sm-2">My contracts</Button>
                                                </Link>
                                                < OverlayTrigger
                                                    trigger="click"
                                                    key={'bottom'}
                                                    placement={'bottom'}
                                                    overlay={
                                                        <Popover id={'popover-positioned-bottom'}>
                                                            <Popover.Content style={{ padding: 0 }}>
                                                                <div className={'list-group'}>
                                                                    <a style={{ cursor: 'pointer' }} className={'list-group-item list-group-item-action'} onClick={() => props.logout()}><strong>Sign Out</strong></a>
                                                                </div>
                                                            </Popover.Content>
                                                        </Popover>
                                                    }
                                                >
                                                    <img
                                                        style={{ cursor: 'pointer' }}
                                                        src={require('../../assets/images/user.png')}
                                                        width="auto"
                                                        height="40"
                                                        alt="User logo"
                                                    />
                                                </OverlayTrigger>
                                            </Fragment>)
                                    }
                                </div>)
                                : null
                    }

                    {/* DOCKER SWAGGER AND PROFILE BUTTON FOR PROFILE PATH */}
                    {props.location.pathname === '/profile' && (
                        <Fragment>
                            <OverlayTrigger
                                key={'bottom'}
                                placement={'bottom'}
                                overlay={
                                    <Tooltip id="tooltip-bottom">
                                        We will soon be able to export contracts and serve to a <strong>Dockerfile</strong>
                                    </Tooltip>
                                }
                            >
                                <Button variant="outline-success" className="mr-sm-2">Export</Button>
                            </OverlayTrigger>
                            <Button variant="outline-success" className="mr-sm-3" onClick={() => window.open(linkToSwaggerUri + props.username, "_blank")}>Swagger</Button>
                            <OverlayTrigger
                                trigger="click"
                                key={'bottom'}
                                placement={'bottom'}
                                overlay={
                                    <Popover id={'popover-positioned-bottom'}>
                                        <Popover.Content style={{ padding: 0 }}>
                                            <div className={'list-group'}>
                                                <a style={{ cursor: 'pointer' }} className={'list-group-item list-group-item-action'} onClick={() => props.logout()}><strong>Sign Out</strong></a>
                                            </div>
                                        </Popover.Content>
                                    </Popover>
                                }
                            >
                                <img
                                    style={{ cursor: 'pointer' }}
                                    src={require('../../assets/images/user.png')}
                                    width="auto"
                                    height="40"
                                    alt="User logo"
                                />
                            </OverlayTrigger>
                        </Fragment>
                    )}
                </div>
            </div>
        </Navbar >
    );
}

export default withRouter(NavigationBar);