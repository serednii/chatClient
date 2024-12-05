import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";

import Main from "./Main";
import authStore from "../AuthUser/mobx/AuthStore";
import NotFound from "./NotFound";
import About from "./About";
import Chat from "./chat/Chat";

import AuthForms from "../AuthUser/components/AuthForms/AuthForms";

const AppRoutes = () => {
  // console.log("AppRoutes RENDER");
  // console.log(authStore.isAuth);
  const navigate = useNavigate();
  const location = useLocation();
  // console.log(location);
  const isAuth = authStore.isAuth; // Припустимо, що це змінна з вашого стану

  useEffect(() => {
    if (location.pathname !== "/chat") {
      if (isAuth) {
        navigate("./main");
      } else {
        navigate("./");
      }
    }
  }, [isAuth, navigate]); // Додаємо залежності

  return (
    <div className="wrapper">
      {/* {!authStore.isAuth && <AuthForms />}
      {authStore.isAuth && ( */}
      <Routes>
        <Route path="/" element={<AuthForms />} />
        <Route path="/main" element={<Main />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* // )} */}
    </div>
  );
};

export default observer(AppRoutes);
