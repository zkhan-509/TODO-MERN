import { useState } from 'react'

const PRIORITY_CONFIG = {
  high:   { label: 'High',   color: '#c0735a', bg: '#faf0ed', dot: '#c0735a' },
  medium: { label: 'Medium', color: '#c9a84c', bg: '#fef9ec', dot: '#c9a84c' },
  low:    { label: 'Low',    color: '#6a9e70', bg: '#e8f0e9', dot: '#6a9e70' },
}

export default function TodoCard({ todo, onToggle, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false)
  const p = PRIORITY_CONFIG[todo.priority] || PRIORITY_CONFIG.medium

  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date()
  const dueText = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null

  const handleDelete = async () => {
    setDeleting(true)
    try { await onDelete(todo._id) } catch { setDeleting(false) }
  }

  return (
    <div className={`todo-card anim-slide ${todo.completed ? 'completed-card' : ''}`} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      {/* Priority stripe */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: p.dot, borderRadius: '16px 0 0 16px' }} />

      {/* Checkbox */}
      <button onClick={() => onToggle(todo._id, !todo.completed)} className={`check-box ${todo.completed ? 'checked' : ''}`} style={{ marginTop: 2, marginLeft: 8 }}>
        {todo.completed && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fdfcf7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </button>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 15, fontWeight: 600, color: todo.completed ? '#b8ad98' : '#2d2820',
            textDecoration: todo.completed ? 'line-through' : 'none', lineHeight: 1.4, flex: 1,
          }}>{todo.title}</span>
        </div>

        {todo.description && (
          <p style={{ fontSize: 13, color: '#8a8070', marginTop: 4, lineHeight: 1.5, margin: '4px 0 0' }}>{todo.description}</p>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="tag" style={{ background: p.bg, color: p.color }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.dot, display: 'inline-block' }} />
            {p.label}
          </span>
          {todo.category && todo.category !== 'General' && (
            <span className="tag" style={{ background: '#f0ead8', color: '#8a8070' }}>📁 {todo.category}</span>
          )}
          {dueText && (
            <span className="tag" style={{ background: isOverdue ? '#faf0ed' : '#f0ead8', color: isOverdue ? '#c0735a' : '#8a8070' }}>
              {isOverdue ? '⚠️' : '📅'} {dueText}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        <button onClick={() => onEdit(todo)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 8px', borderRadius: 8, color: '#b8ad98', fontSize: 15, transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f0ead8'; e.currentTarget.style.color = '#5a5040' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#b8ad98' }}
        >✏️</button>
        <button onClick={handleDelete} disabled={deleting} style={{ background: 'transparent', border: 'none', cursor: deleting ? 'not-allowed' : 'pointer', padding: '6px 8px', borderRadius: 8, color: '#b8ad98', fontSize: 15, transition: 'all 0.2s', opacity: deleting ? 0.5 : 1 }}
          onMouseEnter={e => { e.currentTarget.style.background = '#faf0ed'; e.currentTarget.style.color = '#c0735a' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#b8ad98' }}
        >🗑️</button>
      </div>
    </div>
  )
}
