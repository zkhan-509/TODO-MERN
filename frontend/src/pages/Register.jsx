import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.name || form.name.length < 2) errs.name = 'Name must be at least 2 characters'
    if (!form.email) errs.email = 'Email required'
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      toast.success('Account created! Welcome 🎉')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#faf7ee', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ position: 'absolute', top: '10%', right: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(106,158,112,0.08), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="anim-up" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: '#2d2820', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 26 }}>✅</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#2d2820', margin: 0, letterSpacing: '-0.02em' }}>TaskFlow</h1>
          <p style={{ color: '#8a8070', fontSize: 14, marginTop: 4 }}>Your calm productivity companion</p>
        </div>

        <div style={{ background: '#fdfcf7', borderRadius: 20, padding: 32, border: '1.5px solid #f0ead8', boxShadow: '0 8px 48px rgba(45,40,32,0.08)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#2d2820', margin: '0 0 4px' }}>Create account</h2>
          <p style={{ color: '#8a8070', fontSize: 14, marginBottom: 24 }}>Start organizing your tasks today</p>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { name: 'name', label: 'Your Name', type: 'text', placeholder: 'Ali Hassan' },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { name: 'password', label: 'Password', type: 'password', placeholder: '6+ characters' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#5a5040', display: 'block', marginBottom: 6 }}>{label}</label>
                <input name={name} type={type} value={form[name]} onChange={handle} placeholder={placeholder} className={`input-field ${errors[name] ? 'error' : ''}`} />
                {errors[name] && <p style={{ color: '#c0735a', fontSize: 12, marginTop: 4 }}>{errors[name]}</p>}
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 4, padding: 14 }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#8a8070' }}>
            Already have an account? <Link to="/login" style={{ color: '#3a6140', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
