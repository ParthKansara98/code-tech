import './App.css';
import MoviesDetails from './components/MoviesDetails';
import { useState } from 'react';

function App() {
  const [movies, setMovies] = useState('');
  const [searchedMovies, setSearchedMovies] = useState('');

  const handleInputChange = (e) => {
    setMovies(e.target.value);
  };

  const handleGetMovies = () => {
    if (movies.trim()) {
      setSearchedMovies(movies);
    }
  };

  return (
    <div className="App">
      <h1>Movies App</h1>
      <input
        name="moviesName"
        value={movies}
        onChange={handleInputChange}
        placeholder="Enter movies name"
      />
      <button onClick={handleGetMovies}>Get Movies</button>

      {searchedMovies && <MoviesDetails name={searchedMovies} />}
    </div>
  );
}

export default App;
