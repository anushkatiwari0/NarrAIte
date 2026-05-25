import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, MapPin, Clock } from 'lucide-react'

export default function Contact() {
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
            <Mail size={24}/>
          </div>
          <div>
            <h1 className="font-display" style={{ fontSize: 32, letterSpacing: '-0.8px', margin: 0 }}>Contact Us</h1>
            <p style={{ fontSize: 13, color: 'var(--ink4)', margin: '4px 0 0' }}>We'd love to hear from you</p>
          </div>
        </div>

        {/* Contact cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div className="card card-hover" style={{ textAlign: 'center', padding: '32px 20px' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent3), var(--accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', color: '#fff'
            }}>
              <Mail size={22}/>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>Email</div>
            <a href="mailto:anushkatiwariofficial@gmail.com" style={{
              fontSize: 13, color: 'var(--accent3)', fontWeight: 500, textDecoration: 'none',
              wordBreak: 'break-all'
            }}>
              anushkatiwariofficial@gmail.com
            </a>
          </div>

          <div className="card card-hover" style={{ textAlign: 'center', padding: '32px 20px' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent3), var(--accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', color: '#fff'
            }}>
              <Clock size={22}/>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>Response Time</div>
            <p style={{ fontSize: 13, color: 'var(--ink3)', margin: 0 }}>
              We typically respond within 24–48 hours
            </p>
          </div>

          <div className="card card-hover" style={{ textAlign: 'center', padding: '32px 20px' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent3), var(--accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', color: '#fff'
            }}>
              <MapPin size={22}/>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>Location</div>
            <p style={{ fontSize: 13, color: 'var(--ink3)', margin: 0 }}>
              India
            </p>
          </div>
        </div>

        {/* Get in touch section */}
        <div className="card" style={{ lineHeight: 1.8, fontSize: 14, color: 'var(--ink2)' }}>
          <h2 style={{ fontSize: 20, color: 'var(--ink)', marginBottom: 16 }}>Get in Touch</h2>
          <p style={{ marginBottom: 16 }}>
            Whether you have a question about NarrAIte's features, need help with your impact narratives, want to report an issue, or have suggestions for improvement — we're here to help.
          </p>
          <p style={{ marginBottom: 16 }}>
            For any inquiries, reach out to us at:
          </p>
          <div style={{
            background: 'var(--cream2)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 16
          }}>
            <Mail size={18} color="var(--accent3)"/>
            <a href="mailto:anushkatiwariofficial@gmail.com" style={{
              fontSize: 15, color: 'var(--accent3)', fontWeight: 600, textDecoration: 'none'
            }}>
              anushkatiwariofficial@gmail.com
            </a>
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink4)' }}>
            We value every message and will get back to you as soon as possible.
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
            <Link to="/privacy" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Privacy</Link>
            <Link to="/terms" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Terms</Link>
            <Link to="/contact" style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontWeight: 500 }}>Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
