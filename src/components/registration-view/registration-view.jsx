import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { Form, Button, Row, Col, Container } from 'react-bootstrap';

import {connect} from 'react-redux';
import { Link } from 'react-router-dom';

import { setUser, togglePw } from '../../actions/actions';

import './registration-view.scss';

const mapStateToProps = state =>{
  const  { user, tglpw } = state;
  return {user, tglpw};
}

function RegistrationView(props) {
  const { user, tglpw } = props;

  /* handles successful registration*/
  const handleRegister = (e) => {
    e.preventDefault();

    let error = document.querySelector( '.error-message' );
    if ( error ) {
      let container = document.querySelector( '.btn-register' ).parentElement;
      let note = document.createElement( 'div' );
      note.classList.add( 'note-message' );
      note.innerText = `No registration possible due to form errors. \rPlease rectify your inputs.`;
      container.appendChild( note );
      setTimeout( function () { container.removeChild( note ) }, 4000 );
      return false;
    } else {
      axios.post( 'https://quarantinoflix.herokuapp.com/users', {
        Username: user.Username,
        Password: user.Password,
        Email: user.Email,
        Birthday: user.Dob
      } )
        .then( response => {
          const data = response.data;
          console.log( data );
          localStorage.setItem( 'username', data.Username );
          alert( `${data.Username} succesfully registered, please log in to your account!` );
          window.open( '/', '_self' );
        } )
        .catch( e => {
          console.log( 'error registering the user' );
          console.error( e );
        } );
      return true;
    }
  };

  useEffect( () => {
    let usernameInput = document.querySelector( '#formUsername' );
    let passwordInput = document.querySelector( '#formPassword' );
    let emailInput = document.querySelector( '#formEmail' );
    let dobInput = document.querySelector( '#formBirth' );

    function validateUsername() {
      let value = usernameInput.value;
      let reg = /\w{5,}/;
      if ( !value ) {
        showErrorMessage( usernameInput, 'Username is required.' );
        return false;
      }
      if ( !reg.test( value ) ) {
        showErrorMessage( usernameInput, 'Username must contain at least 5 alphanumeric characters.' );
        return false;
      }
      showErrorMessage( usernameInput, null );
      return true;
    }
    function validatePassword() {
      let value = passwordInput.value;
      if ( !value ) {
        showErrorMessage( passwordInput, 'Please provide your password.' );
        return false;
      }
      showErrorMessage( passwordInput, null );
      return true;
    }
    function validateEmail() {
      let value = emailInput.value;
      let reg = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
      if ( !value ) {
        showErrorMessage( emailInput, 'Email is required.' );
        return false;
      }
      if ( !reg.test( value ) ) {
        showErrorMessage( emailInput, 'Invalid mail pattern.' );
        return false;
      }
      showErrorMessage( emailInput, null );
      return true;
    }
    function validateDob() {
      let value = dobInput.value;

      if ( !value instanceof Date ) {
        showErrorMessage( dobInput, 'Please enter a valid date.' );
        return false;
      }
      showErrorMessage( dobInput, null );
      return true;
    }

    function showErrorMessage( input, message ) {
      let container = input.parentElement;
      let error = container.querySelector( '.error-message' );
      if ( error ) {
        container.removeChild( error );
      }
      if ( message ) {
        let error = document.createElement( 'div' );
        error.classList.add( 'error-message' );
        error.innerText = message;
        container.appendChild( error );
      }
    }
    usernameInput.oninput = validateUsername;
    passwordInput.oninput = validatePassword;
    emailInput.oninput = validateEmail;
    dobInput.onchange = validateDob;
  } );
    
    //toggle pw visibility
  const changeState = () => {
    var oldState = tglpw.type;
    var isTextOrHide = ( oldState === 'password' );
    var newState = ( isTextOrHide ) ? 'text' : 'password';
    var newWord = ( isTextOrHide ) ? 'Hide' : 'Show';
    props.togglePw( { type: newState, word: newWord } );
  }



  return (
    <Container fluid className="registration-view pb-5">
      <Row className="justify-content-center px-5">
        <Col className="">
          <h3 className="my-5 text-danger">Register for QuarantinoFlix</h3>
          <Row md={2} className="justify-content-center">
            <Col>
              <Form noValidate onSubmit={handleRegister}>
                <Form.Group as={Row} controlId="formUsername">
                  <Form.Label column sm={2} md={3}>Username*</Form.Label>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Username"
                      name='username'
                      className="form-control-register"
                      value={user.Username}
                      onChange={e => props.setUser( { ...user, Username: e.target.value } )}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formPassword">
                  <Form.Label column sm={2} md={3}>Password*</Form.Label>
                  <Col>
                    <Form.Control
                      type={tglpw.type}
                      value={user.Password}
                      placeholder="Password"
                      name="password"
                      className="form-control-register"
                      onChange={e => props.setUser( { ...user, Password: e.target.value } )}
                    />
                    <span className="password-trigger" onClick={changeState}>{tglpw.word}</span>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formEmail">
                  <Form.Label column sm={2} md={3}>Email*</Form.Label>
                  <Col>
                    <Form.Control
                      type="email"
                      value={user.Email}
                      placeholder="Email"
                      name="email"
                      className="form-control-register"
                      onChange={e => props.setUser( { ...user, Email: e.target.value } )}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formBirth">
                  <Form.Label column sm={2} md={3}>Birthday</Form.Label>
                  <Col>
                    <Form.Control
                      type="date"
                      value={user.Dob}
                      placeholder="Birthday"
                      name="birthday"
                      className="form-control-register"
                      onChange={e => props.setUser( { ...user, Dob: e.target.value } )}
                    />
                  </Col>
                </Form.Group>
                <span className="required-inputs">fields marked with "*" are required</span>
                <Row className="my-4">
                  <Col className="btn-col">
                    <Button
                      className="btn-register"
                      variant="primary"
                      type="submit">
                      Register
                    </Button>
                    <p>
                    Already have an account?
                    <Button variant="light" onClick={ () => window.location.pathname = '/login'}>
                      Log in
                    </Button>
                    </p>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}



export default connect( mapStateToProps, { setUser, togglePw } )( RegistrationView );

RegistrationView.propTypes = {
  setUser: PropTypes.func.isRequired,
  user: PropTypes.shape( {
    Username: PropTypes.string,
    Password: PropTypes.string,
    Email: PropTypes.string,
    Dob: PropTypes.Date
  } ),
  tglpw: PropTypes.shape( {
    type: PropTypes.string,
    word: PropTypes.string
  } ),
  togglePw: PropTypes.func.isRequired
};
