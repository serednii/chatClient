import React, { useState, FormEvent } from "react";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import LoginForm from "./LoginForm/LoginForm";
import SignInForm from "./Registratioh/SignInForm";

import "./AuthForms.scss";

const AuthForms: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);
  console.log("AuthForms");

  const handleTabSelect = (key: string | null) => {
    // Якщо користувач клікнув на активну вкладку, то згортаємо її
    if (key === activeKey) {
      setActiveKey(undefined); // Замість null використовуємо undefined
    } else {
      setActiveKey(key || undefined);
    }
  };

  return (
    <div className="login-form">
      <div className="login-form__inner">
        <Tabs
          activeKey={activeKey}
          onSelect={handleTabSelect}
          id="auth-tabs"
          className="mb-3"
        >
          <Tab eventKey="Log in" title="Log in">
            {activeKey === "Log in" && <LoginForm />}
          </Tab>
          <Tab eventKey="Sign in" title="Sign in">
            {activeKey === "Sign in" && <SignInForm />}
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthForms;
