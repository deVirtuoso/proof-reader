import React, { useState } from 'react';
import Hero from './components/Hero';
import WhyUs from './components/WhyUs';
import WhatYouGet from './components/WhatYouGet';
import Pricing from './components/Pricing';
import SubmissionPortal from './components/SubmissionPortal';
import PaymentPortal from './components/PaymentPortal';

function App() {
  const [showPayment, setShowPayment] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleProceedToPayment = (details) => {
    setOrderDetails(details);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    alert('Payment Successful! We have received your document and will begin proofreading shortly.');
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  return (
    <div className="App">
      <header className="container" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
          Pro<span className="text-gradient">Proof</span>
        </div>
        <nav style={{ display: 'flex', gap: '2rem' }}>
          <a href="#why-us" style={{ fontWeight: '500' }}>Why Us</a>
          <a href="#what-you-get" style={{ fontWeight: '500' }}>Process</a>
          <a href="#pricing" style={{ fontWeight: '500' }}>Pricing</a>
        </nav>
      </header>

      <main>
        <Hero />
        <WhyUs />
        <WhatYouGet />
        <Pricing />
        <SubmissionPortal onProceedToPayment={handleProceedToPayment} />
      </main>

      {showPayment && (
        <PaymentPortal 
          orderDetails={orderDetails} 
          onCancel={handlePaymentCancel}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <footer className="container" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', marginTop: '4rem' }}>
        <p>&copy; {new Date().getFullYear()} ProProof. All rights reserved.</p>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Premium proofreading for those who demand excellence.</p>
      </footer>
    </div>
  );
}

export default App;
