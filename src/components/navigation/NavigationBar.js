import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Button, DropdownButton, Dropdown, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap'
// import Navbar from 'react-bootstrap/Navbar';
// import Button from 'react-bootstrap/Button';
// import DropdownButton from 'react-bootstrap/DropdownButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle, faUserAlt, faExternalLinkAlt, faPlay } from '@fortawesome/free-solid-svg-icons'
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
            <div className={'row w-100 m-0 mb-2 p-0'}>

                <div className={'col-md-8 m-0 p-0 d-flex justify-content-between align-items-center'}>
                    <div className='d-flex align-items-center'>
                        {/* BACK ARROW */}
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
                        {/* APIROOM LOGO */}
                        <Navbar.Brand >
                            <Link to="/">
                                <img
                                    src={require('../../assets/images/logo.png')}
                                    width="150"
                                    height="35"
                                    className="d-inline-block align-top"
                                    alt="Apiroom logo"
                                />
                            </Link>
                        </Navbar.Brand>

                        {/* ZENROOM LOGO */}
                        {/* <div className={'ml-lg-2 ml-xl-5 mr-5 h-100 d-flex'}>
                            <a onClick={() => window.open('https://zenroom.org', "_blank")} style={{ cursor: 'pointer' }}>
                                <h6 className={'mx-2'} style={{ color: 'black', marginBlockEnd: '0.2em' }}>Powered by</h6>
                                <img
                                    src={require('../../assets/images/zlogo.png')}
                                    // width="150"
                                    height="20"
                                    className="d-inline-block"
                                    alt="Zenroom logo"
                                />
                            </a>
                        </div> */}

                        {/* INTRODUCTION LINK */}
                        {/* <a onClick={() => window.open('https://dev.zenroom.org/#/pages/zencode-intro', "_blank")} className={'ml-lg-2 ml-xl-1'} style={{ cursor: 'pointer' }}>
                            <div className={'h-100 d-flex align-items-center'}>

                                <div className='d-inline-block h-100 flex-column'>
                                    <h6 style={{ color: '#ab0060', margin: 0 }}>Check out our </h6>
                                    <h6 style={{ color: '#ab0060', margin: 0 }}>introduction </h6>
                                </div>
                                <div className='d-inline-block h-100 ml-2'>
                                    <FontAwesomeIcon icon={faExternalLinkAlt} size='lg' color='#ab0060' style={{ fontSize: '25px', cursor: 'pointer' }} />
                                </div>

                            </div>
                        </a> */}
                    </div>

                    {/* EXAMPLE BUTTON */}
                    {props.location.pathname === '/' &&
                        <DropdownButton className={'col m-0 p-0 pl-5 d-flex justify-content-end ml-5 mr-5'} id="dropdown-variants-Secondary" title="Examples" variant='info'>
                            <Fragment>
                                {/* <Dropdown.Item key='title' style={{ color: 'rgb(108, 117, 125)' }}> */}
                                <div style={{ color: 'rgb(108, 117, 125)', padding: '.25rem 1.5rem' }}>
                                    <b>Miscellaneous</b>
                                </div>
                                {/* </Dropdown.Item> */}
                            </Fragment>
                            {props.contracts.map((contract, index) => {
                                return (

                                    <Fragment key={index}>

                                        {
                                            contract.name !== 'separator'

                                                ? <Dropdown.Item key={index} onClick={() => { load(index) }}>
                                                    {contract.name}
                                                </Dropdown.Item>

                                                : <Fragment>
                                                    <hr />
                                                    {/* <Dropdown.Item key={index} onClick={() => { load(index) }} style={{ color: 'rgb(108, 117, 125)' }}>
                                                        <b>{contract.title}</b>
                                                    </Dropdown.Item> */}
                                                    <div style={{ color: 'rgb(108, 117, 125)', padding: '.25rem 1.5rem' }}>
                                                        <b>{contract.title}</b>
                                                    </div>
                                                </Fragment>
                                        }
                                    </Fragment>

                                );
                            })
                            }

                        </DropdownButton>
                    }

                    {/* Zenroom buttons */}
                    {/* < div className={'col m-0 p-0 d-inline-block justify-content-end'} > */}

                        {/* PLAY BUTTON */}
                        {
                            props.location.pathname === '/' &&
                            <Fragment>
                                {/* <DropdownButton className='mr-4' id="dropdown-variants-Secondary" title="Examples" variant='info'>
                                    {props.contracts.map((contract, index) => {
                                        return (
                                            <Dropdown.Item key={index} onClick={() => { load(index) }}> {contract.name}</Dropdown.Item>
                                        );
                                    })
                                    }

                                </DropdownButton> */}


                                {props.isAuthenticated
                                    ? <Button variant="outline-secondary" className="mr-sm-2" onClick={props.showSave}>Create API</Button>
                                    : <Button variant="outline-secondary" className="mr-sm-2" onClick={() => window.alert("You must be logged in to Save")}>Create API</Button>
                                }

                                <Button className="play-button mr-sm-2" variant="info" onClick={props.executeZenroom}>
                                    Play
                                <FontAwesomeIcon icon={faPlay} size='1x' color='white' style={{ fontSize: '12px', marginLeft: '8px', marginBottom: '2px' }} />
                                </Button>
                            </Fragment>
                        }
                    {/* </div> */}
                </div>
                <div className={'col-md-4 p-0 m-0 d-flex justify-content-end align-items-center'}>
                    {/* Settings buttons */}
                    {
                        !props.isAuthenticated
                            ?
                            <Fragment>
                                {/* <Button variant="outline-secondary" className="mr-sm-2" onClick={() => window.alert("You must be logged in to Save")}>Create API</Button> */}
                                <Button variant="outline-secondary" className="mr-sm-2" onClick={props.showLogin}>Login</Button>
                                <a onClick={(e) => window.open('https://dev.zenroom.org/#/pages/apiroom', "_blank")}>
                                    <FontAwesomeIcon icon={faQuestionCircle} size='1x' color='#6c757d' style={{ fontSize: '30px', marginLeft: '15px', cursor: 'pointer' }} />
                                </a>
                            </Fragment>
                            : props.location.pathname === '/'
                                ? (<div>
                                    {props.userLoaded
                                        ? (
                                            <div className='d-flex align-items-center'>
                                                <Button variant="outline-secondary" className="mr-sm-2" onClick={props.showSave}>Save As</Button>
                                                <Button variant="outline-secondary" className="mr-sm-2" onClick={props.updateContract}>Save</Button>
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
                                            </div>
                                        )
                                        : (
                                            <div className='d-flex align-items-center'>
                                                {/* SAVE AS BUTTON */}
                                                {/* <Button variant="outline-secondary" className="mr-sm-2" onClick={props.showSave}>Create API</Button> */}

                                                {/* MY CONTRACTS BUTTON */}
                                                <Link to="/profile">
                                                    <Button variant="outline-secondary">My contracts</Button>
                                                </Link>

                                                {/* PROFILE IMAGE DROPDOWN */}
                                                < OverlayTrigger
                                                    trigger="click"
                                                    key={'bottom'}
                                                    placement={'bottom'}
                                                    overlay={
                                                        <Popover id={'popover-positioned-bottom'}>
                                                            <Popover.Content style={{ padding: 0 }}>
                                                                <div className={'list-group'}>
                                                                    <a style={{ cursor: 'pointer' }} className={'list-group-item list-group-item-action'} onClick={() => props.logout()}><strong>Sign out  as {props.username}</strong></a>
                                                                </div>
                                                            </Popover.Content>
                                                        </Popover>
                                                    }
                                                >
                                                    {/* <img
                                                        style={{ cursor: 'pointer' }}
                                                        src={require('../../assets/images/user.png')}
                                                        width="auto"
                                                        height="40"
                                                        alt="User logo"
                                                    /> */}
                                                    <FontAwesomeIcon icon={faUserAlt} size='1x' color='black' style={{ fontSize: '35px', marginLeft: '15px', cursor: 'pointer' }} />
                                                </OverlayTrigger>

                                                {/* QUESTION MARK IMAGE */}
                                                {/* <div style={{border: '1px solid red', display: "inline-block"}}> */}
                                                <a onClick={(e) => window.open('https://dev.zenroom.org/#/pages/apiroom', "_blank")}>
                                                    <FontAwesomeIcon icon={faQuestionCircle} size='1x' color='#6c757d' style={{ fontSize: '30px', marginLeft: '15px', cursor: 'pointer' }} />
                                                </a>
                                                {/* </div> */}
                                            </div>)
                                    }
                                </div>)
                                : null
                    }

                    {/* DOCKER SWAGGER AND PROFILE BUTTON FOR PROFILE PATH */}
                    {props.location.pathname === '/profile' && (
                        <Fragment>
                            {/* <OverlayTrigger
                                key={'bottom'}
                                placement={'bottom'}
                                overlay={
                                    <Tooltip id="tooltip-bottom">
                                        We will soon be able to export contracts and serve to a <strong>Dockerfile</strong>
                                    </Tooltip>
                                }
                            >
                                <Button variant="outline-secondary" className="mr-sm-2">Export</Button>
                            </OverlayTrigger> */}
                            <Button variant="outline-secondary" className="mr-sm-2" onClick={() => props.dockerExport()}>Export Docker</Button>
                            <Button variant="outline-secondary" className="mr-sm-3" onClick={() => window.open(linkToSwaggerUri + props.username, "_blank")}>Test APIs</Button>
                            <OverlayTrigger
                                trigger="click"
                                key={'bottom'}
                                placement={'bottom'}
                                overlay={
                                    <Popover id={'popover-positioned-bottom'}>
                                        <Popover.Content style={{ padding: 0 }}>
                                            <div className={'list-group'}>
                                                <a style={{ cursor: 'pointer' }} className={'list-group-item list-group-item-action'} onClick={() => props.logout()}><strong>Sign out as {props.username}</strong></a>
                                            </div>
                                        </Popover.Content>
                                    </Popover>
                                }
                            >
                                {/* <img
                                    style={{ cursor: 'pointer' }}
                                    src={require('../../assets/images/user.png')}
                                    width="auto"
                                    height="40"
                                    alt="User logo"
                                /> */}
                                <FontAwesomeIcon icon={faUserAlt} size='1x' color='black' style={{ fontSize: '35px', marginLeft: '15px', cursor: 'pointer' }} />
                            </OverlayTrigger>
                            <a onClick={(e) => window.open('https://dev.zenroom.org/#/pages/apiroom', "_blank")}>
                                <FontAwesomeIcon icon={faQuestionCircle} size='1x' color='#6c757d' style={{ fontSize: '30px', marginLeft: '15px', cursor: 'pointer' }} />
                            </a>
                        </Fragment>
                    )}
                </div>
            </div>
        </Navbar >
    );
}

export default withRouter(NavigationBar);