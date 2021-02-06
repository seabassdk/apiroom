import axios from 'axios';
import * as actionTypes from './actionTypes';
import { loadTypeUri, loadContractsUri } from '../../constants/api';

export const changeContractCollection = (contractCollection) => {
    return {
        type: actionTypes.CONTRACT_COLLECTION,
        contractCollection
    };
}
export const changeZencodeCollection = (zencodeCollection) => {
    return {
        type: actionTypes.ZENCODE_COLLECTION,
        zencodeCollection
    };
}
export const changeKeysCollection = (keysCollection) => {
    return {
        type: actionTypes.KEYS_COLLECTION,
        keysCollection
    };
}
export const changeDataCollection = (dataCollection) => {
    return {
        type: actionTypes.DATA_COLLECTION,
        dataCollection
    };
}
export const changeConfigCollection = (configCollection) => {
    return {
        type: actionTypes.CONFIG_COLLECTION,
        configCollection
    };
}
export const changeResultCollection = (resultCollection) => {
    return {
        type: actionTypes.RESULT_COLLECTION,
        resultCollection
    };
}

export const changeIsLoading = (isLoading) => {
    return {
        type: actionTypes.IS_LOADING,
        isLoading
    };
}

export const changeLoadingError= (loadingError) => {
    return {
        type: actionTypes.LOADING_ERROR,
        loadingError
    };
}

export const loadCollection = (type) => {
    return (dispatch, getState) => {
        dispatch(changeIsLoading(true));
        const { zenroom, auth } = getState();


        //check if auth valid
        if (!auth.username || !auth.token)
            return;

        const uri = loadTypeUri + type;

        axios.post(uri,
            { username: auth.username },
            { headers: { 'auth-token': auth.token } }
        )
            .then(response => {
                switch (type) {
                    case 'zencodes':
                        dispatch(changeZencodeCollection(response.data));
                        dispatch(changeIsLoading(false));
                        break;
                    case 'keys':
                        dispatch(changeKeysCollection(response.data));
                        dispatch(changeIsLoading(false));
                        break;
                    case 'datas':
                        dispatch(changeDataCollection(response.data));
                        dispatch(changeIsLoading(false));
                        break;
                    case 'configs':
                        dispatch(changeConfigCollection(response.data));
                        dispatch(changeIsLoading(false));
                        break;
                    default:
                        console.log('no type found');
                }

            }).catch(error => {
                dispatch(changeIsLoading(false));
                dispatch(changeLoadingError(error.response.data));
            })

    }
};

export const loadContracts = () => {
    return (dispatch, getState) => {
        dispatch(changeIsLoading(true));
        const { zenroom, auth } = getState();

        //check if auth valid
        if (!auth.username || !auth.token)
            return;

        const username = {
            username: auth.username
        };

        axios.post(loadContractsUri,
            username,
            { headers: { 'auth-token': auth.token } }
        )
            .then(response => {
                dispatch(changeIsLoading(false));
                dispatch(changeContractCollection(response.data));

            }).catch(error => {
                dispatch(changeIsLoading(false));
                dispatch(changeLoadingError(error.response.data));
            })

    }
};