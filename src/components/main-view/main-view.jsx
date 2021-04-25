import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { BrowserRouter as Router, Route, Link} from "react-router-dom";
import { Row, Container, Navbar, Nav, Col, Card, Button } from 'react-bootstrap';
//#0
import { setMovies, setUser } from '../../actions/actions';
//#1
import MoviesList from '../movies-list/movies-list';
import  ProfileView  from '../profile-view/profile-view';
import  RegistrationView  from '../registration-view/registration-view';
import  LoginView from '../login-view/login-view';
import  MovieView  from '../movie-view/movie-view';
//
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';


import './main-view.scss';

//export keyword removed
class MainView extends React.Component {

  constructor() {
    super();
  
    //#3 movies state removed
    this.state = {};
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.props.setUser( {
        Username: localStorage.getItem( 'username' ),
        Password: localStorage.getItem( 'password' ),
        Email: localStorage.getItem( 'email' ),
        Dob: localStorage.getItem( 'dob' ),
        FavoriteMovies: JSON.parse( localStorage.getItem( 'favoriteMovies' ) )
      } );
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
  this.props.setUser( {
    Username: authData.user.Username,
    Password: authData.user.Password,
    Email: authData.user.Email,
    Dob: authData.user.Birthday,
    FavoriteMovies: authData.user.FavoriteMovies
  } );

  localStorage.setItem( 'favoriteMovies', JSON.stringify( authData.user.FavoriteMovies ) );
  localStorage.setItem( 'token', authData.token );
  localStorage.setItem( 'username', authData.user.Username );
  localStorage.setItem( 'password', authData.user.Password );
  localStorage.setItem( 'email', authData.user.Email );
  localStorage.setItem( 'dob', authData.user.Birthday );
  this.getMovies( authData.token );
}


/*When a movie is clicked, this function is invoked and updates the state of the `selectedMovie` *property to that movie*/

onMovieClick(movie) {
  this.setState({
    selectedMovie: movie
  });
}


//When a user logs out its localStorage keys will be deleted
logOut() {
  localStorage.clear();
    this.props.setUser( {} );
    window.open( '/', '_self' );
  }


  onMovieDel() {
    this.setState( {
      user: {
        ...this.state.user,
        favoriteMovies: JSON.parse( localStorage.getItem( 'favoriteMovies' ) )
      }
    } );
  }

//When a user registers
// onRegister(register) {
//   this.setState({
//     register,
//   });
// }

// onBackClick() {
//   this.setState({
//     selectedMovie: null
//   });
// }
 


render() {
  let {movies, user} = this.props;
  let { selectedMovie, register } = this.state;
  let accessToken = localStorage.getItem( 'token' );

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
        <Route exact path={["/", "/login"]} render={() => {
          if ( !accessToken ) return (
            <LoginView onLoggedIn={data => this.onLoggedIn( data )} />
          );
          return (
            <Container fluid className="main-view pb-5">
              <Navbar sticky="top" className="px-5 py-0 mb-2">
                <Navbar.Brand className="brand" href="/">QuarantinoFlix</Navbar.Brand>
                <Nav className="ml-auto button-wrapper">
                  <Link to={'/users/me'}>
                    <Button
                      type="button"
                      variant="btn btn-dark" >
                      Profile
                  </Button>
                  </Link>
                  <Button
                      type="button"
                      variant="outline-dark"
                      // className="navbar-link"
                      onClick={() => this.logOut()}
                    >
                      Sign Out
                    </Button>
                </Nav>
              </Navbar>
              <Row className="px-5 py-3">
                <MoviesList movies={movies} />
              </Row>
            </Container>
          );
        }} />

        {/* REGISTER VIEW */}

        <Route path="/register" component={RegistrationView} />
        
        {/* MOVIE VIEW */}
        <Route path="/movies/:movieId"
          render={( { match } ) => {
            return <MovieView
              onClick={() => this.LogOut()}
              movie={movies.find( m => m._id === match.params.movieId )} />;
          }
          } />
        {/* GENRE VIEW */}
        {/* <Route path="/genres/:title" render={( { match } ) => {
          return <GenreView onClick={() => this.LogOut()} genre={movies.find( m => m.Genre.Name === match.params.name ).Genre} movies={movies} />;
        }
        } /> */}
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
             <Route path="/users/me" render={( { match } ) => {
          return <ProfileView
            onLogout={() => this.LogOut()}
            onMovieDel={() => this.onMovieDel()}
            user={user}
            movies={movies} />
        }} />
      </Row>
      </div>
      <footer className="fixed-bottom py-3 text-center">
          <p className="my-auto">QuarantinoFlix Services 2021. All rights reserved &#169;</p>
        </footer>
      </Router>
      </Container>
    );
 }
}

//#7 
let mapStateToProps = state => {
  return { movies: state.movies,
  user: state.user }
} 

//#8
export default connect (mapStateToProps, { setMovies, setUser } )
(MainView);

MainView.propTypes = {
  movies: PropTypes.array,
  setMovies: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  user: PropTypes.shape( {
    Username: PropTypes.string,
    Password: PropTypes.string,
    Email: PropTypes.string,
    Dob: PropTypes.Date
  } )
}