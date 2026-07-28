import { Link } from 'react-router';
import {
  HiEnvelope,
  HiPhone,
  HiMapPin,
} from 'react-icons/hi2';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from 'react-icons/fa';

const footerLinks = {
  Company: [
    { label: 'About Us', path: '/about' },
    { label: 'Careers', path: '/careers' },
    { label: 'Blog', path: '/blog' },
    { label: 'Press', path: '/press' },
  ],
  Support: [
    { label: 'Help Center', path: '/help' },
    { label: 'Safety', path: '/safety' },
    { label: 'Cancellation', path: '/cancellation' },
    { label: 'Insurance', path: '/insurance' },
  ],
  'Quick Links': [
    { label: 'Browse Cars', path: '/cars' },
    { label: 'How it Works', path: '/#how-it-works' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Locations', path: '/locations' },
  ],
  Legal: [
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Cookie Policy', path: '/cookies' },
    { label: 'Licenses', path: '/licenses' },
  ],
};

const socialLinks = [
  { icon: FaFacebookF, href: '#', label: 'Facebook' },
  { icon: FaTwitter, href: '#', label: 'Twitter' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
  { icon: FaYoutube, href: '#', label: 'YouTube' },
];

/**
 * Premium multi-column footer with links, social icons, and contact info.
 */
export default function Footer() {
  return (
    <footer className="bg-surface-950 border-t border-surface-800/50">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">DF</span>
              </div>
              <span className="text-xl font-heading font-bold text-surface-100">
                Drive<span className="text-primary-400">Fleet</span>
              </span>
            </Link>
            <p className="text-surface-400 text-sm leading-relaxed mb-6 max-w-xs">
              Premium car rental experience. Choose from our curated fleet of
              luxury, sport, and comfort vehicles. Drive your dream car today.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:hello@drivefleet.com"
                className="flex items-center gap-3 text-sm text-surface-400 hover:text-primary-400 transition-colors"
              >
                <HiEnvelope className="h-4 w-4" />
                hello@drivefleet.com
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-3 text-sm text-surface-400 hover:text-primary-400 transition-colors"
              >
                <HiPhone className="h-4 w-4" />
                +1 (234) 567-890
              </a>
              <p className="flex items-center gap-3 text-sm text-surface-400">
                <HiMapPin className="h-4 w-4" />
                San Francisco, CA
              </p>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-surface-100 uppercase tracking-wider mb-4">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-surface-400 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-surface-500">
              © {new Date().getFullYear()} DriveFleet. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 rounded-lg text-surface-500 hover:text-primary-400 hover:bg-surface-800/50 transition-all"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
