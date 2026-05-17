import { useState } from 'react';
import { createOrder } from '../api/client';
import './SubmissionPortal.css';

const SubmissionPortal = ({ onProceedToPayment }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notes: '',
    file: null,
    tier: 'normal',
    wordCount: 1000
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const NORMAL_RATE = 0.02;
  const EXPRESS_RATE = 0.04;

  const calculateTotal = () => {
    const rate = formData.tier === 'express' ? EXPRESS_RATE : NORMAL_RATE;
    return (formData.wordCount * rate).toFixed(2);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!formData.name || !formData.email) {
      alert("Name and Email are mandatory.");
      return;
    }
    if (!formData.file) {
      alert("Please upload a document to proofread.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { order } = await createOrder({
        name: formData.name,
        email: formData.email,
        notes: formData.notes,
        tier: formData.tier,
        wordCount: formData.wordCount,
        file: formData.file,
      });

      onProceedToPayment({
        id: order.id,
        name: order.name,
        email: order.email,
        notes: order.notes,
        tier: order.tier,
        wordCount: order.wordCount,
        totalCost: order.totalCost,
        originalFileName: order.originalFileName,
      });
    } catch (err) {
      setSubmitError(err.message || 'Could not submit your order. Is the local API running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="submission" className="container">
      <div className="submission-wrapper glass-panel">
        <div className="submission-info">
          <h2>Ready to <span className="text-gradient">Shine?</span> 🌟</h2>
          <p>
            Upload your document, give us any specific instructions, and select your tier. 
            We'll handle the rest.
          </p>
          <ul className="security-badges">
            <li>🔒 256-bit Secure Upload</li>
            <li>🤫 Strict Confidentiality</li>
            <li>💳 Safe & Secure Checkout</li>
          </ul>
        </div>

        <div className="submission-form-container">
          <form onSubmit={handleSubmit} className="submission-form">
            
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Dr. Jane Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="jane@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Upload Document * (Word, PDF, txt)</label>
              <div className="file-upload-area">
                <input 
                  type="file" 
                  id="file" 
                  className="file-input" 
                  onChange={handleFileChange}
                  accept=".doc,.docx,.pdf,.txt"
                />
                <label htmlFor="file" className="file-label">
                  <span className="upload-icon">📁</span>
                  {formData.file ? formData.file.name : "Click to browse or drag & drop"}
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Word Count</label>
              <input 
                type="number" 
                className="form-control" 
                value={formData.wordCount}
                onChange={(e) => setFormData({...formData, wordCount: e.target.value})}
                min="100"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Service Tier</label>
              <div className="tier-selector">
                <label className={`tier-option ${formData.tier === 'normal' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="tier" 
                    value="normal"
                    checked={formData.tier === 'normal'}
                    onChange={() => setFormData({...formData, tier: 'normal'})}
                  />
                  <span>🐢 Normal (3-5 Days)</span>
                </label>
                <label className={`tier-option ${formData.tier === 'express' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="tier" 
                    value="express"
                    checked={formData.tier === 'express'}
                    onChange={() => setFormData({...formData, tier: 'express'})}
                  />
                  <span>🚀 Express (24h)</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes for the Editor (Optional)</label>
              <textarea 
                className="form-control" 
                rows="3" 
                placeholder="e.g., Please focus on academic tone and US English spelling."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              ></textarea>
            </div>

            <div className="total-calculator">
              <span>Total Estimated Cost:</span>
              <span className="total-price">${calculateTotal()}</span>
            </div>

            {submitError && (
              <p className="form-error" role="alert">{submitError}</p>
            )}

            <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Uploading... ⏳' : 'Proceed to Secure Payment 💳'}
            </button>

          </form>
        </div>
      </div>
    </section>
  );
};

export default SubmissionPortal;
