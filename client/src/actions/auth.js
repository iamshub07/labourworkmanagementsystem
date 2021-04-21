import axios from 'axios';
import {setAlert} from './alert';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_PROFILE
} from './types';
import setAuthToken from '../utils/setAuthToken';

//LOad User
export const loadUser = () => async dispatch =>{
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }

    try {
        const res = await axios.get('/api/auth');
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        });
    }
}

// Register User
export const register = ({userid, name, email, password,designation})=> async dispatch =>{
   const config = {
       headers: {
           'content-Type': 'application/json'
       }
   } 
   const body = JSON.stringify({userid, name, email, password,designation});

   try{
       const res = await axios.post('/api/user/registeruser',body,config);
       console.log(res);
       dispatch({
           type: REGISTER_SUCCESS,
           payload: res.data
       });
       dispatch(loadUser());
   }catch(err){
    const errors = err.response.data.errors;

    if(errors){
        errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
    }

       dispatch({
           type:REGISTER_FAIL
       });
   }
}

//Login User
export const login = (userid, password)=> async dispatch =>{
    const config = {
        headers: {
            'content-Type': 'application/json'
        }
    } 
    const body = JSON.stringify({ userid, password});

 
    try{
        const res = await axios.post('/api/auth',body,config);
     
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());
    }catch(err){
 
     const errors = err.response.data.errors;
 
     if(errors){
         errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
     }
 
        dispatch({
            type:LOGIN_FAIL
        });
    }
 };

 //Logout & CLEAR PROFILE
export const logout = () => dispatch => {
    dispatch({ type: CLEAR_PROFILE});
    dispatch({ type: LOGOUT});
};