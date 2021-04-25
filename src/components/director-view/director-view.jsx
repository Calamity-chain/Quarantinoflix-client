import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Nav, Navbar, Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './director-view.scss';

export class DirectorView extends React.Component {
  
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { movies, director } = this.props;

    if (!director) return null;

    return (
      <Container fluid className="director-view pb-5">
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
          <Row className="mb-2">
            <Col>
              <h1 className="brand my-auto">{director.Director.Name}</h1>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              Born in {( director.Director.Birth )}
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              Died in {( director.Director.Death )}
            </Col>
          </Row>
          <Row>
            <Col>
              <h5>Biography</h5>
            </Col>
          </Row>
          <Row className="mb-5">
            <Col className="description">
              {director.Director.Bio}
            </Col>
          </Row>
          <Row className="mb-3">
          <Container>
          <h4 className="mt-4">Some {director.Director.Name} movies</h4>
          <div className="d-flex row mt-3 ml-1">
            {movies.map((movie) => {
              if (movie.Director.Name === director.Director.Name) {
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
                          <Button
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
          </Row>
        </Container>
      </Container>
    );
  }
}

DirectorView.propTypes = {
  movie: PropTypes.shape({
    Director: PropTypes.shape ({
      Name: PropTypes.string.isRequired,
      Bio: PropTypes.string.isRequired,
      Birth: PropTypes.string,
      Death: PropTypes.string,
    }),
  }),
};