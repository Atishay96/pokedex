import { VisibilityFilters } from '../actions/login';

const { LOGIN_SUCCESS, LOGIN_FAILED } = VisibilityFilters;

const initialState = {
    signIn: {
        success: '',
        error: ''
    }
}

export const login = ( state = initialState, action ) => {
    switch(action.type){
        case LOGIN_SUCCESS:
            console.log(action);
            return {...state, signIn : { error: '', success: action.message }};
        case LOGIN_FAILED:
            return {...state, signIn : { success: '', error: action.message }};
        default:
            return state;
    }
}