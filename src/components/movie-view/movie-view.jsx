import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Card, Button } from 'react-bootstrap';

import './movie-view.scss';

export class MovieView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

addFavorite(movie) {
  let token = localStorage.getItem("token");
  let url = "https://quarantinoflix.herokuapp.com/users/" +
  localStorage.getItem("user") +
  "/movies/" + 
  movie._id;

  console.log(token);

  axios
  .post(url, "", {
    headers: { Authorization: `Bearer ${token}`},
  })
  .then((response) => {
    console.log(response);
    window.open("/","_self");
    alert("Added to Favorites!");
  });
}

  render() {
    const { movie } = this.props;

    if (!movie) return null;

  

    return (
      <div className='movie-view'>
        <Card style={{ width: '18rem' }}>
          <Card.Img variant='top' src={movie.imagePath} />
          <Card.Body>
            <Card.Title>{movie.Title}</Card.Title>
            <div>
              <Button
                variant="primary"
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
              <span className='value'>{movie.Genre.Name}</span>
            </Card.Text>
            <Card.Text>
              <span className='label text-danger'>Director: </span>
              <span className='value'>{movie.Director.Name}</span>
            </Card.Text>
            <Link to={`/directors/${movie.Director.Name}`}>
              <Button variant="link">Director</Button>
            </Link>

            <Link to={`/genres/${movie.Genre.Name}`}>
              <Button variant="link">Genre</Button>
            </Link>
          </Card.Body>
          <Link to={`/`}>
                    <Button className="text-left" variant="danger">
                      Back
                    </Button>
                  </Link>
        </Card>
      </div>
    );
  }
}

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
  }).isRequired,
};