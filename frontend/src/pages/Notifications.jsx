import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ArrowLeft, Search, Eye } from 'lucide-react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [activePost, setActivePost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (e) {
      console.error("Failed loading notifications:", e);
    } finally {
      setLoading(false);
    }
  };

  const handlePostExpand = (post) => {
    setActivePost(post);
    
    // Dynamic on-page SEO changes
    document.title = post.metaTitle || `${post.title} | ExamPulse AI`;
    
    // Structured schema injection
    removeSchemaScript();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'active-json-ld-schema';
    script.textContent = post.schemaMarkup || JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": post.title,
      "description": post.metaDescription,
      "datePosted": post.createdAt.split('T')[0]
    });
    document.head.appendChild(script);
  };

  const handleBackToList = () => {
    setActivePost(null);
    document.title = "ExamPulse AI | 24/7 Government Exam Prep Platform";
    removeSchemaScript();
  };

  const removeSchemaScript = () => {
    const existing = document.getElementById('active-json-ld-schema');
    if (existing) existing.remove();
  };

  return (
    <div className="app-container" style={{ paddingBottom: '5rem' }}>
      {/* --- HEADER --- */}
      <header>
        <div className="container header-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
          <a href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.35rem', fontWeight: '800' }}>
            <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', width: '1.75rem', height: '1.75rem', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem' }}>⚡</div>
            ExamPulse <span className="logo-tag" style={{ color: 'var(--text-primary)' }}>AI</span>
          </a>
          <nav className="nav-links" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link to="/" className="nav-link">Start</Link>
            <Link to="/analytics" className="nav-link">Stats</Link>
            <Link to="/bookmarks" className="nav-link">Bookmarks</Link>
            <Link to="/notifications" className="nav-link active">Notifications</Link>
          </nav>
        </div>
      </header>

      <main className="main-content container" style={{ marginTop: '2rem' }}>
        {activePost ? (
          <div id="notification-detail-container">
            <button className="btn btn-secondary btn-sm" onClick={handleBackToList} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ArrowLeft size={14} /> Back to All Jobs
            </button>
            <article className="expanded-blog-post" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '1rem', padding: '2.5rem' }}>
              <header className="blog-header">
                <h1 id="blog-title" style={{ fontSize: '1.85rem', color: '#10b981', marginBottom: '0.5rem' }}>{activePost.title}</h1>
                <div className="blog-meta" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Published on {new Date(activePost.createdAt).toLocaleDateString()}
                </div>
              </header>
              <div 
                className="blog-content" 
                style={{ lineLength: 1.6, fontSize: '0.95rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}
                dangerouslySetInnerHTML={{ __html: activePost.content }}
              />
              
              <div className="blog-seo-panel" style={{ background: 'var(--bg-accent)', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem' }}>
                <h3 style={{ fontSize: '0.95rem', color: '#10b981', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                  <Search size={16} /> Real-time SEO Telemetry
                </h3>
                <div style={{ fontSize: '0.8rem', lineLength: 1.6 }}>
                  <strong>Focus Keywords:</strong> <span style={{ color: '#10b981' }}>{activePost.metaKeywords}</span><br/>
                  <strong>Active Page Title:</strong> <span style={{ color: 'var(--text-secondary)' }}>{activePost.metaTitle}</span><br/>
                  <strong>Meta Description:</strong> <span style={{ color: 'var(--text-secondary)' }}>{activePost.metaDescription}</span>
                </div>
              </div>
            </article>
          </div>
        ) : (
          <div id="notifications-list-container">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', color: '#10b981' }}>
              📢 Job Alerts & Notifications
            </h2>

            {loading ? (
              <div className="live-ai-loading-glow">Loading announcements...</div>
            ) : notifications.length === 0 ? (
              <div className="empty-state-notice" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                <h3>No announcements published</h3>
                <p>Check back later for verified public job postings and notifications.</p>
              </div>
            ) : (
              <div className="notifications-list-area" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {notifications.map(notif => (
                  <div key={notif.id} className="notification-blog-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1.75rem' }}>
                    <div className="blog-card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span className="badge badge-easy" style={{ background: 'rgba(16,185,129,0.05)', color: '#10b981' }}>Job Notice</span>
                      <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="blog-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{notif.title}</h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      {notif.content.replace(/<[^>]*>/g, '').substring(0, 140)}...
                    </p>
                    <button className="btn btn-secondary btn-sm" onClick={() => handlePostExpand(notif)} style={{ width: '100%' }}>
                      Read Full Post ➔
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Persistent Bottom Nav Bar (Mobile Viewports <= 960px) */}
      <nav className="mobile-bottom-nav">
        <Link to="/bookmarks" className="mobile-bottom-nav-item">
          <span className="nav-item-icon">🔖</span>
          <span className="nav-item-label">Bookmarks</span>
        </Link>
        <Link to="/" className="mobile-bottom-nav-item">
          <span className="nav-item-icon">⚡</span>
          <span className="nav-item-label">Start</span>
        </Link>
        <Link to="/notifications" className="mobile-bottom-nav-item active">
          <span className="nav-item-icon">🔔</span>
          <span className="nav-item-label">Notifications</span>
        </Link>
      </nav>
    </div>
  );
};

export default Notifications;
