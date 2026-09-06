import axios from "axios";

const pythonApi = axios.create({
  baseURL: "http://localhost:8000",
});

export default pythonApi;