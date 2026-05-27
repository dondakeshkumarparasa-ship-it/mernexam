import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePractice } from '../context/PracticeContext';
import { useAuth } from '../context/AuthContext';
import { BarChart3, TrendingUp, Clock, Percent } from 'lucide-react';
import axios from 'axios';

const Analytics = () => {
  const { user } = useAuth();
  const { history } = usePractice();
  const [stats, setStats] = useState({
    totalAnswered: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    accuracy: 0,
    studyTimeMins: 0
  });

  useEffect(() => {
    if (user && history) {
      calculateStats();
    }
  }, [user, history]);

  const calculateStats = () => {
    const total = history.length;
    const correct = history.filter(h => h.result === true).length;
    const incorrect = total - correct;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    // Average response time simulation for study duration
    const totalSecs = history.reduce((acc, h) => acc + (h.responseTime || 5), 0);
    const studyTimeMins = Math.max(1, Math.round(totalSecs / 60));

    setStats({
      totalAnswered: total,
      totalCorrect: correct,
      totalIncorrect: incorrect,
      accuracy,
      studyTimeMins
    });
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
            <Link to="/analytics" className="nav-link active">Stats</Link>
            <Link to="/bookmarks" className="nav-link">Bookmarks</Link>
            <Link to="/notifications" className="nav-link">Notifications</Link>
          </nav>
        </div>
      </header>

      <main className="main-content container" style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', color: '#10b981' }}>
          📈 Personal Practice Telemetry
        </h2>

        {!user ? (
          <div className="empty-state-notice" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <h3>Telemetry Suspended</h3>
            <p>Please register or sign in to save your progress and access real-time statistics.</p>
          </div>
        ) : (
          <div className="analytics-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <div className="charts-cards-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              
              <div className="analytics-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  <span>Total Answered</span>
                  <BarChart3 size={18} />
                </div>
                <h2>{stats.totalAnswered}</h2>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>questions solved</span>
              </div>

              <div className="analytics-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', marginBottom: '0.5rem' }}>
                  <span>Accuracy</span>
                  <Percent size={18} />
                </div>
                <h2 style={{ color: '#10b981' }}>{stats.accuracy}%</h2>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>average correctness</span>
              </div>

              <div className="analytics-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444', marginBottom: '0.5rem' }}>
                  <span>Incorrect</span>
                  <TrendingUp size={18} style={{ transform: 'rotate(90deg)' }} />
                </div>
                <h2 style={{ color: '#ef4444' }}>{stats.totalIncorrect}</h2>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>attempts failed</span>
              </div>

              <div className="analytics-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6366f1', marginBottom: '0.5rem' }}>
                  <span>Study Duration</span>
                  <Clock size={18} />
                </div>
                <h2 style={{ color: '#6366f1' }}>{stats.studyTimeMins}m</h2>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>total active minutes</span>
              </div>

            </div>
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
        <Link to="/notifications" className="mobile-bottom-nav-item">
          <span className="nav-item-icon">🔔</span>
          <span className="nav-item-label">Notifications</span>
        </Link>
      </nav>
    </div>
  );
};

export default Analytics;
