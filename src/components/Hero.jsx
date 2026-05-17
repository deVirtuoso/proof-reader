import React from 'react';
import './Hero.css';

const Hero = () => {
  const scrollToSubmit = () => {
    document.getElementById('submission').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero container animate-fade-in">
      <div className="hero-content">
        <h1 className="hero-title">
          Flawless Papers. <br />
          <span className="text-gradient">Zero AI Hallucinations.</span> 🎓✨
        </h1>
        <p className="hero-subtitle">
          Premium human proofreading for Reports, Theses, Books, Master's, and Diplomas. 
          We don't just rewrite—we give you a granular roadmap to perfection. 
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={scrollToSubmit}>
            Submit Your Document 🚀
          </button>
          <a href="#pricing" className="btn btn-outline" style={{ marginLeft: '1rem' }}>
            View Pricing 💰
          </a>
        </div>
        
        <div className="hero-tags">
          <span className="hero-tag">✅ Context-Aware</span>
          <span className="hero-tag">✅ Exact Change Locations</span>
          <span className="hero-tag">✅ Native Quality</span>
        </div>
      </div>
      <div className="hero-visual">
        <div className="glass-card premium-card">
          <div className="card-header">
            <span className="emoji-large">💎</span>
            <h3>Premium Review</h3>
          </div>
          <div className="card-body">
            <p><strong>Status:</strong> Awaiting your masterpiece...</p>
            <div className="pulse-bar"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
