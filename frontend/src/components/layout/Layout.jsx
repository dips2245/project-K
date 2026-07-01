import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AgeVerificationModal from '../ui/AgeVerificationModal';
import WhatsAppButton from '../ui/WhatsAppButton';
import ChatBot from '../ui/ChatBot';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
            <AgeVerificationModal />
            <Navbar />
            <main className="flex-1 pt-16 lg:pt-18">
                <Outlet />
            </main>
            <Footer />
            <WhatsAppButton />
            <ChatBot />
        </div>
    );
};

export default Layout;
