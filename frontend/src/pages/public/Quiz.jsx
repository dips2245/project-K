import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/quiz.css';

const ROSEGOLD = '#999999';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export default function QuizPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ne') ? 'ne' : 'en';

  const [quiz, setQuiz] = useState(null);
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/quiz');
      if (!res.ok) throw new Error('Failed to load quiz');
      const data = await res.json();
      setQuiz(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId, optionValue, isMulti) => {
    setResponses((prev) => {
      const existing = prev.find((r) => r.questionId === questionId);
      if (existing) {
        if (isMulti) {
          const selected = existing.selectedOptions.includes(optionValue)
            ? existing.selectedOptions.filter((v) => v !== optionValue)
            : [...existing.selectedOptions, optionValue];
          return prev.map((r) =>
            r.questionId === questionId ? { ...r, selectedOptions: selected } : r
          );
        }
        return prev.map((r) =>
          r.questionId === questionId ? { ...r, selectedOptions: [optionValue] } : r
        );
      }
      return [...prev, { questionId, selectedOptions: [optionValue] }];
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId: quiz._id, responses, sessionId }),
      });
      if (!res.ok) throw new Error('Failed to submit quiz');
      const data = await res.json();
      const resultsRes = await fetch(`/api/quiz/results/${data.quizResponse._id}`);
      const resultsData = await resultsRes.json();
      setResults(resultsData);
      setShowResults(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setResponses([]);
    setShowResults(false);
    setResults(null);
    setStarted(false);
  };

  if (loading) {
    return (
      <div className="quiz-page">
        <div className="quiz-status">
          <div className="spinner" />
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-page">
        <div className="quiz-status">
          <p className="quiz-error-text">{t('common.error')}: {error}</p>
          <button className="btn-rose" onClick={() => navigate('/shop')}>
            {t('common.backToShop') || 'Back to Shop'}
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="quiz-page">
        <div className="quiz-status">
          <p className="quiz-error-text">{t('quiz.notAvailable') || 'Quiz not available'}</p>
          <button className="btn-rose" onClick={() => navigate('/shop')}>
            {t('common.backToShop') || 'Back to Shop'}
          </button>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    const products = results.recommendedProducts || [];
    return (
      <div className="quiz-page">
        <div className="quiz-results">
          <motion.div
            className="quiz-results-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>{t('quiz.resultsTitle')}</h1>
            <p>{t('quiz.resultsSubtitle')}</p>
          </motion.div>

          {products.length > 0 ? (
            <motion.div
              className="quiz-results-grid"
              initial="initial"
              animate="animate"
              variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
            >
              {products.map((item, idx) => {
                const p = item.product;
                const name = p.name?.[lang] || p.name?.en || '';
                const imgSrc = p.images?.[0];
                return (
                  <motion.div
                    key={p._id || idx}
                    className="quiz-product-card"
                    variants={{
                      initial: { opacity: 0, y: 30 },
                      animate: { opacity: 1, y: 0 },
                    }}
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    <div className="quiz-product-image">
                      {imgSrc ? (
                        <img src={imgSrc} alt={name} loading="lazy" />
                      ) : (
                        <div className="quiz-product-noimg" />
                      )}
                      <div className="quiz-product-score">{item.score}%</div>
                    </div>
                    <div className="quiz-product-info">
                      <h3 className="quiz-product-name">{name}</h3>
                      <p className="quiz-product-price">
                        Rs. {p.price?.toLocaleString()}
                      </p>
                    </div>
                    <div className="quiz-product-overlay">
                      <span>{t('quiz.viewProduct')}</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="quiz-no-results">
              <p>{t('quiz.noRecommendations')}</p>
            </div>
          )}

          <motion.div
            className="quiz-results-actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button className="btn-rose" onClick={handleRestart}>
              {t('quiz.retake')}
            </button>
            <button className="btn-outline" onClick={() => navigate('/shop')}>
              {t('quiz.browseShop')}
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="quiz-page">
        <div className="quiz-hero">
          <motion.div
            className="quiz-hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="quiz-hero-badge">BLISS</div>
            <h1 className="quiz-hero-title">
              {t('quiz.heroTitle')}
            </h1>
            <p className="quiz-hero-sub">
              {t('quiz.heroSubtitle')}
            </p>
            <motion.button
              className="quiz-hero-btn"
              onClick={() => setStarted(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {t('quiz.startQuiz')}
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestionIndex];
  const currentResponse = responses.find((r) => r.questionId === question._id);
  const selectedOptions = currentResponse?.selectedOptions || [];
  const isMulti = question.type === 'multi-select';
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const hasSelection = selectedOptions.length > 0;

  return (
    <div className="quiz-page">
      <div className="quiz-flow">
        <div className="quiz-progress">
          <div className="quiz-progress-track">
            <motion.div
              className="quiz-progress-fill"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ transformOrigin: 'left' }}
            />
          </div>
          <p className="quiz-progress-text">
            {t('quiz.questionProgress', {
              current: currentQuestionIndex + 1,
              total: quiz.questions.length,
            })}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question._id}
            className="quiz-question-area"
            {...fadeUp}
          >
            <h2 className="quiz-question-text">
              {question.text[lang] || question.text.en}
            </h2>

            <div className="quiz-options">
              {question.options.map((option) => {
                const isSelected = selectedOptions.includes(option.value);
                return (
                  <motion.button
                    key={option._id}
                    className={`quiz-option-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleOptionSelect(question._id, option.value, isMulti)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="quiz-option-label">
                      {option.label[lang] || option.label.en}
                    </span>
                    {isMulti && isSelected && (
                      <span className="quiz-option-check">&#10003;</span>
                    )}
                    {!isMulti && isSelected && (
                      <span className="quiz-option-dot" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="quiz-nav">
          {currentQuestionIndex > 0 && (
            <button className="quiz-nav-btn secondary" onClick={handlePrev}>
              {t('common.back') || 'Back'}
            </button>
          )}
          <div style={{ flex: 1 }} />
          <motion.button
            className="quiz-nav-btn primary"
            disabled={!hasSelection || submitting}
            onClick={isLastQuestion ? handleSubmit : handleNext}
            whileHover={hasSelection && !submitting ? { scale: 1.02 } : {}}
            whileTap={hasSelection && !submitting ? { scale: 0.98 } : {}}
          >
            {submitting
              ? (t('quiz.submitting') || 'Finding your matches...')
              : isLastQuestion
                ? (t('quiz.getResults') || 'Get My Recommendations')
                : (t('common.continue') || 'Continue')}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
