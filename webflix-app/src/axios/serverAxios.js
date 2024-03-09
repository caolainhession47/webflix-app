import axios from "axios";

const serverAxios = axios.create({
    baseURL: 'http://localhost:5000' 
  });

  export default serverAxios;