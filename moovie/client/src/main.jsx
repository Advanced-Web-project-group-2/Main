import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";
import Layout from "./components/Layout.jsx";

import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import Profile from "./pages/Profile.jsx";
import InCinemas from "./pages/InCinemas.jsx";
import Groups from "./pages/Groups.jsx";
import GroupPage from "./pages/GroupPage.jsx";
import AdvancedSearch from "./pages/AdvancedSearch.jsx";
import Shop from "./pages/Shop.jsx";
import Movie from "./pages/Movie.jsx";
import Main from "./pages/Main.jsx";
import "./styles/styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>

        {/* Layout WRAPS all pages */}
        <Route element={<Layout />}>

          <Route path="/" element={<Main />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/in-cinemas" element={<InCinemas />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/group/:groupId" element={<GroupPage />} />
          <Route path="/advanced-search" element={<AdvancedSearch />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/movie/:movieId" element={<Movie />} />

        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
