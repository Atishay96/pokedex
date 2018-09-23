import React, { Component } from 'react';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';

import './css/login.css';
import { login } from '../../redux/actions/login';

class adminLogin extends Component{
    constructor( props ) {
        // so that we can use the `this` keyword 
        super();
        // initializing states with empty values
        this.state = {
            inputs: {
                email: '',
                password: ''
            },
            inProcess: false
        }
    }

    componentWillReceiveProps( props ){
        console.log('componentWillRecieveProps');
        console.log(props.status);
        console.log('inProcess is set to false again');
        this.setState({ inProcess: false });
        if( props.status.success ){
            browserHistory.push('/');
        } else if(props.status.error){
            alert(props.status.error);
        }
    }

    // whenever any input field is changed
    fieldChange = (input, type) => {
        const { inputs } = this.state;
        inputs[type] = input;
        this.setState({ inputs });
    }
    logmein = () => {
        const { inputs, inProcess } = this.state;
        const { dispatch } = this.props;
        const conditions = !inputs.email.trim() || !inputs.password.trim();
        if( conditions ){
            return alert('Enter all values');
        }
        if( inProcess ){
            return;
        }
        this.setState({ inProcess : true });
        console.log('inProcess is set to true');
        console.log(inProcess);
        console.log()
        console.log('Everything okay till now -- sending to actions');
        dispatch(login(inputs));
    }
    render() {
        return (
            <div>
                <form action='#'>
                    <label> Email : </label>
                    <input type="text" onChange = { (e) => this.fieldChange(e.target.value, 'email') } placeholder = 'e.g. abc@xyz.com' />
                    <label> Password : </label>
                    <input type="password" onChange = { (e) => this.fieldChange(e.target.value, 'password') } placeholder = '********' />
                    <button type='submit' onClick = { () => this.logmein() }>Log In</button>
                </form>
            </div>
        )
    }
}

//not clear about this
const mapStateToProps = function( state ){
    console.log( 'sending to componentWillRecieveProps' );
    // console.log( state.login.signIn );
    return { status : state.login.signIn }
}

export default connect(mapStateToProps)(adminLogin)

// export default adminLogin;