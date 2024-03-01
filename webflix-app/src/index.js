import React from 'react';
import ReactDOM from 'react-dom/client'; 
import './index.css'; 
import App from './App'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { ToastContainer } from 'react-toastify'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* ToastContainer to render toast notifications */}
    <ToastContainer position="bottom-left" autoClose={4000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} draggable  />
  </React.StrictMode>
);
