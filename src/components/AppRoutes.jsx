import React from "react";
import { Routes, Route } from "react-router-dom";

import Main from "./Main";

import NotFound from "./NotFound";
import About from "./About";
import Chat from "./chat/Chat";

const AppRoutes = () => (
  <>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
);

export default AppRoutes;
