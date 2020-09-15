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

import * as actions from './store/actions/index';

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

  if (props.isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/" exact component={Zenroom} />
        {/* <Route path="/" component={LandingPage} /> */}
        <Route path="/profile" component={UserProfile} />
        <Redirect to="/" />
      </Switch>
    );
  }

  useEffect(() => {
    props.onTryAutoSignup();
  }, []);

  return (
    <Fragment>
      <div className={'container-fluid p-0 m-0 main-construction-container mb-5'} >
        <div className='d-flex align-items-center justify-content-center mb-5'>
          <img
            src={require('./assets/images/logo.png')}
            width="150"
            height="30"
            className='mt-5'
            alt="Zenroom logo"
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
            <FontAwesomeIcon icon={faTools} size='6x' color='#ab0060'/>
          </div>
        </div>

      </div>


      <div className={'container-fluid p-0 m-0 main-zen-container'} >
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
