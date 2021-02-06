import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as actions from './index';
import { loadContractsUri, saveContractUri, saveTypeUri, updateContractUri, updateContractByindexUri, deleteContractByIndexUri, switchContractByIndexUri, getDockerFileUri } from '../../constants/api';

export const changeZencode = (zencode) => {
    return {
        type: actionTypes.ZENCODE,
        zencode
    };
}

export const changeKeys = (keys) => {
    let keyjson = keys;
    if (keys && typeof keys === "object")
        keyjson = JSON.stringify(keys);

    return {
        type: actionTypes.KEYS,
        keys: keyjson
    };
}

export const changeData = (data) => {
    let datajson = data;
    if (data && typeof data === "object")
        datajson = JSON.stringify(data);

    return {
        type: actionTypes.DATA,
        data: datajson
    };
}

export const changeConfig = (config) => {
    let configjson = config;
    if (config && typeof config === "object")
        configjson = JSON.stringify(config);

    return {
        type: actionTypes.CONFIG,
        config: configjson
    };
}

export const changeExecute = (execute) => {
    return {
        type: actionTypes.EXECUTE,
        execute
    };
}

export const changeResult = (result) => {
    return {
        type: actionTypes.RESULT,
        result
    };
}

export const changeLogs = (logs) => {
    return {
        type: actionTypes.LOGS,
        logs
    };
}

export const changeError = (error) => {
    return {
        type: actionTypes.RESULT,
        error
    };
}

export const changeSavingSuccess = (savedSuccess) => {
    return {
        type: actionTypes.SAVING_SUCCESS,
        savedSuccess
    }
}

export const changeSavingFailure = (savedFail) => {
    return {
        type: actionTypes.SAVING_FAIL,
        savedFail
    }
}

export const changeUserContracts = (userContracts) => {
    return {
        type: actionTypes.USER_CONTRACTS,
        userContracts
    }
}

export const changeSelectedIndex = (selectedIndex) => {
    return {
        type: actionTypes.SELECTED_INDEX,
        selectedIndex
    }
}

export const changeContract = (contract) => {
    return {
        type: actionTypes.CONTRACT,
        name: contract.name,
        zencode: contract.zencode,
        keys: contract.keys,
        data: contract.data,
        config: contract.config
    }
}

export const changeUserLoaded = (userLoaded) => {
    return {
        type: actionTypes.USER_LOADED,
        userLoaded
    }
}

export const changeDockerExport = (dockerExport) => {
    return {
        type: actionTypes.DOCKER_EXPORT,
        dockerExport
    }
}


export const saveContract = (name) => {
    return (dispatch, getState) => {
        const { zenroom, auth } = getState();

        //check if auth valid
        if (!auth.username || !auth.token)
            return dispatch(changeSavingFailure('You must be logged in to save.'));

        //check that there is at least one field to save
        if (!zenroom.zencode && !zenroom.keys && !zenroom.data && !zenroom.config)
            return dispatch(changeSavingFailure('There is no content to save.'));

        const contract = {
            name,
            zencode: zenroom.zencode,
            keys: zenroom.keys,
            data: zenroom.data,
            config: zenroom.config,
            username: auth.username
        };
        axios.post(saveContractUri,
            contract,
            { headers: { 'auth-token': auth.token } }
        )
            .then(response => {
                dispatch(changeSavingSuccess(true));
            })
            .catch(error => {
                console.log('Saving error:');
                console.log(error);
                dispatch(changeSavingFailure(error.response.data));
            })
    }
};

const saveType = (type, name, content, username, token) => {

    return new Promise((resolve, reject) => {
        //check if auth valid
        const newItem = {
            name,
            username,
            content
        };

        const uri = saveTypeUri + type;

        axios.post(uri,
            newItem,
            { headers: { 'auth-token': token } }
        )
            .then(response => {
                resolve('saved ' + type);
            }).catch(error => {
                console.log('Saving error for: ' + type);
                console.log(error);
                reject(error.response.data);
            })
    });

};

export const saveAllTypes = (types) => {
    return (dispatch, getState) => {
        const { zenroom, auth } = getState();

        if (Array.isArray(types) && !types.length) {
            return dispatch(changeSavingFailure('Select something to save...'));
        }

        //check if auth valid
        if (!auth.username || !auth.token)
            return dispatch(changeSavingFailure('You must be logged in to save.'));


        var promises = [];

        types.forEach(item => {
            promises.push(saveType(item.type, item.name, item.content, auth.username, auth.token));
        });

        Promise.all(promises)
            .then((response) => {
                dispatch(changeSavingSuccess(true));
            })
            .catch((error) => {
                console.log('IN SAVING PROMISE ERROR:');
                console.log(error);
                // handle errors here
                dispatch(changeSavingFailure('Failed to save! reason: ' + error));
            });
    }
};


export const updateContract = (contract) => {

    return (dispatch, getState) => {
        const { zenroom, auth } = getState();
        dispatch(actions.changeSavingSuccess(false));

        //check if auth valid
        if (!auth.username || !auth.token)
            return dispatch(changeSavingFailure('You must be logged in to save.'));

        //check contract
        if (!zenroom.zencode && !zenroom.keys && !zenroom.data && !zenroom.config)
            return dispatch(changeSavingFailure('There is no content to save.'));

        const contract = {
            zencode: zenroom.zencode,
            keys: zenroom.keys,
            data: zenroom.data,
            config: zenroom.config
        };

        const payload = {
            contract,
            username: auth.username
        }

        const uri = updateContractUri + zenroom.selectedIndex;

        axios.post(uri,
            payload,
            { headers: { 'auth-token': auth.token } }
        )
            .then(response => {
                dispatch(actions.changeSavingSuccess(true));
            }).catch(err => {
                console.log('Saving error:');
                console.log(err);
                // dispatch(changeSavingFailure('Failed to save! reason: ' + err));
            })

    }

};

export const updateContractByIndex = (contract, index) => {

    return (dispatch, getState) => {
        dispatch(actions.changeIsLoading(true));

        const { zenroom, auth, collections } = getState();

        //check if auth valid
        if (!auth.username || !auth.token)
            return dispatch(changeSavingFailure('You must be logged in to save.'));

        //check contract
        if (!contract)
            return dispatch(changeSavingFailure('There is no content to save.'));


        const payload = {
            contract,
            username: auth.username
        }

        const uri = updateContractByindexUri + index;

        axios.post(uri,
            payload,
            { headers: { 'auth-token': auth.token } }
        )
            .then(response => {
                const contractCollection = collections.contractCollection;
                contractCollection[index] = response.data;
                dispatch(actions.changeIsLoading(false));
                dispatch(actions.changeContractCollection(contractCollection));
            }).catch(error => {
                console.log('Loading error:');
                console.log(error);
                dispatch(actions.changeIsLoading(false));
                dispatch(actions.changeLoadingError(error.response.data));
            })

    }

};

export const deleteContractByIndex = (index) => {

    return (dispatch, getState) => {
        dispatch(actions.changeIsLoading(true));

        const { auth, collections } = getState();

        //check if auth valid
        if (!auth.username || !auth.token)
            return dispatch(actions.changeLoadingError('You must be logged in to save.'));

        const payload = {
            user: {
                username: auth.username
            }
        }

        const uri = deleteContractByIndexUri + index;
        const headers = {
            'auth-token': auth.token
        }
        const data = {
            username: auth.username
        }


        axios.delete(uri, { headers, data })
            .then(response => {

                const contracCollection = collections.contractCollection.filter((element, i) => index !== i);

                dispatch(actions.changeIsLoading(false));
                dispatch(actions.changeContractCollection(contracCollection));

            }).catch(error => {
                console.log('Loading error:');
                console.log(error);
                dispatch(actions.changeIsLoading(false));
                dispatch(actions.changeLoadingError(error.response.data));
            })

    }

};

export const switchContractByIndex = (index) => {

    return (dispatch, getState) => {
        // dispatch(actions.changeIsLoading(true));

        const { auth, collections } = getState();

        //check if auth valid
        if (!auth.username || !auth.token)
            return dispatch(actions.changeLoadingError('You must be logged in to save.'));

        const payload = {
            username: auth.username
        }

        const uri = switchContractByIndexUri + index;
        axios.post(uri,
            payload,
            { headers: { 'auth-token': auth.token } }
        )
            .then(response => {
                const contracCollection = collections.contractCollection.map((element, i) => {
                    if (index === i)
                        return { ...element, switch: response.data }
                    return { ...element }
                });

                // dispatch(actions.changeIsLoading(false));
                dispatch(actions.changeContractCollection(contracCollection));

            }).catch(error => {
                console.log('Loading error:');
                console.log(error);
                // dispatch(actions.changeIsLoading(false));
                dispatch(actions.changeLoadingError(error.response.data));
            })

    }

};

export const getDocker = (obj) => {

    return (dispatch, getState) => {
        const { auth } = getState();

        //check if auth valid
        if (!auth.username || !auth.token)
            return dispatch(changeSavingFailure('You must be logged in to save.'));

        //check contracts
        // if (!contracts && !contracts.isArray && contracts.length === 0)
        //     return dispatch(changeSavingFailure('There is no content to save.'));

        const uri = getDockerFileUri;
        const payload = {
            contracts: obj.contracts,
            username: auth.username
        }

        axios.post(uri,
            payload,
            { headers: { 'auth-token': auth.token } }
        )
            .then(response => {
                console.log('received response:');
                console.log(response);

                const element = document.createElement("a");
                const file = new Blob([response.data]);
                element.href = URL.createObjectURL(file);
                element.download = "Dockerfile";
                document.body.appendChild(element);
                element.click();
                element.parentNode.removeChild(element);


            }).catch(err => {
                console.log('Saving error:');
                console.log(err);
                // dispatch(changeSavingFailure('Failed to save! reason: ' + err));
            })

    }

};