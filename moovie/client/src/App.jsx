import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./layouts/Layout.jsx";

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

import './styles/styles.css';
import './styles/responsive.css';

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Pages wrapped in global layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Main />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/group/:groupId" element={<GroupPage />} />
          <Route path="/in-cinemas" element={<InCinemas />} />
          <Route path="/advanced-search" element={<AdvancedSearch />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/movie/:movieId" element={<Movie />} />
        </Route>

        {/* Auth pages WITHOUT the layout */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

      </Routes>
    </Router>
  );
}
