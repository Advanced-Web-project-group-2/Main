import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import Main from "./pages/Main.jsx";
import Groups from "./pages/Groups.jsx";
import GroupPage from "./pages/GroupPage.jsx";
import CreateGroup from "./pages/CreateGroup.jsx";
import InCinemas from "./pages/InCinemas.jsx";
import AdvancedSearch from "./pages/AdvancedSearch.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import Profile from "./pages/Profile.jsx";
import Shop from "./pages/Shop.jsx";
import Movie from "./pages/Movie.jsx";
import PublicFavourites from "./pages/PublicFavourites.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Pages wrapped in global layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Main />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/create" element={<CreateGroup />} />
          <Route path="/groups/:groupId" element={<GroupPage />} />
          <Route path="/group/:groupId" element={<GroupPage />} />
          <Route path="/in-cinemas" element={<InCinemas />} />
          <Route path="/advanced-search" element={<AdvancedSearch />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/movie/:movieId" element={<Movie />} />

          {/* Public favourites – both URLs use same component **/}
          <Route
            path="/public-favourites/:userId"
            element={<PublicFavourites />}
          />
          <Route
            path="/lists/favourites/public/:userId"
            element={<PublicFavourites />}
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Route>
      </Routes>
    </Router>
  );
}