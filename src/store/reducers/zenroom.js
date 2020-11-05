import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    name: '',
    zencode: '',
    keys: '',
    data: '',
    result: '',
    config: '',
    error: '',
    logs: '',
    execute: false,
    savedSuccess: false,
    savedFail: false,
    userLoaded: false,
    userContracts: null,
    selectedIndex: null,
    dockerExport: false
};

const changeDockerExport = ( state, action ) => {
    const updatedDockerExport = {dockerExport: action.dockerExport}
    return updateObject( state, updatedDockerExport );
};

const changeUserLoaded = ( state, action ) => {
    const updatedUserLoaded = {userLoaded: action.userLoaded}
    return updateObject( state, updatedUserLoaded );
};

const changeZencode = ( state, action ) => {
    const updatedZencode = {zencode: action.zencode}
    return updateObject( state, updatedZencode );
};

const changeKeys = ( state, action ) => {
    const updatedKeys = {keys: action.keys}
    return updateObject( state, updatedKeys );
};

const changeData = ( state, action ) => {
    const updatedData = {data: action.data}
    return updateObject( state, updatedData );
};

const changeConfig = ( state, action ) => {
    const updatedConfig = {config: action.config}
    return updateObject( state, updatedConfig );
};

const changeResult = ( state, action ) => {
    const updatedResult = {result: action.result}
    return updateObject( state, updatedResult );
};

const changeLogs = ( state, action ) => {
    const updatedLogs = {logs: action.logs}
    return updateObject( state, updatedLogs );
};

const changeExecute = ( state, action ) => {
    const updatedExecute = {execute: action.execute}
    return updateObject( state, updatedExecute );
};

const changeError = ( state, action ) => {
    const updatedError = {error: action.error}
    return updateObject( state, updatedError );
};

const changeSavingSuccess = ( state, action ) => {
    const updatedSavingSuccess = {savedSuccess: action.savedSuccess}
    return updateObject( state, updatedSavingSuccess );
};

const changeSavingFail = ( state, action ) => {
    const updatedSavingFail = {savedFail: action.savedFail}
    return updateObject( state, updatedSavingFail );
};

const changeUserContracts = ( state, action ) => {
    const updatedUserContracts = {userContracts: action.userContracts}
    return updateObject( state, updatedUserContracts );
};

const changeSelectedIndex= ( state, action ) => {
    const updatedSelectedIndex= {selectedIndex: action.selectedIndex}
    return updateObject( state, updatedSelectedIndex );
};

const changeContract = ( state, action ) => {
    const updateContract = {
        name: action.name,
        zencode: action.zencode,
        keys: action.keys,
        data: action.data,
        config: action.config
    }
    return updateObject( state, updateContract );
};


const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.ZENCODE: return changeZencode( state, action );
        case actionTypes.KEYS: return changeKeys( state, action );
        case actionTypes.DATA: return changeData( state, action );
        case actionTypes.CONFIG: return changeConfig( state, action );
        case actionTypes.RESULT: return changeResult( state, action );
        case actionTypes.LOGS: return changeLogs( state, action );
        case actionTypes.EXECUTE: return changeExecute( state, action );
        case actionTypes.ERROR: return changeError( state, action );
        case actionTypes.SAVING_SUCCESS: return changeSavingSuccess( state, action );
        case actionTypes.SAVING_FAIL: return changeSavingFail( state, action );
        case actionTypes.USER_CONTRACTS: return changeUserContracts( state, action );
        case actionTypes.CONTRACT: return changeContract( state, action ); 
        case actionTypes.USER_LOADED: return changeUserLoaded( state, action ); 
        case actionTypes.SELECTED_INDEX: return changeSelectedIndex( state, action );
        case actionTypes.DOCKER_EXPORT: return changeDockerExport( state, action );
        
        
        
        default: return state;
    }
};

export default reducer;



// const removeIngredient = (state, action) => {
//     const updatedIng = { [action.ingredientName]: state.ingredients[action.ingredientName] - 1 }
//     const updatedIngs = updateObject( state.ingredients, updatedIng );
//     const updatedSt = {
//         ingredients: updatedIngs,
//         totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
//         building: true
//     }
//     return updateObject( state, updatedSt );
// };

// const setIngredients = (state, action) => {
//     return updateObject( state, {
//         ingredients: {
//             salad: action.ingredients.salad,
//             bacon: action.ingredients.bacon,
//             cheese: action.ingredients.cheese,
//             meat: action.ingredients.meat
//         },
//         totalPrice: 4,
//         error: false,
//         building: false
//     } );
// };

// const fetchIngredientsFailed = (state, action) => {
//     return updateObject( state, { error: true } );
// };