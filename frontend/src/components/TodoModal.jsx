import { useState, useEffect } from 'react'

const PRIORITIES = [
  { value: 'low', label: 'Low', color: '#6a9e70', bg: '#e8f0e9' },
  { value: 'medium', label: 'Medium', color: '#c9a84c', bg: '#fef9ec' },
  { value: 'high', label: 'High', color: '#c0735a', bg: '#faf0ed' },
]

export default function TodoModal({ todo, onClose, onSave }) {
  const [form, setForm] = useState({
    title: '', description: '', priority: 'medium', category: 'General', dueDate: '',
    ...todo,
    dueDate: todo?.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Title is required'); return }
    setLoading(true)
    setError('')
    try {
      await onSave({ ...form, dueDate: form.dueDate || null })
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#2d2820', margin: 0 }}>
            {todo ? 'Edit Task' : 'New Task'}
          </h3>
          <button onClick={onClose} style={{ background: '#f0ead8', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#5a5040' }}>✕</button>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5a5040', display: 'block', marginBottom: 6 }}>Task Title *</label>
            <input name="title" value={form.title} onChange={handle} placeholder="What needs to be done?" className={`input-field ${error ? 'error' : ''}`} autoFocus />
            {error && <p style={{ color: '#c0735a', fontSize: 12, marginTop: 4 }}>{error}</p>}
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5a5040', display: 'block', marginBottom: 6 }}>Description</label>
            <textarea name="description" value={form.description} onChange={handle} placeholder="Add some details..." rows={3} className="input-field" style={{ resize: 'vertical', minHeight: 80 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#5a5040', display: 'block', marginBottom: 6 }}>Priority</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {PRIORITIES.map(p => (
                  <button key={p.value} type="button" onClick={() => setForm(f => ({ ...f, priority: p.value }))} style={{
                    flex: 1, padding: '8px 4px', borderRadius: 10, border: `1.5px solid ${form.priority === p.value ? p.color : '#e8dfc4'}`,
                    background: form.priority === p.value ? p.bg : 'transparent', color: form.priority === p.value ? p.color : '#8a8070',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'all 0.2s',
                  }}>{p.label}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#5a5040', display: 'block', marginBottom: 6 }}>Category</label>
              <input name="category" value={form.category} onChange={handle} placeholder="General" className="input-field" style={{ padding: '10px 14px' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5a5040', display: 'block', marginBottom: 6 }}>Due Date</label>
            <input name="dueDate" type="date" value={form.dueDate} onChange={handle} className="input-field" />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 2 }}>
              {loading ? 'Saving...' : todo ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
