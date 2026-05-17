import React from 'react';
import './WhatYouGet.css';

const WhatYouGet = () => {
  return (
    <section id="what-you-get" className="container">
      <div className="wyg-container glass-panel">
        <div className="wyg-content">
          <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            What You <span className="text-gradient">Actually Get</span> 🎯
          </h2>
          <p className="wyg-description">
            We don’t just return a modified file where you can't see what changed. 
            You receive a <strong>Granular Action Report</strong> detailing exact locations, 
            the reason for the change, and the professional recommendation.
          </p>
          
          <ul className="wyg-list">
            <li><span>📍</span> <strong>Exact Locations:</strong> Page, Paragraph, and Line numbers.</li>
            <li><span>🔍</span> <strong>Contextual Fixes:</strong> Why a phrase doesn't work for your audience.</li>
            <li><span>✨</span> <strong>Polished Vocabulary:</strong> Upgraded terminology for academic/professional rigor.</li>
            <li><span>📊</span> <strong>Formatting Checks:</strong> Consistency in citations and layouts.</li>
          </ul>
        </div>
        
        <div className="wyg-visual">
          <div className="mock-report">
            <div className="report-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
              <span className="report-title">Granular_Report_Final.pdf</span>
            </div>
            <div className="report-body">
              <div className="report-item">
                <span className="badge badge-express">Pg 4, Para 2</span>
                <p><strong>Original:</strong> "The data is very bad..."</p>
                <p><strong>Correction:</strong> "The data indicates a significant anomaly..."</p>
                <p className="report-reason"><em>Reason: 'Very bad' lacks academic precision.</em></p>
              </div>
              <div className="report-item">
                <span className="badge badge-express">Pg 12, Line 4</span>
                <p><strong>Original:</strong> "He said that..."</p>
                <p><strong>Correction:</strong> "The author posited that..."</p>
                <p className="report-reason"><em>Reason: Improves authoritative tone.</em></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatYouGet;
