import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, Sparkles, FileText, Users, Globe, CheckCircle2 } from 'lucide-react'
import demoVideo from '../assets/demo.mp4'

const TESTIMONIALS = [
  { name: 'Anjali Mehta', role: 'Executive Director, Asha Foundation', text: 'NarrAIte transformed how we communicate with donors. Stories that used to take a week now take seconds — and they\'re more compelling than ever.', avatar: 'AM' },
  { name: 'Dr. Ravi Kumar', role: 'CSR Head, TechCorp India', text: 'Our annual impact report used to be a 3-month project. With NarrAIte, we generated 200 personalized stories in an afternoon.', avatar: 'RK' },
  { name: 'Priya Singh', role: 'Programme Officer, UN Women India', text: 'The personalization engine is remarkable. Each story feels handcrafted for the specific audience — whether donors, government, or the media.', avatar: 'PS' },
]

const FEATURES = [
  { icon: <Sparkles size={20}/>, title: 'AI Story Generation', desc: 'AI crafts emotionally resonant narratives from your raw impact data in seconds.' },
  { icon: <Users size={20}/>, title: 'Audience Personalization', desc: 'Distinct tones for Donors, Investors, NGOs, Healthcare, Government and Students.' },
  { icon: <FileText size={20}/>, title: 'Multi-format Export', desc: 'Export to PDF, plain text, email-ready copy, or social media snippets instantly.' },
  { icon: <Globe size={20}/>, title: 'Multi-sector Ready', desc: 'Built for NGOs, CSR, Healthcare, Education, Startups and Government bodies.' },
]

const SECTORS = ['NGOs', 'CSR Organizations', 'Healthcare', 'Education', 'Government', 'Startups']

export default function Landing() {
  const navigate = useNavigate()
  const [typed, setTyped] = useState('')
  const fullText = 'Impact Narratives.'

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setTyped(fullText.slice(0, i + 1))
      i++
      if (i >= fullText.length) clearInterval(interval)
    }, 80)
    return () => clearInterval(interval)
  }, [])

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
        <div className="font-display" style={{ fontSize: 22, letterSpacing: '-0.5px' }}>
          Narr<span style={{ color: 'var(--accent3)' }}>AI</span>te
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/auth')}>Sign in</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/auth?mode=signup')}>
            Get started <ArrowRight size={13}/>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        background: 'var(--ink)',
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 40px) clamp(60px, 8vw, 100px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -100, left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(82,183,136,0.06)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', bottom: -80, right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(82,183,136,0.04)', pointerEvents: 'none' }}/>

        <div className="animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(82,183,136,0.12)', border: '1px solid rgba(82,183,136,0.25)',
            borderRadius: 20, padding: '6px 14px', marginBottom: 28,
            fontSize: 12, color: 'var(--accent3)', fontWeight: 500, letterSpacing: '0.5px'
          }}>
            <Sparkles size={12}/> AI-Powered Impact Narratives
          </div>

          <h1 className="font-display" style={{
            fontSize: 'clamp(34px, 7vw, 72px)',
            color: '#fff',
            lineHeight: 1.1,
            marginBottom: 24,
            letterSpacing: '-1.5px'
          }}>
            Turn Impact Data Into<br/>
            <span style={{ color: 'var(--accent3)', fontStyle: 'italic' }}>{typed}<span style={{ opacity: typed.length < fullText.length ? 1 : 0 }}>|</span></span>
          </h1>

          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.55)', maxWidth: 540, margin: '0 auto 36px', lineHeight: 1.7 }}>
            NarrAIte transforms your structured impact data into emotionally resonant, personalized stories — for donors, investors, NGOs, healthcare, and government — at scale.
          </p>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/auth?mode=signup')}>
              Start generating stories <ArrowRight size={16}/>
            </button>
            <button className="btn btn-lg" onClick={() => navigate('/auth')}
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
              Live demo →
            </button>
          </div>

          <div className="stats-row" style={{ marginTop: 44, display: 'flex', gap: 'clamp(16px, 4vw, 40px)', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['500K+', 'Stories Generated'], ['98%', 'Satisfaction Rate'], ['4.2s', 'Avg Generation Time'], ['40+', 'Sectors Served']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div className="font-display" style={{ fontSize: 'clamp(22px, 3vw, 28px)', color: 'var(--accent3)' }}>{val}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTOR BAND */}
      <section style={{ background: 'var(--cream2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: 'var(--ink4)', letterSpacing: '1px', textTransform: 'uppercase' }}>Built for</span>
          {SECTORS.map(s => (
            <span key={s} style={{
              fontSize: 12, fontWeight: 500, color: 'var(--ink3)',
              padding: '4px 12px', borderRadius: 20, background: 'var(--card)',
              border: '1px solid var(--border)'
            }}>{s}</span>
          ))}
        </div>
      </section>

      {/* VIDEO DEMO */}
      <section style={{ padding: 'clamp(48px, 6vw, 80px) clamp(20px, 5vw, 40px)', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-0.8px', marginBottom: 12 }}>
            See it in action
          </h2>
          <p style={{ fontSize: 16, color: 'var(--ink3)', maxWidth: 480, margin: '0 auto' }}>
            From raw impact metrics to a publication-ready story in seconds
          </p>
        </div>

        {/* Video card */}
        <div style={{
          borderRadius: 'var(--r3)',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.14)',
          border: '1px solid var(--border)',
          background: '#0D0D0D',
          position: 'relative',
        }}>
          {/* Green top bar */}
          <div style={{ height: 3, background: 'linear-gradient(90deg, var(--accent3), var(--accent))', width: '100%' }}/>
          {/* Fake window chrome */}
          <div style={{ background: '#1a1a1a', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
            {['#ff5f56','#ffbd2e','#27c93f'].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }}/>
            ))}
            <div style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.5px' }}>
              NarrAIte — Impact Narrative AI
            </div>
          </div>
          <video
            src={demoVideo}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              display: 'block',
              maxHeight: '70vh',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Trust badges below video */}
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginTop: 28 }}>
          {['No credit card required', 'Free to start', 'Secure & private'].map(b => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--ink3)' }}>
              <CheckCircle2 size={14} color="var(--accent3)"/> {b}
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: 'clamp(48px, 6vw, 80px) clamp(20px, 5vw, 40px)', background: 'var(--cream2)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 38px)', letterSpacing: '-0.8px', marginBottom: 12 }}>Everything you need</h2>
            <p style={{ fontSize: 16, color: 'var(--ink3)' }}>Built for scale, designed for impact</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="card card-hover" style={{ animationDelay: `${i * 0.1}s` }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'var(--accentL)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent)', marginBottom: 14
                }}>{f.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: 'var(--ink)' }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'var(--ink3)', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: 'clamp(48px, 6vw, 80px) clamp(20px, 5vw, 40px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 38px)', letterSpacing: '-0.8px', marginBottom: 12 }}>Trusted by impact leaders</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card">
                <div style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>
                  "{t.text}"
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent3), var(--accent))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 600, color: '#fff', flexShrink: 0
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink4)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--ink)', padding: 'clamp(48px, 6vw, 80px) clamp(20px, 5vw, 40px)', textAlign: 'center' }}>
        <h2 className="font-display" style={{ fontSize: 'clamp(28px, 5vw, 44px)', color: '#fff', marginBottom: 16, letterSpacing: '-1px' }}>
          Ready to tell your story?
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 36, maxWidth: 420, margin: '0 auto 36px' }}>
          Join hundreds of organizations generating impact narratives with AI. Free to start, no credit card required.
        </p>
        <button className="btn btn-lg" style={{ background: 'var(--accent3)', color: 'var(--ink)', border: 'none' }}
          onClick={() => navigate('/auth?mode=signup')}>
          Start for free <ArrowRight size={16}/>
        </button>
      </section>

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
            <Link to="/contact" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
