import React from "react";

function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800 mt-16">
      
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Text */}
        <p className="text-slate-400 text-sm text-center md:text-left">
          © {new Date().getFullYear()} AI Study Assistant. All rights reserved.
        </p>

        {/* Website Link */}
        <a
          href="https://yasirhamid.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition"
        >
          YasirHamid.in
        </a>

      </div>

    </footer>
  );
}

export default Footer;