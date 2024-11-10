import React, { useState, FormEvent } from "react";
import { observer } from "mobx-react-lite";
import authStore from "../../../mobx/AuthStore";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import "./LoginForm.scss";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  console.log("LoginForm");

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();
    authStore.login(email, password);
  };

  return (
    <div className="login-form">
      <div className="login-form__inner">
        <Form className="login-form__login">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              autoComplete="current-email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                label="Show Password"
                onClick={() => setShowPassword(!showPassword)}
              />
            </Form.Group>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            onClick={(event) => handleLogin(event)}
          >
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default observer(LoginForm);
