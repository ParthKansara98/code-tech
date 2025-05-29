import React from "react";
import "./MoviesDetails.css";

class MoviesDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movieName: this.props.name,
            movie: null,
            error: null,
        };
    }

    componentDidMount() {
        this.fetchMovieDetails();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.name !== this.props.name) {
            this.setState({ movieName: this.props.name }, () => {
                this.fetchMovieDetails();
            });
        }
    }

    fetchMovieDetails() {
        fetch(`http://www.omdbapi.com/?apikey=b922d603&t=${this.state.movieName}`).then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        }).then((data) => {
            this.setState({ movie: data });
        })
            .catch((error) => this.setState({ error }));
    } render() {
        const { movie, error } = this.state;

        if (error) {
            return <div className="error-message">Error: {error.message}</div>;
        }

        if (!movie) {
            return <div className="loading">Loading movie details...</div>;
        }

        return (
            <div className="movie-details">
                <h2>{movie.Title}</h2>
                <div className="movie-content">
                    <div className="movie-info">
                        <p><strong>Year:</strong> {movie.Year}</p>
                        <p><strong>Director:</strong> {movie.Director}</p>
                        <p><strong>Actors:</strong> {movie.Actors}</p>
                        <p><strong>Genre:</strong> {movie.Genre}</p>
                        <p><strong>Runtime:</strong> {movie.Runtime}</p>
                        <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
                        <p><strong>Plot:</strong> {movie.Plot}</p>
                    </div>
                    <div className="movie-poster">
                        {movie.Poster && movie.Poster !== "N/A" ? (
                            <img src={movie.Poster} alt={`${movie.Title} poster`} />
                        ) : (
                            <div className="no-poster">No poster available</div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default MoviesDetails;
