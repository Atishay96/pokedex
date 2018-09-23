import { setItem } from '../helpers/localStorage';

function loginSuccess(response) {
    // setToken( "token", response.token );
    return { type: 'LOGIN_SUCCESS', message: response.message }
}

function loginFailure(error) {
    return { error: error || 'Login failed', type: 'LOGIN_FAILED', message: error.message }
}
export const login = ( inputs ) => {
    // not integrated with backend later integrate with axios
    return dispatch => {
        if(inputs.email === 'admin@pokedex.com' && inputs.password === '123456'){
            console.log('correct creds');
            // static response
            let response = { message:"Successfully logged in", data: { authToken: '' } };
            setItem('authToken', 'asdasdasd');
            return dispatch( loginSuccess(response) );
        }
        else{
            console.log('wrong creds');
            let error = {message:'Wrong Credentials'};
            return dispatch( loginFailure(error) );
        }
    }
}

// export const addTodo = text => ({
//     type: 'ADD_TODO',
//     id: nextTodoId++,
//     text
//   })

export const VisibilityFilters = {
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILED: 'LOGIN_FAILED' 
}