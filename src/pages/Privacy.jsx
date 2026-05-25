import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield } from 'lucide-react'

export default function Privacy() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(250,250,247,0.92)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 60
      }}>
        <Link to="/" className="font-display" style={{ fontSize: 22, letterSpacing: '-0.5px', textDecoration: 'none', color: 'var(--ink)' }}>
          Narr<span style={{ color: 'var(--accent3)' }}>AI</span>te
        </Link>
        <Link to="/" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
          <ArrowLeft size={14}/> Back to Home
        </Link>
      </nav>

      {/* CONTENT */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px, 6vw, 80px) 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'var(--accentL)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)'
          }}>
            <Shield size={24}/>
          </div>
          <div>
            <h1 className="font-display" style={{ fontSize: 32, letterSpacing: '-0.8px', margin: 0 }}>Privacy Policy</h1>
            <p style={{ fontSize: 13, color: 'var(--ink4)', margin: '4px 0 0' }}>Last updated: May 2025</p>
          </div>
        </div>

        <div className="card" style={{ lineHeight: 1.8, fontSize: 14, color: 'var(--ink2)' }}>
          <h2 style={{ fontSize: 18, color: 'var(--ink)', marginBottom: 12 }}>1. Information We Collect</h2>
          <p style={{ marginBottom: 20 }}>
            We collect information you provide directly to us, such as when you create an account, use our services, or contact us. This may include your name, email address, organization name, and impact data you upload for story generation.
          </p>

          <h2 style={{ fontSize: 18, color: 'var(--ink)', marginBottom: 12 }}>2. How We Use Your Information</h2>
          <p style={{ marginBottom: 20 }}>
            We use the information we collect to provide, maintain, and improve our services, to process your requests for AI-generated impact narratives, and to communicate with you about updates and new features.
          </p>

          <h2 style={{ fontSize: 18, color: 'var(--ink)', marginBottom: 12 }}>3. Data Storage & Security</h2>
          <p style={{ marginBottom: 20 }}>
            Your data is stored securely and we implement appropriate technical and organizational measures to protect your personal information. Impact data uploaded for story generation is processed in real-time and is not stored permanently on our servers unless you explicitly save generated narratives.
          </p>

          <h2 style={{ fontSize: 18, color: 'var(--ink)', marginBottom: 12 }}>4. Third-Party Services</h2>
          <p style={{ marginBottom: 20 }}>
            We use third-party AI services to generate narratives from your data. Your impact data is sent to these services solely for the purpose of generating stories and is not used to train AI models or shared with other parties.
          </p>

          <h2 style={{ fontSize: 18, color: 'var(--ink)', marginBottom: 12 }}>5. Your Rights</h2>
          <p style={{ marginBottom: 20 }}>
            You have the right to access, update, or delete your personal information at any time. You may also request a copy of the data we hold about you. To exercise any of these rights, please contact us.
          </p>

          <h2 style={{ fontSize: 18, color: 'var(--ink)', marginBottom: 12 }}>6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:anushkatiwariofficial@gmail.com" style={{ color: 'var(--accent3)', fontWeight: 500 }}>
              anushkatiwariofficial@gmail.com
            </a>
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: 'var(--ink)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px clamp(20px, 5vw, 40px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          <div className="font-display" style={{ fontSize: 18, color: '#fff' }}>
            Narr<span style={{ color: 'var(--accent3)' }}>AI</span>te
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
            Built with ❤️ by Anushka Tiwari
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            <Link to="/privacy" style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontWeight: 500 }}>Privacy</Link>
            <Link to="/terms" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Terms</Link>
            <Link to="/contact" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
