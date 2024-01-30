import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Challenges from "./pages/Challenges";
import Favourites from "./pages/Favourites";
import Home from "./pages/Home";
import Media from "./pages/Media";
import Movies from "./pages/Movies";
import Person from "./pages/Person";
import Recommendations from "./pages/Recommendations";
import Search from "./pages/Search";
import Series from "./pages/Series";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Reviews from "./pages/Reviews";
import Watchlist from "./pages/Watchlist";
import Player from "./components/Player";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/challenges" element={<Challenges />} />
        <Route exact path="/favourites" element={<Favourites />} />
        <Route exact path="/" element={<Home />} />
        <Route path="/media/:mediaType/:mediaId" element={<Media />} />
        <Route exact path="/movies" element={<Movies />} />
        <Route exact path="/person" element={<Person />} />
        <Route exact path="/recommendations" element={<Recommendations />} />
        <Route exact path="/search" element={<Search />} />
        <Route exact path="/series" element={<Series />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/watchlist" element={<Watchlist />} />
        <Route exact path="/reviews" element={<Reviews />} />
        <Route path="/player/:mediaType/:mediaId" element={<Player />} />
      </Routes>
    </BrowserRouter>
  );
}
