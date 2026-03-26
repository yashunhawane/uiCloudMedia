import axios from "axios";

const client = axios.create({
  baseURL: "http://192.168.0.133:5000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;