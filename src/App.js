import React, { useState, useEffect } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';
import './App.css';

import exampleContracts from './examples/zencodeExamplesTwo.json';
import NavigationBar from './components/navigation/NavigationBar';
import Login from './containers/Auth/Auth';
import Save from './containers/save/Save';
import Zenroom from './containers/Zenroom/Zenroom';
import UserProfile from './containers/UserProfile/UserProfile';

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

  const onLoadExampleContract = (index) => {
    //load zencode
    if (exampleContracts[index].zencode) {
      props.onChangeZencode(exampleContracts[index].zencode)
    } else {
      props.onChangeZencode('');
    }

    //load keys
    if (exampleContracts[index].keys) {
      props.onChangeKeys(JSON.stringify(exampleContracts[index].keys));
    } else {
      props.onChangeKeys('');
    }
    // load data
    if (exampleContracts[index].data) {
      props.onChangeData(JSON.stringify(exampleContracts[index].data));
    } else {
      props.onChangeData('')
    }
  }

  useEffect(() => {
    props.onTryAutoSignup();
  }, []);

  return (
    <div className={'container-fluid px-5'} >
      <div className="d-flex flex-column vh-100" style={{ paddingBottom: '30px' }} >
        <NavigationBar
          showLogin={() => showLoginHandler(true)}
          showSave={() => showSaveHandler(true)}
          isAuthenticated={props.isAuthenticated}
          executeZenroom={props.onExecute}
          route={props.location.pathname}
          contracts={exampleContracts}
          loadContract={onLoadExampleContract}
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

    </div>
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
    onChangeZencode: (zencode) => dispatch(actions.changeZencode(zencode)),
    onChangeKeys: (keys) => dispatch(actions.changeKeys(keys)),
    onChangeData: (data) => dispatch(actions.changeData(data)),
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
