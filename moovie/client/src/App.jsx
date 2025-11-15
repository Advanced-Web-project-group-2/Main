
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Main from "./pages/Main.jsx";
import Groups from "./pages/Groups.jsx";
import GroupPage from "./pages/GroupPage.jsx";
import InCinemas from "./pages/InCinemas.jsx";
import AdvancedSearch from "./pages/AdvancedSearch.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import Profile from "./pages/Profile.jsx";
import Shop from "./pages/Shop.jsx";
import Movie from "./pages/Movie.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/group/:groupId" element={<GroupPage />} />
        <Route path="/in-cinemas" element={<InCinemas />} />
        <Route path="/advanced-search" element={<AdvancedSearch />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/movie/:movieId" element={<Movie />} />
      </Routes>
    </Router>
  );
}


