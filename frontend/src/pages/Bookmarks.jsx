import React, { useEffect, useState } from 'react';
import { usePractice } from '../context/PracticeContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Bookmarks = () => {
  const { bookmarks, toggleBookmark } = usePractice();
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [visibleSolutions, setVisibleSolutions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarkedQuestions();
  }, [bookmarks]);

  const fetchBookmarkedQuestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/questions/bookmarked-list');
      if (res.data.success) {
        // Reverse array to ensure last bookmarked is visible at the top!
        setBookmarkedQuestions([...res.data.questions].reverse());
      }
    } catch (e) {
      console.error("Failed fetching bookmarks:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSolution = (qid) => {
    setVisibleSolutions(prev => ({
      ...prev,
      [qid]: !prev[qid]
    }));
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
            <Link to="/bookmarks" className="nav-link active">Bookmarks</Link>
            <Link to="/notifications" className="nav-link">Notifications</Link>
          </nav>
        </div>
      </header>

      <main className="main-content container" style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', color: '#10b981' }}>
          🔖 Saved Revisions & Bookmarks
        </h2>

        {loading ? (
          <div className="live-ai-loading-glow">Loading your bookmarks...</div>
        ) : bookmarkedQuestions.length === 0 ? (
          <div className="empty-state-notice" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <h3>No bookmarks saved</h3>
            <p>Bookmark questions during practice to review their solutions and shortcuts here.</p>
          </div>
        ) : (
          <div className="bookmarks-list-area" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {bookmarkedQuestions.map(q => {
              const showSolution = !!visibleSolutions[q.id];
              return (
                <div 
                  key={q.id} 
                  className="bookmark-card-item" 
                  onClick={() => handleToggleSolution(q.id)}
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1.5rem', cursor: 'pointer' }}
                >
                  <div className="bookmark-card-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                    <span className="badge badge-easy" style={{ background: 'rgba(16,185,129,0.05)', color: '#10b981' }}>{q.category}</span>
                    <button 
                      className="btn btn-secondary btn-sm remove-bookmark-btn" 
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid triggering card solution toggle
                        toggleBookmark(q.id);
                      }}
                      style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="bookmark-card-question" style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', lineHeight: 1.45 }}>{q.question}</div>
                  
                  <button 
                    className={`btn btn-sm ${showSolution ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: '100%', borderRadius: '6px', fontSize: '0.75rem', padding: '0.35rem' }}
                  >
                    {showSolution ? 'Hide Answer & Solution' : 'Show Answer & Solution'}
                  </button>

                  {showSolution && (
                    <div className="bookmark-card-explanation" style={{ background: 'var(--bg-accent)', borderRadius: '0.375rem', padding: '0.85rem', border: '1px solid var(--border-color)', fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)', marginTop: '1rem' }}>
                      <strong>Correct Option:</strong> {q.options[q.correctOptionIndex]}<br/><br/>
                      <strong>Solution Explanation:</strong> {q.explanation}<br/><br/>
                      {q.shortcut && <><strong>Shortcut:</strong> {q.shortcut}<br/><br/></>}
                      <strong>Source Exam:</strong> {q.source}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Persistent Bottom Nav Bar (Mobile Viewports <= 960px) */}
      <nav className="mobile-bottom-nav">
        <Link to="/bookmarks" className="mobile-bottom-nav-item active">
          <span className="nav-item-icon">🔖</span>
          <span className="nav-item-label">Bookmarks</span>
        </Link>
        <Link to="/" className="mobile-bottom-nav-item">
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

export default Bookmarks;
