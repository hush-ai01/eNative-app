import { Link } from 'react-router-dom'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700;800&family=Exo+2:wght@300;400;500;600&family=Share+Tech+Mono&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  .landing {
    min-height: 100vh;
    background:
      radial-gradient(circle at top, rgba(192,132,252,0.12), transparent 38%),
      radial-gradient(circle at bottom right, rgba(96,216,250,0.08), transparent 30%),
      #050507;
    color: rgba(255,255,255,0.93);
    font-family: 'Exo 2', sans-serif;
    padding: 24px;
  }
  .shell {
    max-width: 1120px;
    margin: 0 auto;
  }
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 10px 0 28px;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .mark {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: linear-gradient(135deg, #c084fc, #60d8fa);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 800;
    font-size: 18px;
    color: #fff;
  }
  .brand-name {
    font-family: 'Rajdhani', sans-serif;
    font-size: 24px;
    font-weight: 800;
  }
  .brand-name span { color: #c084fc; }
  .hero {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 24px;
    align-items: stretch;
    padding: 36px 0 28px;
  }
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.22em;
    color: rgba(255,255,255,0.34);
    margin-bottom: 18px;
  }
  .eyebrow::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #6ee7b7;
    box-shadow: 0 0 10px rgba(110,231,183,0.7);
  }
  .title {
    font-family: 'Rajdhani', sans-serif;
    font-size: clamp(44px, 7vw, 84px);
    line-height: 0.95;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin: 0 0 18px;
  }
  .title span { color: #60d8fa; }
  .sub {
    max-width: 620px;
    color: rgba(255,255,255,0.58);
    font-size: 16px;
    line-height: 1.8;
    margin-bottom: 28px;
  }
  .cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 24px;
  }
  .cta {
    text-decoration: none;
    border-radius: 14px;
    padding: 14px 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 170px;
    transition: transform 0.18s ease, opacity 0.18s ease, border-color 0.18s ease;
  }
  .cta:hover { transform: translateY(-1px); }
  .cta.primary {
    background: linear-gradient(135deg, #c084fc, #60d8fa);
    color: #050507;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 700;
    letter-spacing: 0.08em;
  }
  .cta.secondary {
    border: 1px solid #22242f;
    color: rgba(255,255,255,0.72);
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.18em;
  }
  .stat-row {
    display: flex;
    gap: 28px;
    flex-wrap: wrap;
  }
  .stat-value {
    font-family: 'Rajdhani', sans-serif;
    font-size: 34px;
    font-weight: 800;
    line-height: 1;
  }
  .stat-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.18em;
    color: rgba(255,255,255,0.34);
    margin-top: 6px;
  }
  .panel {
    background: rgba(12,13,18,0.9);
    border: 1px solid #1b1d27;
    border-radius: 26px;
    padding: 26px;
    position: relative;
    overflow: hidden;
  }
  .panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top right, rgba(192,132,252,0.12), transparent 42%);
    pointer-events: none;
  }
  .panel-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.18em;
    color: rgba(255,255,255,0.32);
    margin-bottom: 18px;
  }
  .card {
    border-radius: 18px;
    border: 1px solid #242734;
    background: #08090d;
    padding: 18px;
    margin-bottom: 14px;
  }
  .card-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .card-copy {
    color: rgba(255,255,255,0.52);
    font-size: 14px;
    line-height: 1.7;
  }
  .pill-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .pill {
    border-radius: 16px;
    border: 1px solid #242734;
    background: #08090d;
    padding: 16px;
  }
  .pill h3 {
    font-family: 'Rajdhani', sans-serif;
    font-size: 18px;
    margin: 0 0 6px;
  }
  .pill p {
    margin: 0;
    color: rgba(255,255,255,0.48);
    font-size: 13px;
    line-height: 1.6;
  }
  .flow {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-top: 20px;
  }
  .step {
    border: 1px solid #20222d;
    background: rgba(8,9,13,0.88);
    border-radius: 16px;
    padding: 16px;
  }
  .step-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.18em;
    color: #60d8fa;
    margin-bottom: 8px;
  }
  .step-name {
    font-family: 'Rajdhani', sans-serif;
    font-size: 19px;
    font-weight: 700;
    margin-bottom: 6px;
  }
  .step-copy {
    color: rgba(255,255,255,0.46);
    font-size: 13px;
    line-height: 1.65;
  }
  @media (max-width: 900px) {
    .hero { grid-template-columns: 1fr; }
    .flow { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 640px) {
    .landing { padding: 18px; }
    .flow, .pill-grid { grid-template-columns: 1fr; }
    .title { font-size: 48px; }
  }
`

export default function Landing() {
  return (
    <>
      <style>{css}</style>
      <div className="landing">
        <div className="shell">
          <div className="nav">
            <div className="brand">
              <div className="mark">en</div>
              <div className="brand-name">e<span>Native</span></div>
            </div>
            <Link className="cta secondary" to="/login">LOGIN</Link>
          </div>

          <div className="hero">
            <div>
              <div className="eyebrow">PERMANENT DIGITAL IDENTITY</div>
              <h1 className="title">One eNumber.<br />Every border.<br /><span>Forever yours.</span></h1>
              <p className="sub">
                eNative starts every user in a clear flow: discover the product, sign in, claim an eNumber,
                then enter the dashboard. No more black startup screen before the app knows who you are.
              </p>
              <div className="cta-row">
                <Link className="cta primary" to="/login">GET STARTED</Link>
                <a className="cta secondary" href="#flow">SEE THE FLOW</a>
              </div>
              <div className="stat-row">
                <div>
                  <div className="stat-value">4</div>
                  <div className="stat-label">CLEAR STEPS</div>
                </div>
                <div>
                  <div className="stat-value">1</div>
                  <div className="stat-label">PERMANENT ENUMBER</div>
                </div>
                <div>
                  <div className="stat-value">0</div>
                  <div className="stat-label">BLACK SCREEN DEAD ENDS</div>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-label">WHY THIS FLOW WORKS</div>
              <div className="card">
                <div className="card-title">Public first impression</div>
                <div className="card-copy">
                  The landing page is now public, so the app never blocks new visitors behind auth loading.
                </div>
              </div>
              <div className="pill-grid">
                <div className="pill">
                  <h3>Login</h3>
                  <p>Auth screen handles sign in and sign up without routing confusion.</p>
                </div>
                <div className="pill">
                  <h3>Claim</h3>
                  <p>Users without an eNumber are guided into setup automatically.</p>
                </div>
                <div className="pill">
                  <h3>Dashboard</h3>
                  <p>Only claimed accounts enter the protected app shell.</p>
                </div>
                <div className="pill">
                  <h3>Resilient auth</h3>
                  <p>Profile loading failures no longer leave the UI hanging forever.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flow" id="flow">
            <div className="step">
              <div className="step-num">STEP 01</div>
              <div className="step-name">Landing</div>
              <div className="step-copy">Public product entry at the root route.</div>
            </div>
            <div className="step">
              <div className="step-num">STEP 02</div>
              <div className="step-name">Login</div>
              <div className="step-copy">Users authenticate before touching protected app routes.</div>
            </div>
            <div className="step">
              <div className="step-num">STEP 03</div>
              <div className="step-name">Claim eNumber</div>
              <div className="step-copy">Unclaimed users are redirected into setup until their profile is complete.</div>
            </div>
            <div className="step">
              <div className="step-num">STEP 04</div>
              <div className="step-name">Dashboard</div>
              <div className="step-copy">The main app now lives at a dedicated protected route.</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
