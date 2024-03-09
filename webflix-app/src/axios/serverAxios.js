import axios from "axios";

const serverAxios = axios.create({
    baseURL: 'webflix-app.vercel.app' 
  });

  export default serverAxios;