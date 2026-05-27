import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, BarChart3, Bell, PlusCircle, Database, Users, Menu, LogOut, Check } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const { logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeSubView, setActiveSubView] = useState('notifications'); // default active view
  const [menuActive, setMenuActive] = useState(false);
  const [stats, setStats] = useState({
    activeUsers: 14205,
    totalAnsweredGlobal: 1205842,
    totalQuestions: 27,
    categoryPopularity: {}
  });

  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Form states
  const [notifTitle, setNotifTitle] = useState('');
  const [notifSlug, setNotifSlug] = useState('');
  const [notifContent, setNotifContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [schemaMarkup, setSchemaMarkup] = useState('');

  const [questionCat, setQuestionCat] = useState('Reasoning');
  const [questionTag, setQuestionTag] = useState('');
  const [questionDiff, setQuestionDiff] = useState('Medium');
  const [questionText, setQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [source, setSource] = useState('');
  const [explanation, setExplanation] = useState('');
  const [concept, setConcept] = useState('');
  const [shortcut, setShortcut] = useState('');
  const [takeaway, setTakeaway] = useState('');

  const [bulkInput, setBulkInput] = useState('');

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchNotifications();
  }, [activeSubView]);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats');
      if (res.data.success) setStats(res.data.stats);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      if (res.data.success) setUsers(res.data.users);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      if (res.data.success) setNotifications(res.data.notifications);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePublishNotif = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/notifications/add', {
        title: notifTitle,
        content: notifContent,
        slug: notifSlug,
        metaTitle,
        metaKeywords,
        metaDescription,
        schemaMarkup
      });
      if (res.data.success) {
        alert('Job alert published successfully!');
        setNotifTitle('');
        setNotifSlug('');
        setNotifContent('');
        setMetaTitle('');
        setMetaKeywords('');
        setMetaDescription('');
        setSchemaMarkup('');
        fetchNotifications();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed publishing notification.');
    }
  };

  const handleDeleteNotif = async (id) => {
    if (!confirm('Are you sure you want to delete this notification permanently?')) return;
    try {
      const res = await axios.delete(`/api/notifications/delete/${id}`);
      if (res.data.success) {
        alert('Notification deleted successfully.');
        fetchNotifications();
      }
    } catch (e) {
      alert('Delete failed.');
    }
  };

  const handleSuspendToggle = async (userId, currentlySuspended) => {
    try {
      const res = await axios.post(`/api/admin/users/suspend/${userId}`, { suspended: !currentlySuspended });
      if (res.data.success) {
        alert('User status updated.');
        fetchUsers();
      }
    } catch (e) {
      alert('Suspension toggle failed.');
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/questions/bulk-upload', {
        questionsArray: [{
          category: questionCat,
          tag: questionTag,
          difficulty: questionDiff,
          question: questionText,
          options: [optA, optB, optC, optD],
          correctOptionIndex: correctIdx,
          source,
          explanation,
          concept,
          shortcut,
          takeaway
        }]
      });
      if (res.data.success) {
        alert('Question added successfully!');
        setQuestionTag('');
        setQuestionText('');
        setOptA('');
        setOptB('');
        setOptC('');
        setOptD('');
        setSource('');
        setExplanation('');
        setConcept('');
        setShortcut('');
        setTakeaway('');
      }
    } catch (e) {
      alert('Failed adding question.');
    }
  };

  const handleBulkUpload = async () => {
    try {
      const parsed = JSON.parse(bulkInput);
      const res = await axios.post('/api/questions/bulk-upload', { questionsArray: parsed });
      if (res.data.success) {
        alert(`Parsed successfully! Loaded ${res.data.count} custom questions to the database.`);
        setBulkInput('');
        setActiveSubView('stats');
      }
    } catch (e) {
      alert('Invalid JSON array or parsing failure.');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin');
  };

  return (
    <div className="app-container">
      {/* --- HEADER --- */}
      <header>
        <div className="container header-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
          <a href="#" className="logo">
            <div className="logo-icon admin-logo-icon">🛡️</div>
            ExamPulse <span className="logo-tag" style={{ color: '#10b981' }}>ADMIN</span>
          </a>
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="hamburger-menu-btn" onClick={() => setMenuActive(!menuActive)}><Menu /></button>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout} style={{ border: '1px solid #ef4444', color: '#ef4444', background: 'transparent' }}>
              <LogOut size={14} /> Exit
            </button>
          </div>
        </div>
      </header>

      {/* --- MOBILE HAMBURGER DROPDOWN OVERLAY --- */}
      {menuActive && (
        <div className="mobile-nav-overlay active" style={{ top: '4rem' }}>
          <div className="mobile-nav-link" onClick={() => { setActiveSubView('notifications'); setMenuActive(false); }}>📢 Add Notification</div>
          <div className="mobile-nav-link" onClick={() => { setActiveSubView('posts'); setMenuActive(false); }}>📝 All Posts</div>
          <div className="mobile-nav-link" onClick={() => { setActiveSubView('stats'); setMenuActive(false); }}>📊 Dashboard Stats</div>
          <div className="mobile-nav-link" onClick={() => { setActiveSubView('create'); setMenuActive(false); }}>➕ Add Question</div>
          <div className="mobile-nav-link" onClick={() => { setActiveSubView('bulk'); setMenuActive(false); }}>📥 Bulk Upload</div>
        </div>
      )}

      <main className="main-content">
        <div className="admin-layout-grid">
          {/* Sidebar */}
          <div className="admin-sidebar">
            <h4 className="sidebar-title">Admin Management</h4>
            <button className={`admin-side-btn ${activeSubView === 'notifications' ? 'active' : ''}`} onClick={() => setActiveSubView('notifications')}>📢 Add Job Notification</button>
            <button className={`admin-side-btn ${activeSubView === 'posts' ? 'active' : ''}`} onClick={() => setActiveSubView('posts')}>📝 All Posts</button>
            <button className={`admin-side-btn ${activeSubView === 'stats' ? 'active' : ''}`} onClick={() => setActiveSubView('stats')}>📊 Dashboard Stats</button>
            <button className={`admin-side-btn ${activeSubView === 'create' ? 'active' : ''}`} onClick={() => setActiveSubView('create')}>➕ Add Question</button>
            <button className={`admin-side-btn ${activeSubView === 'bulk' ? 'active' : ''}`} onClick={() => setActiveSubView('bulk')}>📥 Bulk Upload</button>
            <button className={`admin-side-btn ${activeSubView === 'users' ? 'active' : ''}`} onClick={() => setActiveSubView('users')}>👥 User Controls</button>
          </div>

          <div className="admin-content-viewport">
            
            {/* View 1: Add Notification Form */}
            {activeSubView === 'notifications' && (
              <div className="admin-sub-view active">
                <div className="admin-card-container">
                  <h3>📢 Add Job Notification / Blog Post</h3>
                  <form onSubmit={handlePublishNotif} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                    <div className="admin-form-row-grid">
                      <div className="admin-form-group">
                        <label>Job Title *</label>
                        <input type="text" placeholder="e.g. UPSC CSE 2026 Recruitment Notice" value={notifTitle} onChange={e => {
                          setNotifTitle(e.target.value);
                          setNotifSlug(e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-'));
                        }} required />
                      </div>
                      <div className="admin-form-group">
                        <label>URL Slug *</label>
                        <input type="text" placeholder="upsc-cse-2026-recruitment" value={notifSlug} onChange={e => setNotifSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} required />
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label>Detailed Content (supports HTML/Text) *</label>
                      <textarea rows={6} placeholder="Enter detailed description of the job posting..." value={notifContent} onChange={e => setNotifContent(e.target.value)} required />
                    </div>

                    <h4 style={{ color: '#10b981', fontSize: '0.85rem', textTransform: 'uppercase', marginTop: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>🔍 On-Page SEO Configuration</h4>
                    
                    <div className="admin-form-row-grid">
                      <div className="admin-form-group">
                        <label>SEO Meta Title *</label>
                        <input type="text" placeholder="UPSC CSE 2026 Notification out: Apply Online..." value={metaTitle} onChange={e => setMetaTitle(e.target.value)} required />
                      </div>
                      <div className="admin-form-group">
                        <label>SEO Focus Keywords *</label>
                        <input type="text" placeholder="UPSC 2026, Civil Services Recruitment, IAS Apply Online" value={metaKeywords} onChange={e => setMetaKeywords(e.target.value)} required />
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label>SEO Meta Description *</label>
                      <textarea rows={3} placeholder="Detailed meta description for Google search engines..." value={metaDescription} onChange={e => setMetaDescription(e.target.value)} required />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'start' }}>📢 Publish Announcement</button>
                  </form>
                </div>
              </div>
            )}

            {/* View 2: All Posts Table */}
            {activeSubView === 'posts' && (
              <div className="admin-sub-view active">
                <div className="admin-card-container">
                  <h3>Manage Published Job Posts</h3>
                  <div className="admin-table-wrapper" style={{ marginTop: '1.25rem' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Slug URL</th>
                          <th>Created At</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {notifications.length === 0 ? (
                          <tr><td colSpan="4" style={{ textAlign: 'center' }}>No job notifications published yet.</td></tr>
                        ) : (
                          notifications.map(notif => (
                            <tr key={notif.id}>
                              <td><strong>{notif.title}</strong></td>
                              <td><code style={{ color: 'var(--text-muted)' }}>/{notif.slug}</code></td>
                              <td>{new Date(notif.createdAt).toLocaleDateString()}</td>
                              <td>
                                <button className="btn btn-secondary btn-sm" onClick={() => handleDeleteNotif(notif._id)} style={{ border: '1px solid #ef4444', color: '#ef4444', background: 'transparent' }}>
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* View 3: Dashboard Stats */}
            {activeSubView === 'stats' && (
              <div className="admin-sub-view active">
                <div className="admin-stats-grid">
                  <div className="admin-stat-card">
                    <h5>Active Concurrent Users</h5>
                    <h2 style={{ color: '#10b981' }}>{stats.activeUsers.toLocaleString()}</h2>
                  </div>
                  <div className="admin-stat-card">
                    <h5>Total Global Practices</h5>
                    <h2>{stats.totalAnsweredGlobal.toLocaleString()}</h2>
                  </div>
                  <div className="admin-stat-card">
                    <h5>Active Question Bank</h5>
                    <h2 style={{ color: '#6366f1' }}>{stats.totalQuestions}</h2>
                  </div>
                </div>

                <div className="admin-card-container">
                  <h3>Subject Seeding Counts</h3>
                  <div style={{ marginTop: '1rem' }}>
                    {Object.entries(stats.categoryPopularity || {}).map(([cat, val]) => (
                      <div key={cat} style={{ marginBottom: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 'bold' }}>
                          <span>{cat}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{val} questions</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* View 4: Add PYQ Question */}
            {activeSubView === 'create' && (
              <div className="admin-sub-view active">
                <div className="admin-card-container">
                  <h3>Create Verified exam-oriented PYQ</h3>
                  <form onSubmit={handleCreateQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                    <div className="admin-form-row-grid">
                      <div className="admin-form-group">
                        <label>Category *</label>
                        <select value={questionCat} onChange={e => setQuestionCat(e.target.value)}>
                          <option value="Reasoning">Reasoning</option>
                          <option value="Aptitude">Aptitude</option>
                          <option value="History">History</option>
                          <option value="Geography">Geography</option>
                          <option value="Polity">Polity</option>
                          <option value="Economics">Economics</option>
                          <option value="Science">Science</option>
                          <option value="Current Affairs">Current Affairs</option>
                        </select>
                      </div>
                      <div className="admin-form-group">
                        <label>Subtopic Tag *</label>
                        <input type="text" placeholder="e.g. Percentage, Blood Relations" value={questionTag} onChange={e => setQuestionTag(e.target.value)} required />
                      </div>
                      <div className="admin-form-group">
                        <label>Difficulty *</label>
                        <select value={questionDiff} onChange={e => setQuestionDiff(e.target.value)}>
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label>Question Content *</label>
                      <textarea rows={3} placeholder="Enter complete exam question..." value={questionText} onChange={e => setQuestionText(e.target.value)} required />
                    </div>

                    <div className="admin-form-row-grid">
                      <div className="admin-form-group"><label>Option A *</label><input type="text" value={optA} onChange={e => setOptA(e.target.value)} required /></div>
                      <div className="admin-form-group"><label>Option B *</label><input type="text" value={optB} onChange={e => setOptB(e.target.value)} required /></div>
                      <div className="admin-form-group"><label>Option C *</label><input type="text" value={optC} onChange={e => setOptC(e.target.value)} required /></div>
                      <div className="admin-form-group"><label>Option D *</label><input type="text" value={optD} onChange={e => setOptD(e.target.value)} required /></div>
                    </div>

                    <div className="admin-form-row-grid">
                      <div className="admin-form-group">
                        <label>Correct Option Index *</label>
                        <select value={correctIdx} onChange={e => setCorrectIdx(Number(e.target.value))}>
                          <option value={0}>Option A</option>
                          <option value={1}>Option B</option>
                          <option value={2}>Option C</option>
                          <option value={3}>Option D</option>
                        </select>
                      </div>
                      <div className="admin-form-group">
                        <label>Exam Source *</label>
                        <input type="text" placeholder="e.g. SSC CGL 2023" value={source} onChange={e => setSource(e.target.value)} required />
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label>Verified explanation *</label>
                      <textarea rows={3} placeholder="Explain the correct answer logic..." value={explanation} onChange={e => setExplanation(e.target.value)} required />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'start' }}>Save to pool</button>
                  </form>
                </div>
              </div>
            )}

            {/* View 5: Bulk Load */}
            {activeSubView === 'bulk' && (
              <div className="admin-sub-view active">
                <div className="admin-card-container">
                  <h3>Bulk Upload JSON Questions</h3>
                  <div className="admin-form-group" style={{ marginTop: '1.25rem' }}>
                    <label>JSON Array Format</label>
                    <textarea 
                      className="bulk-textarea" 
                      rows={12} 
                      placeholder='[ { "category": "History", "tag": "Ancient", "question": "Question text?", "options": ["A","B","C","D"], "correctOptionIndex": 1 } ]'
                      value={bulkInput}
                      onChange={e => setBulkInput(e.target.value)}
                    />
                  </div>
                  <button className="btn btn-primary" onClick={handleBulkUpload} style={{ marginTop: '1rem' }}>Parse & Load Array</button>
                </div>
              </div>
            )}

            {/* View 6: User Controls */}
            {activeSubView === 'users' && (
              <div className="admin-sub-view active">
                <div className="admin-card-container">
                  <h3>Aspirants & Session User Control</h3>
                  <div className="admin-table-wrapper" style={{ marginTop: '1.25rem' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Aspirant Username</th>
                          <th>Email Address</th>
                          <th>Global Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length === 0 ? (
                          <tr><td colSpan="4" style={{ textAlign: 'center' }}>No live student accounts created yet.</td></tr>
                        ) : (
                          users.map(u => (
                            <tr key={u._id}>
                              <td><strong>{u.username}</strong></td>
                              <td>{u.email}</td>
                              <td>
                                <span className={`badge ${u.suspended ? 'badge-hard' : 'badge-easy'}`}>
                                  {u.suspended ? 'Suspended' : 'Active'}
                                </span>
                              </td>
                              <td>
                                <button 
                                  className="btn btn-secondary btn-sm" 
                                  onClick={() => handleSuspendToggle(u._id, u.suspended)}
                                >
                                  {u.suspended ? 'Reactivate' : 'Suspend'}
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Persistent Bottom Nav Bar (Mobile Viewports <= 960px) */}
      <nav className="mobile-bottom-nav admin-bottom-nav">
        <div className={`mobile-bottom-nav-item ${activeSubView === 'users' ? 'active' : ''}`} onClick={() => setActiveSubView('users')}>
          <span className="nav-item-icon">👥</span>
          <span className="nav-item-label">Users</span>
        </div>
        <div className={`mobile-bottom-nav-item ${activeSubView === 'notifications' ? 'active' : ''}`} onClick={() => setActiveSubView('notifications')}>
          <span className="nav-item-icon">📢</span>
          <span className="nav-item-label">Add Notif</span>
        </div>
        <div className={`mobile-bottom-nav-item ${activeSubView === 'posts' ? 'active' : ''}`} onClick={() => setActiveSubView('posts')}>
          <span className="nav-item-icon">📝</span>
          <span className="nav-item-label">All Posts</span>
        </div>
      </nav>
    </div>
  );
};

export default AdminDashboard;
