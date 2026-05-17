import React, { useState } from 'react';
import './Pricing.css';

const Pricing = () => {
  const [wordCount, setWordCount] = useState(1000);

  const NORMAL_RATE = 0.02;
  const EXPRESS_RATE = 0.04;

  const normalPrice = (wordCount * NORMAL_RATE).toFixed(2);
  const expressPrice = (wordCount * EXPRESS_RATE).toFixed(2);

  return (
    <section id="pricing" className="container">
      <h2 className="section-title">Transparent <span className="text-gradient">Pricing</span> 💸</h2>
      <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-muted)' }}>
        A single fixed rate based on word count. No hidden fees. Valid for all paper types.
      </p>

      <div className="calculator-panel glass-panel">
        <h3>Word Count Calculator</h3>
        <input 
          type="range" 
          min="100" 
          max="100000" 
          step="100" 
          value={wordCount} 
          onChange={(e) => setWordCount(e.target.value)}
          className="slider"
        />
        <div className="word-count-display">
          <input 
            type="number" 
            value={wordCount} 
            onChange={(e) => setWordCount(e.target.value)} 
            className="form-control"
            style={{ width: '150px', display: 'inline-block', textAlign: 'center', fontSize: '1.2rem' }}
          />
          <span> Words</span>
        </div>
      </div>

      <div className="grid grid-2 pricing-cards">
        
        <div className="glass-card pricing-card">
          <div className="tier-header">
            <h3>Normal Tier 🐢</h3>
            <span className="turnaround">3-5 Days Turnaround</span>
          </div>
          <div className="price-display">
            <span className="currency">$</span>
            <span className="amount">{normalPrice}</span>
          </div>
          <p className="rate-info">${NORMAL_RATE} per word</p>
          <ul className="pricing-features">
            <li>✅ Full Granular Report</li>
            <li>✅ Context-Aware Edits</li>
            <li>✅ Academic Formatting Check</li>
            <li>❌ Priority Queue</li>
          </ul>
        </div>

        <div className="glass-card pricing-card premium-tier">
          <div className="tier-badge">Most Popular</div>
          <div className="tier-header">
            <h3>Express Tier 🚀</h3>
            <span className="turnaround">24 Hours Turnaround</span>
          </div>
          <div className="price-display">
            <span className="currency">$</span>
            <span className="amount">{expressPrice}</span>
          </div>
          <p className="rate-info">${EXPRESS_RATE} per word</p>
          <ul className="pricing-features">
            <li>✅ Full Granular Report</li>
            <li>✅ Context-Aware Edits</li>
            <li>✅ Academic Formatting Check</li>
            <li>✅ Priority Queue</li>
          </ul>
        </div>

      </div>
    </section>
  );
};

export default Pricing;
