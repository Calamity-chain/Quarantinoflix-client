import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Row, Col, Card, Button, Navbar, Nav, Container } from 'react-bootstrap';

import {setUser} from '../../actions/actions';

import './movie-view.scss';

class MovieView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

addFavorite(movie) {
  let token = localStorage.getItem( 'token' );
  if ( this.props.user.FavoriteMovies && this.props.user.FavoriteMovies.indexOf( movie._id ) > -1 ) {
    alert( `${movie.Title} is already one of your favorites.` );
  } else {
    axios.post( `https://quarantinoflix.herokuapp.com/users/${this.props.user.Username}/movies/${movie._id}`, {},
      {
        headers: { Authorization: `Bearer ${token}` }
      } )
      .then( () => {
        if (this.props.user.FavoriteMovies) {
          this.props.setUser( {
            ...this.props.user,
            FavoriteMovies: [movie._id, ...this.props.user.FavoriteMovies]
          });
        } else {
          this.props.setUser( {
            ...this.props.user,
            FavoriteMovies: [movie._id]
          });
        }        
        alert( `${movie.Title} added to your Favorites!` );
        localStorage.setItem( 'favoriteMovies', JSON.stringify( this.props.user.FavoriteMovies ) );
      } )
      .catch( error => {
        console.error( error );
      } );
  }
}

  render() {
    const { movie, user } = this.props;

    if (!movie) return null;

  

    return (
      <Container fluid className="movie-view pb-5">
      <div className='movie-view'>
        <Navbar sticky="top" className="px-5 py-0 mb-2">
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
            <Link to={'/users/me'}>
            <Button
                      type="button"
                      variant="btn btn-dark" >
                      Profile
                  </Button>
            </Link>
          </Nav>
        </Navbar>
        <Card style={{ width: '18rem' }}>
          <Card.Img variant='top' src={movie.imagePath} />
          <Card.Body>
            <Card.Title>{movie.Title}</Card.Title>
            <div>
              <Button
                variant="btn btn-outline-warning"
                size="sm"
                onClick={() => this.addFavorite(movie)}
              >
                Add to Favorites
              </Button>
            </div>
            <Card.Text>
              <span className='label text-danger'>Description: </span>
              <span className='value'>{movie.Description}</span>
            </Card.Text>
            <Card.Text>
              <span className='label text-danger'>Genre: </span>
              <Link to={`/genres/${movie.Genre.Name}`}>
              <Button variant="btn btn-outline-dark btn-sm">{movie.Genre.Name}</Button>
              </Link>
            </Card.Text>
            <Card.Text>
              <span className='label text-danger'>Director: </span>
              <Link to={`/directors/${movie.Director.Name}`}>
              <Button variant="btn btn-outline-dark btn-sm">{movie.Director.Name}</Button>
            </Link>
            </Card.Text>
          </Card.Body>
          <Col><img className="movie-poster" src={movie.ImagePath} /></Col>
        </Card>
      </div>
      </Container>
    );
  }
}

let mapStateToProps = state => {
  return { user: state.user }
}

export default connect( mapStateToProps, { setUser } )( MovieView );

MovieView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
    Genre: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Description: PropTypes.string.isRequired,
    }),
    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Bio: PropTypes.string.isRequired,
      Birth: PropTypes.string,
      Death: PropTypes.string,
    }),
  })
};