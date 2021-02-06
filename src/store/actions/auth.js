import axios from 'axios';
import * as actionTypes from './actionTypes';
import {login, register} from '../../constants/api';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId, username) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        username,
        userId,
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
};

export const auth = (username, password, isSignup, code) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            username,
            password,
            code
        };
        let url = register;

        if (!isSignup) {
            url = login;
        }

        axios.post(url, authData)
            .then(response => {
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('username', response.data.username);
                dispatch(authSuccess(response.data.token, response.data.userId, response.data.username));
                // uncommoment if token should expire
                // dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(error => {
                if(error.response.data){
                    dispatch(authFail(error.response.data));
                } else {
                    dispatch(authFail('A server error occurred.'));
                }
            });
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } else {
            // uncomment to include login expiration
            // const expirationDate = new Date(localStorage.getItem('expirationDate'));
            // if (expirationDate <= new Date()) {
            //     dispatch(logout());
            // } else {
                const userId = localStorage.getItem('userId');
                const username = localStorage.getItem('username');
                console.log('declaring auth success');
                dispatch(authSuccess(token, userId, username));
                // dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
            // }
        }
    };
};