import React from 'react';
import { FaGlobe, FaFlag, FaUsers, FaUserTie, FaBuilding, FaCogs, FaProjectDiagram, 
         FaGraduationCap, FaPlane, FaExchangeAlt, FaNewspaper, FaCalendarAlt, 
         FaEnvelope, FaHandshake, FaMailBulk } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>About</h3>
          <ul>
            <li>
              <a href="https://elixir-europe.org/" target="_blank" rel="noopener noreferrer">
                <FaGlobe className="footer-icon" /> ELIXIR Europe
              </a>
            </li>
            <li>
              <a href="/about">
                <FaFlag className="footer-icon" /> ELIXIR Ireland
              </a>
            </li>
            <li>
              <a href="/leadership">
                <FaUserTie className="footer-icon" /> Leadership
              </a>
            </li>
            <li>
              <a href="/team">
                <FaUsers className="footer-icon" /> Team
              </a>
            </li>
            <li>
              <a href="/member-institutes">
                <FaBuilding className="footer-icon" /> Member Institutes
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>What We Do</h3>
          <ul>
            <li>
              <a href="/services">
                <FaCogs className="footer-icon" /> Services
              </a>
            </li>
            <li>
              <a href="/projects">
                <FaProjectDiagram className="footer-icon" /> Projects
              </a>
            </li>
            <li>
              <a href="/training">
                <FaGraduationCap className="footer-icon" /> Training
              </a>
            </li>
            <li>
              <a href="/travel-grants">
                <FaPlane className="footer-icon" /> Travel Grants
              </a>
            </li>
            <li>
              <a href="/knowledge-exchange">
                <FaExchangeAlt className="footer-icon" /> Knowledge Exchange
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Connect</h3>
          <ul>
            <li>
              <a href="/news">
                <FaNewspaper className="footer-icon" /> News
              </a>
            </li>
            <li>
              <a href="/events">
                <FaCalendarAlt className="footer-icon" /> Events
              </a>
            </li>
            <li>
              <a href="/contact">
                <FaEnvelope className="footer-icon" /> Contact Us
              </a>
            </li>
            <li>
              <a href="/join">
                <FaHandshake className="footer-icon" /> Join ELIXIR Ireland
              </a>
            </li>
            <li>
              <a href="/mailing-lists">
                <FaMailBulk className="footer-icon" /> Join Mailing Lists
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ELIXIR Ireland. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;