import React, { useState, useEffect, Fragment } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTools } from '@fortawesome/free-solid-svg-icons'

import './App.css';


import NavigationBar from './components/navigation/NavigationBar';
import Login from './containers/Auth/Auth';
import Save from './containers/save/Save';
import Zenroom from './containers/Zenroom/Zenroom';
import UserProfile from './containers/UserProfile/UserProfile';
import Footer from './containers/footer/Footer';
import Disclaimer from './components/disclaimer/Disclaimer';

import * as actions from './store/actions/index';

import exampleContracts from './examples/zencodeExamples.json';

const App = props => {

  const [showLogin, setShowLogin] = useState(false);
  const [showSave, setShowSave] = useState(false);

  const showLoginHandler = (show) => {
    setShowLogin(show);
  }

  const showSaveHandler = (show) => {
    props.resetSavingSuccess();
    props.resetSavingFailure();
    setShowSave(show);
  }

  let routes = (
    <Switch>
      <Route path="/" exact component={Zenroom} />
      <Redirect to="/" />
    </Switch>
  );

  const token = localStorage.getItem('token');
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact component={Zenroom} />
        {/* <Route path="/" component={LandingPage} /> */}
        <Route path="/profile" component={UserProfile} />
        <Redirect to="/" />
      </Switch>
    );
  }

  const onLoadExampleContract = (index) => {
    //load zencode
    if (exampleContracts[index].zencode) {
      props.onZencodeChanged(exampleContracts[index].zencode)
    } else {
      props.onZencodeChanged('');
    }

    //load keys
    if (exampleContracts[index].keys) {
      props.onKeysChanged(JSON.stringify(exampleContracts[index].keys));
    } else {
      props.onKeysChanged('');
    }
    // load data
    if (exampleContracts[index].data) {
      props.onDataChanged(JSON.stringify(exampleContracts[index].data));
    } else {
      props.onDataChanged('')
    }
    // load config
    if (exampleContracts[index].config) {
      props.onConfigChanged(JSON.stringify(exampleContracts[index].config));
    } else {
      props.onConfigChanged('')
    }
  }

  useEffect(() => {
    props.onTryAutoSignup();
  }, []);

  return (
    <Fragment>

      {localStorage.getItem('disclaimer') !== 'accepted' &&
        <Disclaimer />
      }
      <div className={'container-fluid p-0 m-0 main-construction-container mb-5 d-block d-sm-block d-md-none'} >
        <div className='d-flex align-items-center justify-content-center mb-5'>
          <img
            src={require('./assets/images/logo.png')}
            width="150"
            height="35"
            className='mt-5'
            alt="Apiroom logo"
          />
        </div>
        <div className='w-100 h-100 pb-5'>
          <div className='w-100 mt-5 pb-5'>
            <div className='d-flex align-items-center justify-content-center'>
              <h6 className='w-70'>
                Please use a BIGGER screen.
            </h6>
            </div>
          </div>
          <div className='w-100'>
            <div className='d-flex align-items-center justify-content-center'>
              <h6 className='w-70'>
                Mobile version under construction.
            </h6>
            </div>
          </div>
          <div className='d-flex align-items-center justify-content-center mt-5'>
            <FontAwesomeIcon icon={faTools} size='6x' color='#ab0060' />
          </div>
        </div>

      </div>


      <div className={'container-fluid p-0 m-0 main-zen-container d-none d-sm-none d-md-block'} >
        <div className="d-flex flex-column" style={{ paddingBottom: '30px' }} >
          <NavigationBar
            showLogin={() => showLoginHandler(true)}
            showSave={() => showSaveHandler(true)}
            isAuthenticated={props.isAuthenticated}
            executeZenroom={props.onExecute}
            route={props.location.pathname}
            logout={props.onLogOut}
            contractName={props.contractName}
            userLoaded={props.userLoaded}
            updateContract={props.onUpdateContract}
            profileLeave={props.onChangeUserLoaded}
            username={props.username}
            contracts={exampleContracts}
            loadContract={onLoadExampleContract}
            dockerExport={() => props.onDockerExport(true)}
          />
          {props.savedSuccess &&
            <Alert variant={'success'} onClose={() => props.onSavedSuccess(false)} dismissible>
              Contract saved successfully.
            </Alert>
          }


          {routes}

        </div>

        {showLogin &&
          <Login
            showLogin={showLoginHandler}
            show={showLogin}
            isAuthenticated={props.isAuthenticated}
          />}

        {showSave &&
          <Save
            showSave={showSaveHandler}
            show={showSave}
          />}

        <Footer />
      </div>
    </Fragment >
  );
}

const mapStateToProps = state => {
  return {
    userLoaded: state.zenroom.userLoaded,
    execute: state.zenroom.execute,
    contractName: state.zenroom.name,
    isAuthenticated: state.auth.token !== null,
    savedSuccess: state.zenroom.savedSuccess,
    username: state.auth.username
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogOut: () => dispatch(actions.logout()),
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
    onExecute: () => dispatch(actions.changeExecute(true)),
    resetSavingSuccess: () => dispatch(actions.changeSavingSuccess(false)),
    resetSavingFailure: () => dispatch(actions.changeSavingFailure(false)),
    onUpdateContract: () => dispatch(actions.updateContract()),
    onChangeIsLoading: (loading) => dispatch(actions.changeIsLoading(loading)),
    onChangeUserLoaded: (profile) => dispatch(actions.changeUserLoaded(profile)),
    onSavedSuccess: (success) => dispatch(actions.changeSavingSuccess(success)),
    onZencodeChanged: (zencode) => dispatch(actions.changeZencode(zencode)),
    onKeysChanged: (keys) => dispatch(actions.changeKeys(keys)),
    onDataChanged: (data) => dispatch(actions.changeData(data)),
    onConfigChanged: (config) => dispatch(actions.changeConfig(config)),
    onDockerExport: (docker) => dispatch(actions.changeDockerExport(docker)),

  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));





// style={{flex: 1, border: '2px solid black'}}


    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload. NEW SAVE. Another save.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
