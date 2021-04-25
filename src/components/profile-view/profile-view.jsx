import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Row, Col, Container, Form, Button, Card, Navbar, Nav, Spinner } from "react-bootstrap";

import { Link } from "react-router-dom";
import axios from "axios";

import { connect } from 'react-redux';
import { setUser, togglePw } from '../../actions/actions';

import "./profile-view.scss";


const mapStateToProps = state => {
  return {
    user: state.user,
    tglpw: state.tglpw
  };
}

function ProfileView (props) {
  const {user, movies, tglpw} = props;

  //convert birthday to common format
  let convertDob = '';
  if  (user.Dob) {
    convertDob = user.Dob.slice( 0 , 10 );
  }

  //list of current user favorite movies
  const favoriteMovieList = movies.filter( movie => {
    return user.FavoriteMovies.includes(movie._id)
  });

  const updateUser = (e) => {
    e.preventDefault();
    let error = document.querySelector('.error-message');
    if(error) {
      let container = document.querySelector('.btn-update').parentElement.parentElement;
      let note =  document.createElement('div');
      note.classList.add('note-message','note-message-update');
      note.innerText = 'Update impossible due to errors. \rPlease rectify your imputs.';
      container.appendChild(note);
      return false;
    }else{
      let token = localStorage.getItem('token');
      let un = localStorage.getItem('username');
      let pw = localStorage.getItem('password');
      let em = localStorage.getItem('email');
      let birth = localStorage.getItem('dob');

      axios.put(`https://quarantinoflix.herokuapp.com/users/${un}`, {
        Username: (user.Username == un) ? un : user.Username,
        Password: (user.Password == pw) ? pw : user.Password,
        Email: (user.Email == em) ? em : user.Email,
        Birthday: (user.Dob == birth ) ? birth : user.Dob
      },
      { 
        headers: { Authorization: `Bearer ${token}`}
      })
      .then( response => {
        const data = response.data;
        const input = document.getElementsByClassName('formPassword');
        props.setUser({
          ...user,
          Username: data.Username,
          Password: data.Password,
          Email: data.Email,
          Dob: data.Birthday
        });
        console.log(data);
        localStorage.setItem('username', data.Username);
        localStorage.setItem('password', data.Password);
        localStorage.setItem('email', data.Email);
        localStorage.setItem('dob', data.Dob);
        alert('User succesfully updated.');
        input.value = '';
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  useEffect( () => {
    let usernameInput = document.querySelector('#formUsername');
    let emailInput = document.querySelector('#formEmail');
    let dobInput = document.querySelector('#formBirth');

    function validateUsername() {
      let value = usernameInput.value;
      let reg = /\w{5,}/;
      if ( !reg.test(value)) {
        showErrorMessage( usernameInput, 'Username must contain at least 5 alphanumeric characters.');
        return false;
      }
      showErrorMessage(usernameInput, null);
      return true;
    }

    function validateEmail() {
      let value = emailInput.value;
      let reg = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

      if(!reg.test(value)) {
        showErrorMessage(emailInput, 'Invalid mail pattern.');
        return false;
      }
      showErrorMessage(emailInput, null);
      return true;
    }
    function validateDob() {
      let value = dobInput.value;

      if (!value instanceof Date) {
        showErrorMessage(dobInput, 'Please enter a valid date.');
        return false;
      }
      showErrorMessage(dobInput, null);
      return true;
    }
    function showErrorMessage(input, message) {
      let container = input.parentElement;
      let error = container.querySelector('.error-message');
      if(error) {
        container.removeChild(error);
      }
      if (message) {
        let error = document.createElement('div');
        error.classList.add('error-message');
        error.innerText = message;
        container.appendChild(error);
      }
    }
    usernameInput.oninput = validateUsername;
    emailInput.oninput = validateEmail;
    dobInput.oninput = validateDob;
  });

  const handleCancel = () => {
    props.setUser({
      ...user,
      Username: localStorage.getItem('username'),
      Password: localStorage.getItem('password'),
      Email: localStorage.getItem('email'),
      Dob: localStorage.getItem('dob')
    });
    let input = document.getElementsByClassName('formPassword');
    input.value = '';
  }

  const handleDelete = () => {
    let token = localStorage.getItem('token');
    if ( confirm('Are you sure you want to delete your account?')) {
      axios.delete(`https://quarantinoflix.herokuapp.com/users/${user.Username}`, {
        headers: {Authorization: `Bearer ${token}` }
      })
      .then( () => {
        localStorage.clear();
        alert(`Account succesfully deleted. We're sorry you're leaving ${user.Username}.`);
        window.open('/', '_self');
        props.setUser('');
      });
    }
  }
  const removeFavorite = (mId) => {
    let token = localStorage.getItem('token');
    axios.delete(`https://quarantinoflix.herokuapp.com/users/${user.Username}/movies/${mId}`, {
      headers: {Authorization: `Bearer ${token}` }
    })
    .then( () => {
      let newList = favoriteMovieList.filter( item => item._id !== mId );
      newList = newList.map( function (item) { return item._id; } );
      localStorage.setItem('favoriteMovies', JSON.stringify( newList ));
      props.setUser({
        ...user,
        FavoriteMovies: newList
      });
    })
    .catch (error => {
      console.log(error);
    });
  }

  //toggle pw visibility
  const changeState = () => {
    var oldState = tglpw.type;
    var isTextOrHide =  (oldState === 'password');
    var newState = ( isTextOrHide ) ? 'text' : 'password';
    var newWord = ( isTextOrHide ) ? 'Hide' : 'Show';
    props.togglePw( { type: newState, word: newWord });
  }

    return (
      <div className="userProfile" style={{ display: "flex" }}>
        <Container fluid className="px-5 pb-5 justify-content-center">
        <Navbar sticky="top" className="p-0 mb-2">
        <Navbar.Brand className="brand" href="/">QuarantinoFlix</Navbar.Brand>
        <Nav className="ml-auto button-wrapper">
          <Link to={'/'}>
            <Button
              type="button"
              variant="danger"
              className="mx-2">
              Return to movies
              </Button>
          </Link>
        </Nav>
      </Navbar>

      <Row className="mb-5">
        <Col>
          <h1 className="brand my-auto">Profile</h1>
        </Col>
      </Row>

      <Row lg={2} className="">
        <Col xs={8}>
          <Form noValidate className="update-form" onSubmit={updateUser}>
            <Form.Group as={Row} controlId="formUsername">
              <Form.Label className="form-label-profile" column md={3}>Username</Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Set a new Username"
                  name='inputUsername'
                  value={user.Username}
                  className="form-control-profile"
                  onChange={e => props.setUser( { ...user, Username: e.target.value } )}
                  pattern='[a-zA-Z\d]{5,}'
                />
                <Form.Control.Feedback type="invalid">
                  A Username must at least consist of 5 characters.
                    </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPassword">
              <Form.Label className="form-label-profile" column md={3}>Password</Form.Label>
              <Col>
                <Form.Control
                  type={tglpw.type}
                  placeholder="Set a new Password"
                  name="password"

                  className="form-control-profile"
                  onChange={e => props.setUser( { ...user, Password: e.target.value } )}
                />
                <span className="password-trigger" onClick={changeState}>{tglpw.word}</span>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formEmail">
              <Form.Label className="form-label-profile" column md={3}>Email</Form.Label>
              <Col>
                <Form.Control
                  type="email"
                  value={user.Email}
                  placeholder="Set a new Email adress"
                  name="email"
                  className="form-control-profile"
                  onChange={e => props.setUser( { ...user, Email: e.target.value } )}
                  pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="last-form-row" controlId="formBirth">
              <Form.Label className="form-label-profile" column md={3}>Birthday</Form.Label>
              <Col>
                <Form.Control
                  type="date"
                  value={convertDob}
                  placeholder="Update your Birthday"
                  name="birthday"
                  className="form-control-profile"
                  onChange={e => props.setUser( { ...user, Dob: e.target.value } )}
                />
              </Col>
            </Form.Group>
            <Row className="my-4">
              <Col className="btn-col">
                <Button
                  variant="outline-info"
                  type="button"
                  onClick={handleCancel}>
                  Cancel
                  </Button>
              </Col>
              <Col xs="auto" className="btn-col">
                <Button
                  variant="info"
                  type="submit"
                  className="btn-update">
                  <div className="show" style={{ display: "inline" }}>
                    Update
                    </div>
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col>
          <Button
            variant="outline-danger"
            type="button"
            onClick={handleDelete}>
            UNREGISTER!
            </Button>
        </Col>
      </Row>

      <h4 className="my-4">Favorite Movies</h4>
      <Row className="favorite-movies">
        {favoriteMovieList.map( movie => (
          <Col key={movie._id} className="mb-4 ">
            <Card className="fav-card mx-auto">
              <Card.Header>
                <Card.Title>{movie.Title}</Card.Title>
              </Card.Header>
              <Card.Body>
                <Card.Img variant="top" src={movie.ImagePath} />
              </Card.Body>
              <Card.Footer>
                <Row>
                  <Col className="mr-auto">
                    <Link to={`/movies/${movie._id}`}>
                      <Button variant="warning">Open</Button>
                    </Link>
                  </Col>
                  <Col>
                    <Button
                      className=""
                      onClick={() => { removeFavorite( movie._id ) }}
                      variant="outline-danger"
                      type="button">
                      Remove
                    </Button>
                  </Col>
                </Row>
              </Card.Footer>
            </Card>
          </Col>
        ) )}
      </Row>
        </Container>
      </div>
    )
}


export default connect( mapStateToProps, { setUser, togglePw } )( ProfileView );

ProfileView.propTypes = {
  movies: PropTypes.array.isRequired,
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
  togglePw: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  onMovieDel: PropTypes.func.isRequired
}