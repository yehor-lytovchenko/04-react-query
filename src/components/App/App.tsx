import { toast, Toaster } from "react-hot-toast";
import { fetchMovies } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";
import MovieGrid from "../MovieGrid/MovieGrid";
import { useEffect, useState } from "react";
import { Movie } from "../../types/movie";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

export default function App() {
  const [isSelect, setIsSelect] = useState<Movie | null>(null);

  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["query", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data.results.length === 0) {
      toast.error("No movies found for your request.");
      return;
    }
  }, [isSuccess, data]);

  async function onSubmit(newQuery: string) {
    setQuery(newQuery);
    setCurrentPage(1);
  }

  function onSelect(movie: Movie) {
    setIsSelect(movie);
  }

  function onClose() {
    setIsSelect(null);
  }

  const totalPages = data?.total_pages ?? 0;

  return (
    <div className={css.app}>
      <SearchBar onSubmit={onSubmit} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {data && data.results.length > 0 && (
        <MovieGrid onSelect={onSelect} movies={data.results} />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSelect && <MovieModal movie={isSelect} onClose={onClose} />}
      <Toaster />
    </div>
  );
}
