import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/about-us" },
        { name: "How it Works", path: "/how-it-works" },
        { name: "FAQ", path: "/faq" },
        { name: "Terms and Conditions", path: "/terms-and-conditions" },
        { name: "Privacy Policy", path: "/privacy-policy" },
      ]
    },
    {
      title: "Join Us",
      links: [
        { name: "Become a Tutor", path: "/tutor" },
        { name: "Find a Tutor", path: "/home" },
      ]
    },
    {
      title: "Contact",
      links: [
        { 
          name: "support@speakin.com", 
          path: "mailto:support@speakin.com",
          icon: <Mail className="w-4 h-4" />
        }
      ]
    }
  ];

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo and Copyright */}
          <div className="col-span-2 md:col-span-1">
            <h3 
              onClick={() => navigate('/')} 
              className="text-xl font-bold text-blue-600 cursor-pointer"
            >
              SpeakIn
            </h3>
            <p className="mt-4 text-sm text-gray-500">
              Learn languages with expert tutors through personalized 1-on-1 sessions.
            </p>
          </div>

          {/* Footer Links */}
          {footerLinks.map((group, idx) => (
            <div key={idx}>
              <h4 className="font-semibold text-gray-900 mb-4">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    {link.icon ? (
                      <a
                        href={link.path}
                        className="text-gray-600 hover:text-blue-600 transition-colors text-sm inline-flex items-center gap-2"
                      >
                        {link.icon}
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} SpeakIn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
