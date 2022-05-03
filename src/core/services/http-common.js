import axios from "axios";

export default axios.create({
  baseURL: "https://my-json-server.typicode.com/FastEducation/movilrent/db",
  headers: { "Content-type": "application/json" },
});
