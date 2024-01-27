const API_KEY = "885ace53c3c3043b86892e7da4125558";


const requests = {
  fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
  fetchPopularMovies: `/movie/popular?api_key=${API_KEY}&language=en-US`,
  fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchPopularTV: `/tv/popular?api_key=${API_KEY}&language=en-US`,
  fetchTopRatedTV: `/tv/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
  fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
  fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
  fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
  fetchGenres: `/genre/movie/list?api_key=${API_KEY}&language=en-US`,
  fetchMovieVideos: (movieId) => `/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
};

export default requests;
