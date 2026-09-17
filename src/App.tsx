import { useState, useEffect } from 'react';
import { useMidnight } from './hooks/useMidnight';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { WorkflowBar } from './components/WorkflowBar';
import { CapabilitiesGrid } from './components/CapabilitiesGrid';
import { DocsSection } from './components/DocsSection';
import { PrivacyBreakdown } from './components/PrivacyBreakdown';
import { WalletConnect } from './components/WalletConnect';
import { AppDashboard } from './components/AppDashboard';
import { PaystubModal, PaystubData } from './components/PaystubModal';
import { Logo } from './components/Logo';

export function App() {
  const {
    wallet,
    privateWitnessValue,
    setPrivateWitnessValue,
    publicCounterState,
    circuitCall,
    connectWallet,
    disconnectWallet,
    executeCircuitCall,
    checkWalletInstalled,
  } = useMidnight();

  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
  const [paystubData, setPaystubData] = useState<PaystubData | null>(null);
  const [isPaystubOpen, setIsPaystubOpen] = useState(false);

  const isWalletInstalled = checkWalletInstalled();

  // Sync with browser URL hash for direct links (#app or #terminal)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#app' || hash === '#terminal') {
        setCurrentView('app');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#home' || hash === '') {
        setCurrentView('landing');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToApp = () => {
    window.location.hash = '#app';
    setCurrentView('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLanding = () => {
    window.location.hash = '';
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPaystub = (data: PaystubData) => {
    setPaystubData(data);
    setIsPaystubOpen(true);
  };

  const handleClosePaystub = () => {
    setIsPaystubOpen(false);
  };

  // ----------------------------------------------------------------------
  // VIEW 1: DEDICATED TRANSACTION APP DASHBOARD (ENDPOINT / SURFACE B)
  // ----------------------------------------------------------------------
  if (currentView === 'app') {
    return (
      <>
        <AppDashboard
          wallet={wallet}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
          isWalletInstalled={isWalletInstalled}
          privateWitnessValue={privateWitnessValue}
          onWitnessChange={setPrivateWitnessValue}
          publicCounterState={publicCounterState}
          circuitState={circuitCall}
          onExecute={executeCircuitCall}
          onOpenPaystub={handleOpenPaystub}
          onBackToWebsite={navigateToLanding}
        />

        {/* Certified ZK Paystub Modal */}
        <PaystubModal
          isOpen={isPaystubOpen}
          onClose={handleClosePaystub}
          data={paystubData}
        />
      </>
    );
  }

  // ----------------------------------------------------------------------
  // VIEW 2: PUBLIC MARKETING & ARCHITECTURE WEBSITE (SURFACE A)
  // ----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[var(--canvas)] text-slate-100 flex flex-col font-sans">
      {/* Sticky Modern SaaS Top Navbar */}
      <Navbar
        wallet={wallet}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
        onLaunchApp={navigateToApp}
      />

      {/* Main Page Layout Container */}
      <main className="flex-1 w-full flex flex-col items-center overflow-x-hidden">
        {/* 1. Hero Section with Faceted Shield Vibe, Catchphrase & CTAs */}
        <HeroSection
          onConnectClick={connectWallet}
          isConnected={wallet.isConnected}
          onLaunchApp={navigateToApp}
        />

        {/* 2. Main Sections Container */}
        <div className="w-full max-w-6xl mx-auto px-5 sm:px-6">
          {/* About Section */}
          <AboutSection />

          {/* Guided 4-Step Process & Cryptographic Lifecycle */}
          <section id="how-it-works" className="py-20 scroll-mt-20">
            <WorkflowBar
              isConnected={wallet.isConnected}
              hasWitnessValue={Boolean(privateWitnessValue)}
              isConfirmed={circuitCall.stage === 'confirmed'}
            />
          </section>

          {/* Wallet Modal / Connection Box (if disconnected on landing page) */}
          {!wallet.isConnected && (
            <div className="w-full">
              <WalletConnect
                wallet={wallet}
                onConnect={connectWallet}
                onDisconnect={disconnectWallet}
                isWalletInstalled={isWalletInstalled}
              />
            </div>
          )}

          {/* 3. Enterprise Capabilities Grid */}
          <section id="capabilities" className="scroll-mt-20">
            <CapabilitiesGrid />
          </section>

          {/* 4. Interactive Developer Documentation Hub */}
          <DocsSection />

          {/* 5. Security & Privacy Transparency Comparison */}
          <section id="security" className="scroll-mt-20">
            <PrivacyBreakdown />
          </section>
        </div>
      </main>

      {/* Certified ZK Paystub Modal */}
      <PaystubModal
        isOpen={isPaystubOpen}
        onClose={handleClosePaystub}
        data={paystubData}
      />

      {/* Modern SaaS Footer */}
      <footer className="mt-24 w-full border-t border-[var(--border)] bg-[var(--surface-1)] px-6 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <Logo size={34} showText={true} />
          <p className="text-xs text-slate-400">
            Vansidian • Enterprise Zero-Knowledge State & Audit Engine • Built natively for Midnight Network
          </p>
          <div className="flex items-center gap-5 text-xs font-semibold text-slate-400">
            <a href="#about" className="hover:text-purple-400 transition-colors">About</a>
            <a href="#how-it-works" className="hover:text-purple-400 transition-colors">How It Works</a>
            <button onClick={navigateToApp} className="hover:text-purple-400 transition-colors cursor-pointer">
              Workspace
            </button>
            <a href="#documentation" className="hover:text-purple-400 transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
