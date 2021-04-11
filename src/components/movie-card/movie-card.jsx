import React from 'react';
import PropTypes from 'prop-types';

import { Card } from 'react-bootstrap';

import './movie-card.scss';

export class MovieCard extends React.Component {
  render() {
    // This is given to the <MovieCard/> component by the outer world
    // which, in this case, is `MainView`, as `MainView` is what’s
    // connected to your database via the movies endpoint of your API
    const { movie, onClick } = this.props;

    return (
      <Card
        onClick={() => onClick(movie)}
        border='danger'
        style={{ width: '200', height: 'auto' }}
      >
        <Card.Header>{movie.Title}</Card.Header>
        <img
          className='movie-poster'
          src={movie.imagePath}
          alt='movie poster'
        />
      </Card>
    );
  }
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imagePath: PropTypes.string.isRequired,
    genre: PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
    director: PropTypes.shape({
      name: PropTypes.string.isRequired,
      bio: PropTypes.string.isRequired,
      birth: PropTypes.string.isRequired,
      death: PropTypes.string,
    }),
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};