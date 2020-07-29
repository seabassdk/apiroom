import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    contractCollection: [],
    zencodeCollection: [],
    keysCollection: [],
    dataCollection: [],
    configCollection: [],
    resultCollection: [],
    isLoading: false,
    loadingError: false
};

const changeIsLoading= ( state, action ) => {
    const updatedLoading= {isLoading: action.isLoading}
    return updateObject( state, updatedLoading );
};

const changeLoadingError= ( state, action ) => {
    const updatedLoadingError= {loadingError: action.loadingError}
    return updateObject( state, updatedLoadingError );
};

const changeContractCollection = ( state, action ) => {
    const updatedCollection= {contractCollection: action.contractCollection}
    return updateObject( state, updatedCollection );
};

const changeZencodeCollection = ( state, action ) => {
    const updatedCollection= {zencodeCollection: action.zencodeCollection}
    return updateObject( state, updatedCollection );
};

const changeKeysCollection = ( state, action ) => {
    const updatedCollection= {keysCollection: action.keysCollection}
    return updateObject( state, updatedCollection );
};

const changeDataCollection = ( state, action ) => {
    const updatedCollection= {dataCollection: action.dataCollection}
    return updateObject( state, updatedCollection );
};

const changeConfigCollection = ( state, action ) => {
    const updatedCollection= {configCollection: action.configCollection}
    return updateObject( state, updatedCollection );
};

const changeResultCollection = ( state, action ) => {
    const updatedCollection= {resultCollection: action.resultCollection}
    return updateObject( state, updatedCollection );
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.IS_LOADING: return changeIsLoading( state, action );
        case actionTypes.CONTRACT_COLLECTION: return changeContractCollection( state, action );
        case actionTypes.ZENCODE_COLLECTION: return changeZencodeCollection( state, action );
        case actionTypes.KEYS_COLLECTION: return changeKeysCollection( state, action );
        case actionTypes.DATA_COLLECTION: return changeDataCollection( state, action );
        case actionTypes.CONFIG_COLLECTION: return changeConfigCollection( state, action );
        case actionTypes.RESULT_COLLECTION: return changeResultCollection( state, action );
        case actionTypes.LOADING_ERROR: return changeLoadingError( state, action );

        
        default: return state;
    }
};

export default reducer;