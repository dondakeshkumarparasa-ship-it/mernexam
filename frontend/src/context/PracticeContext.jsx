import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const PracticeContext = createContext(null);

export const PracticeProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Reasoning');
  const [loading, setLoading] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);

  // Fetch student parameters on load/user login
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const res = await axios.get('/api/users/me');
      if (res.data.success) {
        setBookmarks(res.data.user.bookmarks || []);
        setHistory(res.data.user.history || []);
      }
    } catch (e) {
      console.error("Failed fetching user details:", e);
    }
  };

  const fetchNextQuestion = async (difficulty = 'Medium') => {
    setLoading(true);
    setIsAnswered(false);
    setSelectedOption(null);
    setExplanation(null);
    try {
      const res = await axios.get(`/api/questions/next?category=${activeCategory}&difficulty=${difficulty}`);
      if (res.data.success) {
        setCurrentQuestion(res.data.question);
      }
    } catch (error) {
      console.error("Failed fetching question:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (selectedIdx) => {
    if (isAnswered || !currentQuestion) return;
    setIsAnswered(true);
    setSelectedOption(selectedIdx);

    const isCorrect = selectedIdx === currentQuestion.correctOptionIndex;

    try {
      const res = await axios.post('/api/questions/submit', {
        userId: user ? user.id : 'guest',
        questionId: currentQuestion.id,
        selectedIdx,
        isCorrect
      });
      if (res.data.success) {
        setExplanation(res.data.feedback);
        if (user) fetchUserData();
      }
    } catch (error) {
      console.error("Failed submitting answer:", error);
    }
  };

  const toggleBookmark = async (questionId) => {
    if (!user) return false;
    try {
      const res = await axios.post('/api/bookmarks/toggle', {
        userId: user.id,
        questionId
      });
      if (res.data.success) {
        fetchUserData();
        return true;
      }
    } catch (e) {
      console.error("Failed toggling bookmark:", e);
    }
    return false;
  };

  const isBookmarked = (qid) => {
    return bookmarks.includes(qid);
  };

  return (
    <PracticeContext.Provider value={{
      currentQuestion,
      activeCategory,
      setActiveCategory,
      loading,
      isAnswered,
      selectedOption,
      explanation,
      bookmarks,
      history,
      fetchNextQuestion,
      submitAnswer,
      toggleBookmark,
      isBookmarked
    }}>
      {children}
    </PracticeContext.Provider>
  );
};

export const usePractice = () => useContext(PracticeContext);
