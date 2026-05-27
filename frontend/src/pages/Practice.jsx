import React, { useEffect, useState } from 'react';
import { usePractice } from '../context/PracticeContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, BookMarked, BarChart3, Bell, User, X, LogOut, Settings } from 'lucide-react';
import axios from 'axios';

const Practice = () => {
  const {
    currentQuestion,
    activeCategory,
    setActiveCategory,
    loading,
    isAnswered,
    selectedOption,
    explanation,
    fetchNextQuestion,
    submitAnswer,
    toggleBookmark,
    isBookmarked
  } = usePractice();

  const { user, logout } = useAuth();
  const [profileOverlayActive, setProfileOverlayActive] = useState(false);
  const [submenuStats, setSubmenuStats] = useState({});

  useEffect(() => {
    fetchNextQuestion();
  }, [activeCategory]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
  };

  const handleOptionClick = (idx) => {
    if (isAnswered) return;
    submitAnswer(idx);
  };

  const handleProfileClick = async () => {
    setProfileOverlayActive(true);
    // Fetch telemetry metrics
    try {
      const res = await axios.get('/api/users/telemetry');
      if (res.data.success) {
        setSubmenuStats(res.data.telemetry);
      }
    } catch (e) {
      console.error("Telemetry failed:", e);
    }
  };

  const categories = [
    { name: 'Reasoning', icon: '🧠' },
    { name: 'Aptitude', icon: '📊' },
    { name: 'History', icon: '🏛' },
    { name: 'Geography', icon: '🌍' },
    { name: 'Polity', icon: '⚖' },
    { name: 'Economics', icon: '💰' },
    { name: 'Science', icon: '🔬' },
    { name: 'Current Affairs', icon: '📰' }
  ];

  return (
    <div className="app-container">
      {/* --- HEADER --- */}
      <header>
        <div class="container header-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
          <a href="/" class="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.35rem', fontWeight: '800' }}>
            <div class="logo-icon" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', width: '1.75rem', height: '1.75rem', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem' }}>⚡</div>
            ExamPulse <span class="logo-tag" style={{ color: 'var(--text-primary)' }}>AI</span>
          </a>
          
          <nav class="nav-links" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link to="/" className="nav-link active">Start</Link>
            <Link to="/analytics" className="nav-link">Stats</Link>
            <Link to="/bookmarks" className="nav-link">Bookmarks</Link>
            <Link to="/notifications" className="nav-link">Notifications</Link>
          </nav>

          <div class="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button class="profile-menu-btn" onClick={handleProfileClick} title="View Profile Telemetry">👤</button>
          </div>
        </div>
      </header>

      {/* --- PROFILE TELEMETRY SUB-MENU OVERLAY --- */}
      {profileOverlayActive && (
        <div className="profile-menu-overlay active" onClick={(e) => e.target.classList.contains('profile-menu-overlay') && setProfileOverlayActive(false)}>
          <div className="profile-menu-panel">
            <div className="profile-menu-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
              <div className="profile-user-summary" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="profile-submenu-avatar" style={{ width: '3rem', height: '3rem', background: 'linear-gradient(135deg, #10b981, #34d399)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem', fontWeight: '800', color: '#fff' }}>
                  {user ? user.username[0].toUpperCase() : 'G'}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{user ? user.username : 'Guest Candidate'}</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user ? user.email : 'candidate@exampulse.ai'}</p>
                </div>
              </div>
              <button className="profile-menu-close" onClick={() => setProfileOverlayActive(false)}>✕</button>
            </div>

            <div className="profile-menu-section-title" style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              📊 Rolling Telemetry Stats
            </div>

            <div className="profile-submenu-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2.25rem' }}>
              {['1Day', '2Days', '1Week', '1Month'].map(period => {
                const data = submenuStats[period] || { total: 0, correct: 0, incorrect: 0 };
                const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                return (
                  <div className="submenu-stat-period-card" key={period} style={{ background: 'var(--bg-accent)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <div className="period-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                      <span className="period-label" style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>{period}</span>
                      <span className="period-accuracy" style={{ color: data.total > 0 ? '#10b981' : 'var(--text-muted)', fontWeight: '700' }}>{data.total > 0 ? `${acc}% Acc` : 'No attempts'}</span>
                    </div>
                    <div className="period-card-metrics" style={{ display: 'flex', gap: '0.45rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      <span>Q: <strong>{data.total}</strong></span>
                      <span style={{ color: '#10b981' }}>C: <strong>{data.correct}</strong></span>
                      <span style={{ color: '#ef4444' }}>I: <strong>{data.incorrect}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="profile-menu-actions-list" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {user ? (
                <button className="profile-action-item logout-red" onClick={logout} style={{ width: '100%', background: 'var(--bg-accent)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ef4444', cursor: 'pointer' }}>
                  <LogOut size={16} /> Logout Profile
                </button>
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Sign in or register during practice limit locks to sync telemetry.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="main-content">
        <section id="view-practice" className="view-section active">
          {/* Mobile Category Slider */}
          <div className="mobile-category-slider">
            {categories.map(cat => (
              <button
                key={cat.name}
                className={`mobile-slider-btn ${activeCategory === cat.name ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.name)}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          <div className="practice-layout">
            {/* Desktop Left Sidebar */}
            <div className="category-sidebar">
              <h4 className="sidebar-title">Categories</h4>
              <div className="category-list">
                {categories.map(cat => (
                  <button
                    key={cat.name}
                    className={`category-item-btn ${activeCategory === cat.name ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat.name)}
                  >
                    <span>{cat.icon} {cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Practice Center Viewport */}
            <div className="practice-viewport">
              <div className="practice-pane-container">
                {/* Question Block */}
                <div className="question-column">
                  <div className={`practice-card-box ${isAnswered ? (selectedOption === (currentQuestion ? currentQuestion.correctOptionIndex : 0) ? 'correct-pulse' : 'wrong-pulse shake') : ''}`}>
                    <div className="card-question-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                      <div className="q-source-info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 700, fontSize: '0.8rem' }}>
                        <span className={`badge badge-${currentQuestion ? currentQuestion.difficulty.toLowerCase() : 'medium'}`}>{currentQuestion ? currentQuestion.difficulty : 'Medium'}</span>
                        <span>{currentQuestion ? currentQuestion.source : 'UPSC CSAT'}</span>
                      </div>
                      <button
                        className={`q-action-icon-btn ${currentQuestion && isBookmarked(currentQuestion.id) ? 'bookmarked' : ''}`}
                        onClick={() => currentQuestion && toggleBookmark(currentQuestion.id)}
                      >
                        🔖
                      </button>
                    </div>

                    <div className="question-text-area" style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                      {loading ? (
                        <div className="live-ai-loading-glow">⚡ Fetching PYQ questions dynamically from LLM engine...</div>
                      ) : (
                        currentQuestion ? currentQuestion.question : 'Subject pool empty.'
                      )}
                    </div>

                    <div className="options-layout-grid" style={{ display: 'grid', gap: '0.75rem' }}>
                      {currentQuestion && currentQuestion.options.map((opt, idx) => {
                        const isCorrectOpt = idx === currentQuestion.correctOptionIndex;
                        const isSelectedOpt = idx === selectedOption;
                        let optClass = 'option-choice-btn';
                        if (isAnswered) {
                          optClass += ' locked';
                          if (isCorrectOpt) optClass += ' selected-correct';
                          else if (isSelectedOpt) optClass += ' selected-wrong';
                          else optClass += ' disabled';
                        }
                        return (
                          <button key={idx} className={optClass} onClick={() => handleOptionClick(idx)}>
                            <span className="option-prefix-bubble">{['A', 'B', 'C', 'D'][idx]}</span>
                            <span className="option-text">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {isAnswered && (
                    <div className="action-footer-practice" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                      <button className="btn btn-primary" onClick={() => fetchNextQuestion()}>
                        Next Question ➔
                      </button>
                    </div>
                  )}
                </div>

                {/* Right: Explanation Block */}
                {isAnswered && explanation && (
                  <div className="explanation-column active">
                    <div className="explanation-panel-drawer">
                      <h4 className="drawer-section-title">Verified Solution Explanation</h4>
                      <p className="explanation-body-text">{explanation.explanation}</p>
                      
                      <div className="solution-highlights-grid" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                        <div className="highlight-box">
                          <h5>Core Syllabus Concept</h5>
                          <p>{explanation.concept || 'General Concept'}</p>
                        </div>
                        <div className="highlight-box">
                          <h5>Shortcut Strategy</h5>
                          <p>{explanation.shortcut || 'Solve logically'}</p>
                        </div>
                        <div className="highlight-box">
                          <h5>Key Visual Takeaway</h5>
                          <p>{explanation.takeaway || 'Analyze options'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Persistent Bottom Nav Bar (Mobile Viewports <= 960px) */}
      <nav className="mobile-bottom-nav">
        <Link to="/bookmarks" className="mobile-bottom-nav-item">
          <span className="nav-item-icon">🔖</span>
          <span className="nav-item-label">Bookmarks</span>
        </Link>
        <Link to="/" className="mobile-bottom-nav-item active">
          <span className="nav-item-icon">⚡</span>
          <span className="nav-item-label">Start</span>
        </Link>
        <Link to="/notifications" className="mobile-bottom-nav-item">
          <span className="nav-item-icon">🔔</span>
          <span className="nav-item-label">Notifications</span>
        </Link>
      </nav>
    </div>
  );
};

export default Practice;
