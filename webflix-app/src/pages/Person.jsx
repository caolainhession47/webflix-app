import React, { useState, useEffect } from "react";
import Actor from "../components/Actor";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Person() {
  const { personId } = useParams();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <Navbar isScrolled={isScrolled} />
      <Actor personId={personId} />
      <Footer />
    </div>
  );
}
