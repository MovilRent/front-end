import axios from "axios";

export default axios.create({
  
  //baseURL: "https://my-json-server.typicode.com/mauriprado/json-socialmed/",
  baseURL: "http://localhost:8080",

  headers: { "Content-type": "application/json" },
});
