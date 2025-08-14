import { toast, Toaster } from "react-hot-toast";
import { fetchMovies } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";
import MovieGrid from "../MovieGrid/MovieGrid";
import { useState } from "react";
import { Movie } from "../../types/movie";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoader, setIsLoader] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSelect, setIsSelect] = useState<Movie | null>(null);

  async function onSubmit(query: string) {
    try {
      setIsLoader(true);
      setMovies([]);
      const response = await fetchMovies(query);

      if (!response.length) {
        toast.error("No movies found for your request.");
        return;
      }

      setMovies(response);
    } catch {
      setIsError(true);
    } finally {
      setIsLoader(false);
    }
  }

  function onSelect(movie: Movie) {
    setIsSelect(movie);
  }

  function onClose() {
    setIsSelect(null);
  }

  return (
    <div className={css.app}>
      <SearchBar onSubmit={onSubmit} />
      {!isLoader && <MovieGrid onSelect={onSelect} movies={movies} />}
      {isLoader && <Loader />}
      {isError && <ErrorMessage />}
      {isSelect && <MovieModal movie={isSelect} onClose={onClose} />}
      <Toaster />
    </div>
  );
}
