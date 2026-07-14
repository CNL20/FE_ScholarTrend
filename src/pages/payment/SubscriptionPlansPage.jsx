import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlans, createCheckoutUrl } from '../../services/paymentService';
import styles from './SubscriptionPlansPage.module.css';

const SubscriptionPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isAuthenticated = Boolean(token);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getPlans();
        // Ensure active plans are displayed
        setPlans(data.filter(plan => plan.isActive) || []);
      } catch (err) {
        setError('Failed to load subscription plans. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (planId) => {
    if (!isAuthenticated) {
      // Redirect to login, optionally passing state to return here
      navigate('/login', { state: { from: '/pricing' } });
      return;
    }

    setProcessingId(planId);
    setError(null);

    try {
      // Using window.location.origin to get the current domain
      const baseUrl = window.location.origin;
      const cancelUrl = `${baseUrl}/payment/result?status=cancel`;
      const returnUrl = `${baseUrl}/payment/result?status=success`;

      const result = await createCheckoutUrl(planId, cancelUrl, returnUrl);
      
      if (result && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        throw new Error('Invalid checkout URL returned from server.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate payment. Please try again.');
      setProcessingId(null);
    }
  };

  // Helper to get some static features based on plan code or target role if backend doesn't provide a list
  const getFeatures = (plan) => {
    if (plan.code?.toLowerCase().includes('premium') || plan.targetRole === 'Researcher') {
      return [
        'Unlimited AI queries',
        'Advanced Trend Analytics',
        'Follow unlimited Authors/Journals',
        'Priority email support',
        `Access for ${plan.durationDays} days`
      ];
    }
    return [
      'Basic search features',
      'View public trends',
      'Bookmark papers',
      `Access for ${plan.durationDays} days`
    ];
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <p>Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Unlock Premium Features</h1>
        <p className={styles.subtitle}>
          Choose the perfect plan for your research needs and get access to advanced AI analytics.
        </p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.plansWrapper}>
        {plans.map((plan) => {
          const isPremium = plan.code?.toLowerCase().includes('premium') || plan.priceVND > 50000;
          return (
            <div key={plan.id} className={`${styles.planCard} ${isPremium ? styles.premiumCard : ''}`}>
              {isPremium && <div className={styles.popularBadge}>Popular</div>}
              
              <h2 className={styles.planName}>{plan.name}</h2>
              <div className={styles.planDescription}>{plan.description || `Best for ${plan.targetRole}s`}</div>
              
              <div className={styles.planPrice}>
                {new Intl.NumberFormat('vi-VN').format(plan.priceVND)}
                <span className={styles.planCurrency}>VND</span>
                {plan.durationDays > 0 && <span className={styles.planDuration}>/ {plan.durationDays} days</span>}
              </div>

              <ul className={styles.featuresList}>
                {getFeatures(plan).map((feature, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <svg className={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`${styles.subscribeBtn} ${styles.primary}`}
                onClick={() => handleSubscribe(plan.id)}
                disabled={processingId === plan.id}
              >
                {processingId === plan.id ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>
          );
        })}
        {plans.length === 0 && !error && (
          <p className={styles.subtitle}>No active plans available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlansPage;
