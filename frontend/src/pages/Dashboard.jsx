import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import TodoCard from '../components/TodoCard'
import TodoModal from '../components/TodoModal'
import toast from 'react-hot-toast'

const TABS = ['all', 'active', 'completed']

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [todos, setTodos] = useState([])
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, highPriority: 0 })
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editTodo, setEditTodo] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const fetchTodos = useCallback(async () => {
    try {
      const params = {}
      if (tab === 'active') params.completed = false
      if (tab === 'completed') params.completed = true
      if (search.trim()) params.search = search.trim()
      if (filterPriority) params.priority = filterPriority
      const res = await api.get('/todos', { params })
      setTodos(res.data)
    } catch { toast.error('Failed to load todos') }
  }, [tab, search, filterPriority])

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/todos/stats/summary')
      setStats(res.data)
    } catch {}
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchTodos(), fetchStats()]).finally(() => setLoading(false))
  }, [fetchTodos, fetchStats])

  const handleSave = async (data) => {
    if (editTodo) {
      const res = await api.put(`/todos/${editTodo._id}`, data)
      setTodos(ts => ts.map(t => t._id === editTodo._id ? res.data : t))
      toast.success('Task updated!')
    } else {
      const res = await api.post('/todos', data)
      setTodos(ts => [res.data, ...ts])
      toast.success('Task added!')
    }
    fetchStats()
  }

  const handleToggle = async (id, completed) => {
    try {
      const res = await api.put(`/todos/${id}`, { completed })
      setTodos(ts => ts.map(t => t._id === id ? res.data : t))
      if (completed) toast.success('Task completed! 🎉')
      fetchStats()
    } catch { toast.error('Failed to update') }
  }

  const handleDelete = async (id) => {
    await api.delete(`/todos/${id}`)
    setTodos(ts => ts.filter(t => t._id !== id))
    toast.success('Task deleted')
    fetchStats()
  }

  const clearCompleted = async () => {
    if (!window.confirm('Clear all completed tasks?')) return
    try {
      await api.delete('/todos/bulk/completed')
      setTodos(ts => ts.filter(t => !t.completed))
      fetchStats()
      toast.success('Cleared completed tasks')
    } catch { toast.error('Failed to clear') }
  }

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'
  const percent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <div style={{ minHeight: '100vh', background: '#faf7ee' }}>
      {/* Header */}
      <header style={{ background: '#fdfcf7', borderBottom: '1.5px solid #f0ead8', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: '#2d2820', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✅</div>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#2d2820', letterSpacing: '-0.02em' }}>TaskFlow</span>
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowUserMenu(m => !m)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0ead8', border: 'none', borderRadius: 99, padding: '6px 14px 6px 6px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#e8dfc4'}
              onMouseLeave={e => e.currentTarget.style.background = '#f0ead8'}
            >
              <div style={{ width: 28, height: 28, background: '#3a6140', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fdfcf7' }}>{initials}</div>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#5a5040' }}>{user?.name?.split(' ')[0]}</span>
            </button>
            {showUserMenu && (
              <div className="anim-up" style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: '#fdfcf7', border: '1.5px solid #f0ead8', borderRadius: 14, padding: 8, minWidth: 180, boxShadow: '0 12px 40px rgba(45,40,32,0.12)', zIndex: 100 }}>
                <div style={{ padding: '8px 12px', borderRadius: 8, marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#2d2820' }}>{user?.name}</div>
                  <div style={{ fontSize: 12, color: '#8a8070', marginTop: 1 }}>{user?.email}</div>
                </div>
                <div style={{ borderTop: '1px solid #f0ead8', marginBottom: 4 }} />
                <button onClick={() => { logout(); setShowUserMenu(false) }} style={{ width: '100%', padding: '9px 12px', background: 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, color: '#c0735a', fontWeight: 600, textAlign: 'left', fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#faf0ed'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >🚪 Sign out</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px 60px' }}>
        {/* Stats */}
        <div className="anim-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Total Tasks', value: stats.total, icon: '📋', color: '#2d2820' },
            { label: 'Completed', value: stats.completed, icon: '✅', color: '#3a6140' },
            { label: 'Pending', value: stats.pending, icon: '⏳', color: '#c9a84c' },
            { label: 'High Priority', value: stats.highPriority, icon: '🔥', color: '#c0735a' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="stat-card">
              <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color, letterSpacing: '-0.02em', marginBottom: 2 }}>{value}</div>
              <div style={{ fontSize: 12, color: '#8a8070', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {stats.total > 0 && (
          <div className="anim-up-1" style={{ background: '#fdfcf7', border: '1.5px solid #f0ead8', borderRadius: 16, padding: '16px 20px', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#5a5040' }}>Overall Progress</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#3a6140' }}>{percent}%</span>
            </div>
            <div style={{ background: '#f0ead8', borderRadius: 99, height: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${percent}%`, background: 'linear-gradient(90deg, #4a7c52, #6a9e70)', borderRadius: 99, transition: 'width 0.6s ease' }} />
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: '#8a8070' }}>{stats.completed} of {stats.total} tasks completed</div>
          </div>
        )}

        {/* Search + Add */}
        <div className="anim-up-1" style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative', minWidth: 200 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.4 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." className="input-field" style={{ paddingLeft: 42 }} />
          </div>
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="input-field" style={{ width: 140 }}>
            <option value="">All Priority</option>
            <option value="high">🔥 High</option>
            <option value="medium">⚡ Medium</option>
            <option value="low">🌿 Low</option>
          </select>
          <button onClick={() => { setEditTodo(null); setShowModal(true) }} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
            + Add Task
          </button>
        </div>

        {/* Tabs */}
        <div className="anim-up-2" style={{ display: 'flex', gap: 4, background: '#f0ead8', borderRadius: 99, padding: 4, marginBottom: 20, width: 'fit-content' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`tab-pill ${tab === t ? 'active' : ''}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Todo list */}
        <div className="anim-up-3">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className="spinner" style={{ width: 36, height: 36, border: '3px solid #e8dfc4', borderTopColor: '#3a6140', borderRadius: '50%', margin: '0 auto 16px' }} />
              <p style={{ color: '#8a8070', fontSize: 14 }}>Loading tasks...</p>
            </div>
          ) : todos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', background: '#fdfcf7', borderRadius: 20, border: '1.5px dashed #e8dfc4' }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>{search ? '🔍' : tab === 'completed' ? '🎉' : '📝'}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#2d2820', margin: '0 0 6px' }}>
                {search ? 'No results found' : tab === 'completed' ? 'No completed tasks' : 'No tasks yet'}
              </h3>
              <p style={{ color: '#8a8070', fontSize: 14, margin: '0 0 20px' }}>
                {search ? 'Try a different search term' : tab === 'all' ? 'Add your first task to get started!' : 'Complete some tasks to see them here'}
              </p>
              {tab === 'all' && !search && (
                <button onClick={() => { setEditTodo(null); setShowModal(true) }} className="btn-primary">+ Add your first task</button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {todos.map(todo => (
                <TodoCard key={todo._id} todo={todo} onToggle={handleToggle} onEdit={t => { setEditTodo(t); setShowModal(true) }} onDelete={handleDelete} />
              ))}
              {tab === 'completed' && todos.length > 0 && (
                <button onClick={clearCompleted} className="btn-ghost" style={{ marginTop: 8, alignSelf: 'center' }}>🗑️ Clear all completed</button>
              )}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <TodoModal todo={editTodo} onClose={() => { setShowModal(false); setEditTodo(null) }} onSave={handleSave} />
      )}

      {showUserMenu && <div onClick={() => setShowUserMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />}
    </div>
  )
}
