import axios from "axios";
import type { Movie } from "../types/movie";

const API_KEY = import.meta.env.VITE_TMDB_TOKEN;
axios.defaults.baseURL = "https://api.themoviedb.org/3/search/";
axios.defaults.headers.common["Authorization"] = `Bearer ${API_KEY}`;

interface MovieResponse {
  results: Movie[];
  total_pages: number;
}

export async function fetchMovies(
  query: string,
  page: number
): Promise<MovieResponse> {
  const { data } = await axios.get<MovieResponse>("movie", {
    params: { page, query },
  });
  return data;
}
