import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Card, Container, Button, Nav, Navbar }from 'react-bootstrap';
import { Link } from 'react-router-dom';


export class GenreView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const {  movies, genre } = this.props;

    if (!genre) return <div className="main-view" />;

    return (
      <Container fluid className="genre-view pb-5">
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

        <Container fluid className="px-5">
          <Row className="mb-5">
            <Col>
              <h1 className="brand my-auto">{genre.Genre.Name}</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <h5>Description</h5>
            </Col>
          </Row>
          <Row className="mb-5">
            <Col className="description">
              {genre.Genre.Description}
            </Col>
          </Row>
          <Container>
        <h4 className="mt-4">Some {genre.Genre.Name} movies</h4>
        <div className="d-flex row mt-3 ml-2">
          {movies.map((movie) => {
            if (movie.Genre.Name === genre.Genre.Name) {
              return (
                <div key={movie._id}>
                  <Card
                    className="mb-3 mr-2 h-100"
                    style={{ width: '16rem' }}
                  >
                    <Card.Img variant="top" src={movie.ImagePath} />
                    <Card.Body>
                      <Link
                        className="text-muted"
                        to={`/movies/${movie._id}`}
                      >
                        <Card.Title>{movie.Title}</Card.Title>
                      </Link>
                      <Card.Text>
                        {movie.Description.substring(0, 90)}...
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className="bg-white border-top-0">
                      <Link to={`/movies/${movie._id}`}>
                        <Button type= "button"
                          variant="outline-danger"
                          className="read-more-link pl-0"
                        >
                           Read more
                        </Button>
                      </Link>
                    </Card.Footer>
                  </Card>
                </div>
              );
            }
          })}
        </div>
      </Container>
        </Container>
      
    </Container>
  );
}
}

GenreView.propTypes = {
movie: PropTypes.shape({
  Genre: PropTypes.shape ({
    Name: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    // ImagePath: PropTypes.string.isRequired,
  }).isRequired,
}),
};


