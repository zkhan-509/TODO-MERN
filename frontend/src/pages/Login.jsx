import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.email) errs.email = 'Email required'
    if (!form.password) errs.password = 'Password required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#faf7ee', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ position: 'absolute', top: '15%', left: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(106,158,112,0.08), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(192,115,90,0.06), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="anim-up" style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: '#2d2820', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 26 }}>✅</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#2d2820', margin: 0, letterSpacing: '-0.02em' }}>TaskFlow</h1>
          <p style={{ color: '#8a8070', fontSize: 14, marginTop: 4 }}>Your calm productivity companion</p>
        </div>

        <div style={{ background: '#fdfcf7', borderRadius: 20, padding: '32px', border: '1.5px solid #f0ead8', boxShadow: '0 8px 48px rgba(45,40,32,0.08)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#2d2820', marginBottom: 6, margin: '0 0 4px' }}>Welcome back</h2>
          <p style={{ color: '#8a8070', fontSize: 14, marginBottom: 24 }}>Sign in to your account</p>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#5a5040', display: 'block', marginBottom: 6 }}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" className={`input-field ${errors.email ? 'error' : ''}`} />
              {errors.email && <p style={{ color: '#c0735a', fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#5a5040', display: 'block', marginBottom: 6 }}>Password</label>
              <input name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" className={`input-field ${errors.password ? 'error' : ''}`} />
              {errors.password && <p style={{ color: '#c0735a', fontSize: 12, marginTop: 4 }}>{errors.password}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 4, padding: 14 }}>
              {loading ? <><div className="spinner" style={{ width: 16, height: 16, border: '2px solid rgba(253,252,247,0.3)', borderTopColor: '#fdfcf7', borderRadius: '50%' }} /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#8a8070' }}>
            No account? <Link to="/register" style={{ color: '#3a6140', fontWeight: 600, textDecoration: 'none' }}>Create one →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
