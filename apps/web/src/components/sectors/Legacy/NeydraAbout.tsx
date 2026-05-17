'use client';
import React, { useEffect } from 'react';

export function NeydraAbout() {
    return (
        <div className="neydra-legacy-container h-full w-full relative overflow-y-auto overflow-x-hidden bg-black text-white">
            <style dangerouslySetInnerHTML={{ __html: `
                
    ::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }
  
            `}} />
            
            



  {/* <script src="/js/security.js"></script> */}
  <meta charSet="UTF-8" />
  <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://cdn.jsdelivr.net/npm/remixicon@3.0.0/fonts/remixicon.css" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css" />
  <link rel="icon" href="/assets/icon.png" type="image/png" />
  <link rel="manifest" href="/manifest.json" />
  <title>About | NEYDRA™</title>
  




  <header>
    <div className="section__container header__container">
      <br /><br />
      <br /><br />
      <br /><br />
      <h1>
        About NEYDRA</h1>
      <p>Welcome to NEYDRA – Where Imagination Becomes Reality. We are dedicated to breaking limits and reshaping
        reality itself<br /><br />
        <strong> The Founder : </strong> ILYES JARRAY.
      </p>
    </div>

    {/* 🔹 شريط التنقل السفلي في وسط الهيدر */}
    <nav className="bottom-nav">
      <ul>
        <li>
          <a href="/welcome/home"><img src="/assets/home-icon.png" alt="Home" /></a>
        </li>
        <li>
          <a href="/welcome/about"><img src="/assets/about-icon.png" alt="About" /></a>
        </li>
        <li>
          <a href="/welcome/nexhub"><img src="/assets/neydra-icon.png" alt="Neydra" /></a>
        </li>
        <li><a href="/welcome/exchange"><img src="/assets/switch-icon.png" alt="Exchange" /></a></li>
      </ul>
    </nav>
  </header>

  {/* Elfsight Poll */}
  {/* <script src="https://static.elfsight.com/platform/platform.js" async></script> */}
  <div className="elfsight-app-f0694651-f050-4245-909a-6b38d447d146" data-elfsight-app-lazy></div>

  <footer>
    <div className="section__container footer__container">
      <div className="footer__content">
        <h2>Contact Us</h2>
        <p>Reach out through our contact page or social media channels.</p>
        <div className="social__icons">
          <a href="https://www.facebook.com/share/1DeEz6XT3E/" className="icon"><i className="ri-facebook-fill"></i></a>
          <a href="https://www.instagram.com/neydra_org" className="icon"><i className="ri-instagram-fill"></i></a>
        </div>
      </div>
    </div>
  </footer>

  {/* <script type="text/javascript" src="/scripts.js"></script> */}
  {/* <script src="/js/auth.js"></script> */}



        </div>
    );
}
