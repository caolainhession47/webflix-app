const API_KEY = "885ace53c3c3043b86892e7da4125558";


const requests = {
  fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
  fetchTrendingMovies: `/trending/movie/week?api_key=${API_KEY}&language=en-US`,
  fetchTrendingTVShows: `/trending/tv/week?api_key=${API_KEY}&language=en-US`,
  fetchPopularMovies: `/movie/popular?api_key=${API_KEY}&language=en-US`,
  fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchPopularTV: `/tv/popular?api_key=${API_KEY}&language=en-US`,
  fetchTopRatedTV: `/tv/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchNowPlaying: `/movie/now_playing?api_key=${API_KEY}&language=en-US`,
  fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
  fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
  fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
  fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
  fetchGenres: `/genre/movie/list?api_key=${API_KEY}&language=en-US`,
  //fetchMoviesByYear: (startYear, endYear) => `/discover/movie?api_key=${API_KEY}&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31`,
  //fetchTVShowsByYear: (startYear, endYear) => `/discover/tv?api_key=${API_KEY}&first_air_date.gte=${startYear}-01-01&first_air_date.lte=${endYear}-12-31`,
  fetchMovieVideos: (movieId) => `/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`,
  fetchMovieDetails: (movieId) => `/movie/${movieId}?api_key=${API_KEY}&language=en-US`,
  fetchTvShowDetails: (tvShowId) => `/tv/${tvShowId}?api_key=${API_KEY}&language=en-US`,
  fetchTvShowVideos: (tvShowId) => `/tv/${tvShowId}/videos?api_key=${API_KEY}&language=en-US`,
  fetchCast: (mediaType, mediaId) => `/${mediaType}/${mediaId}/credits?api_key=${API_KEY}`,
  fetchMovieBackdrops: (movieId) => `/movie/${movieId}/images?api_key=${API_KEY}&include_image_language=en,null`,
  fetchTvShowBackdrops: (tvShowId) => `/tv/${tvShowId}/images?api_key=${API_KEY}&include_image_language=en,null`,
  fetchRecommendations: (mediaType, mediaId) => `/${mediaType}/${mediaId}/similar?api_key=${API_KEY}&language=en-US`,
  fetchMoviesByGenre: (genreId) => `/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`,
  fetchTVShowsByGenre: (genreId) => `/discover/tv?api_key=${API_KEY}&with_genres=${genreId}`,
  fetchPersonDetails: (personId) => `/person/${personId}?api_key=${API_KEY}`,
  fetchPersonKnownFor: (personId) => `/person/${personId}/movie_credits?api_key=${API_KEY}`,
  fetchPersonSocials: (personId) => `/person/${personId}/external_ids?api_key=${API_KEY}`,
  fetchSearch: (mediaType, query) => `/search/${mediaType}?query=${encodeURIComponent(query)}&api_key=${API_KEY}`,
  fetchSearchPeople: (query) => `/search/person?query=${encodeURIComponent(query)}&api_key=${API_KEY}`,

};

export default requests;