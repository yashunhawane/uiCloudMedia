import axios from "axios";

const client = axios.create({
  baseURL: "http://192.168.0.133:5000/api/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
