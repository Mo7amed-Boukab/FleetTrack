import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default instance;