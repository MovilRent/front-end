import axios from "axios";

export default axios.create({
  
  baseURL: "https://my-json-server.typicode.com/mauriprado/json-socialmed/",

  headers: { "Content-type": "application/json" },
});
