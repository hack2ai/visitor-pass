import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Input from "../ui/Input";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axios";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("123456");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { success, data, message } = response.data;

      if (!success) {
        alert(message || "Login failed");
        return;
      }

      login(data.user, data.accessToken);

      alert("Login successful!");

      navigate("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);

        alert(
          error.response?.data?.message ??
            "Invalid email or password."
        );
      } else if (error instanceof Error) {
        console.error(error.message);
        alert(error.message);
      } else {
        console.error(error);
        alert("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-4xl font-bold">
        Welcome Back
      </h2>

      <p className="text-gray-500 mt-2">
        Login to continue
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 mt-10"
      >
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@gmail.com"
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
        />

        <Button
          type="submit"
          loading={loading}
        >
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;