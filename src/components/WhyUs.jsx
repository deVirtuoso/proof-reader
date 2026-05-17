import './WhyUs.css';

const WhyUs = () => {
  return (
    <section id="why-us" className="container animate-fade-in">
      <h2 className="section-title">Why AI Tools <span className="text-gradient">Fail Your Work</span> 🤖❌</h2>
      <div className="grid grid-2">
        
        <div className="glass-card fail-card">
          <div className="emoji-header">📉</div>
          <h3>The AI Blindspot</h3>
          <p>
            AI tools like ChatGPT or Grammarly do not understand <strong>context</strong>. 
            They often hallucinate facts, strip away your unique voice, or make inappropriate synonyms that change the technical meaning of your research. 
            It's a blind rewrite.
          </p>
        </div>

        <div className="glass-card success-card">
          <div className="emoji-header">🧠</div>
          <h3>The Human Advantage</h3>
          <p>
            Our expert proofreaders retain the context of your thesis or master's report. We correct grammar, structure, and flow while keeping your <strong>academic tone</strong> intact. 
            No robotic rewrites—just pristine polishing.
          </p>
        </div>

      </div>
    </section>
  );
};

export default WhyUs;
