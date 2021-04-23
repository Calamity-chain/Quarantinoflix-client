import React from 'react';
import axios from 'axios';

import { connect } from 'react-redux';

import { BrowserRouter as Router, Route} from "react-router-dom";

//#0
import { setMovies } from '../../actions/actions';
//yet to create
import MoviesList from '../movies-list/movies-list';
//#1
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Card, Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';

import { RegistrationView } from '../registration-view/registration-view';
import { LoginView } from '../login-view/login-view';
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { ProfileView } from '../profile-view/profile-view';

import { Link } from "react-router-dom"; 

import './main-view.scss';

//export keyword removed
class MainView extends React.Component {

  constructor() {
    super();
  
    //#3 movies state removed
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }

 
getMovies(token) {
  axios.get('https://quarantinoflix.herokuapp.com/movies', {
    headers: { Authorization: `Bearer ${token}`}
  })
  .then(response => {
    //#4 (Assign the result to the state)
    this.props.setMovies(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
}

/* When a user successfully logs in, this function updates the `user` property in state to that *particular user*/

onLoggedIn(authData) {
  console.log(authData);
  this.setState({
    user: authData.user.Username
  });
  localStorage.setItem('token', authData.token);
  localStorage.setItem('user', authData.user.Username);
  this.getMovies(authData.token);
}


/*When a movie is clicked, this function is invoked and updates the state of the `selectedMovie` *property to that movie*/

onMovieClick(movie) {
  this.setState({
    selectedMovie: movie
  });
}


//When a user logs out
logOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  this.setState({
    user: null,
  });
  console.log("logout successful");
  alert("You have been successfully logged out");
  window.open("/", "_self");
}

//When a user registers
onRegister(register) {
  this.setState({
    register,
  });
}

onBackClick() {
  this.setState({
    selectedMovie: null
  });
}
 


render() {
  let {movies} = this.props;
  let {user, selectedMovie, register } = this.state;

  if(window.location.pathname === '/register'){
    return <RegistrationView />
  }

  /* If there is no user, the LoginView is rendered. If there is a user logged in, the user details are *passed as a prop to the LoginView*/

  if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
  
  // Before the movies have been loaded
  if (!movies) return <div className="main-view"/>;

  // if (!register) return <RegistrationView onRegister={(register) => this.onRegister(register)}/>;

  return (
    <Container>
    <Router>
    <div className="main-view justify-content-md-center">
      {/* ----------------------------VIEWS---------------------- */}
      <Row xl>
        
        {/* LOGIN VIEW */}
        <Route exact path="/" render={() => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            if (movies.length === 0) return <div className="main-view" />;
            // #6
            return <MoviesList movies={movies}/>;
          }} />

        {/* REGISTER VIEW */}

    <Route path="/register" render={() => <RegistrationView />} />
        
        {/* MOVIE VIEW */}
    <Route path="/movies/:movieId" render={({match}) => <MovieView movie={movies.find(m => m._id === match.params.movieId)}/>}/>
        
        {/* GENRE VIEW */}
    <Route
              path="/genres/:name"
              render={({ match }) => {
                if (!movies) return <div className="main-view" />;
                return (
                  <GenreView
                    genre={movies.find(
                      (m) => m.Genre.Name === match.params.name
                    )}
                    movies={movies}
                  />
                );
              }}
            />

            {/* DIRECTOR VIEW */}
    <Route
              path="/directors/:name"
              render={({ match }) => {
                if (!movies) return <div className="main-view" />;
                return (
                  <DirectorView
                    director={movies.find(
                      (m) => m.Director.Name === match.params.name
                    )}
                    movies={movies}
                  />
                );
              }}
            />
             {/* PROFILE VIEW */}
    <Route exact path = "/users/:username"
      render={() => {
        if (!user) return <LoginView onLoggedIn={(data) => this.onLoggedIn(data)}/>;
        if (movies.length === 0) return;
        return <ProfileView movies={movies}/>
      }}/>
        <footer>
      <Button
                      variant="link"
                      // className="navbar-link"
                      onClick={() => this.logOut()}
                    >
                      Sign Out
                    </Button>
                    </footer>
      </Row>
      </div>
      </Router>
      </Container>
    );
 }
}

//#7 
let mapStateToProps = state => {
  return { movies: state.movies }
} 

//#8
export default connect (mapStateToProps, { setMovies } )
(MainView);