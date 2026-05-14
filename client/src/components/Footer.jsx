import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-dark-surface border-t border-white/10 pt-16 pb-8 px-6 mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="space-y-6">
                    <Link to="/" className="text-2xl font-serif font-bold">
                        Job<span className="text-gold">Check</span>
                    </Link>
                    <p className="text-gray-400 leading-relaxed">
                        Connecting professionals with their dream careers through a transparent recruitment experience.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-gold transition-colors p-2 bg-white/5 rounded-full"><Twitter size={20} /></a>
                        <a href="#" className="hover:text-gold transition-colors p-2 bg-white/5 rounded-full"><Linkedin size={20} /></a>
                        <a href="#" className="hover:text-gold transition-colors p-2 bg-white/5 rounded-full"><Facebook size={20} /></a>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-serif font-bold mb-6 text-gold">For Candidates</h4>
                    <ul className="space-y-4 text-gray-400">
                        <li><Link to="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
                        <li><Link to="/dashboard" className="hover:text-white transition-colors">Candidate Dashboard</Link></li>
                        <li><Link to="/register" className="hover:text-white transition-colors">Job Alerts</Link></li>
                        <li><Link to="#" className="hover:text-white transition-colors">Career Advice</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-serif font-bold mb-6 text-gold">For Employers</h4>
                    <ul className="space-y-4 text-gray-400">
                        <li><Link to="/post-job" className="hover:text-white transition-colors">Post a Job</Link></li>
                        <li><Link to="/dashboard" className="hover:text-white transition-colors">Employer Dashboard</Link></li>
                        <li><Link to="#" className="hover:text-white transition-colors">Recruitment Solutions</Link></li>
                        <li><Link to="#" className="hover:text-white transition-colors">Pricing Plans</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-serif font-bold mb-6 text-gold">Contact Us</h4>
                    <ul className="space-y-4 text-gray-400">
                        <li className="flex items-center gap-3"><Mail size={18} className="text-gold" /> support@jobcheck.com</li>
                        <li className="flex items-center gap-3"><Phone size={18} className="text-gold" /> +1 (555) 123-4567</li>
                        <li className="flex items-center gap-3"><MapPin size={18} className="text-gold" /> 123 Career Blvd, Suite 100</li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                <p>© 2026 JobCheck. All rights reserved.</p>
                <div className="flex gap-8">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-white transition-colors">Cookies Settings</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
