import React from "react";
import { Routes, Route } from "react-router-dom";
import { observer } from "mobx-react-lite";

import Main from "./Main";
import authStore from "../AuthUser/mobx/AuthStore";
import NotFound from "./NotFound";
import About from "./About";
import Chat from "./chat/Chat";
// import LoginForm from "../AuthUser/components/AuthForms/LoginForm/LoginForm";
import SignInForm from "../AuthUser/components/AuthForms/Registration/SignInForm";
import AuthForms from "../AuthUser/components/AuthForms/AuthForms";

// import AuthUser from "../AuthUser/components/AuthUser/AuthUser";

const AppRoutes = () => {
  console.log(authStore.user);
  console.log(authStore.users);

  console.log(authStore.isAuth);
  console.log(authStore.isLoading);

  return (
    <div className="wrapper">
      {/* {!authStore.isAuth && <AuthForms />}
      {authStore.isAuth && ( */}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* // )} */}
    </div>
  );
};

export default observer(AppRoutes);
