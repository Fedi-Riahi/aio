"use client"
import { useState } from 'react';
import PrivacyPolicy from '@/components/privacyPolicy';
import TermsAndConditions from '@/components/termsConds';

const LegalPage = () => {
  const [activeTab, setActiveTab] = useState('privacy');

  return (
    <div className="legal-page-container my-40">
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          Politique de confidentialité
        </button>
        <button
          className={`tab-button ${activeTab === 'terms' ? 'active' : ''}`}
          onClick={() => setActiveTab('terms')}
        >
          Termes et conditions
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'privacy' ? <PrivacyPolicy /> : <TermsAndConditions />}
      </div>

      <style jsx>{`
        .legal-page-container {
          max-width: 1000px;
          margin: 100 auto;
          padding: 20px;
        }

        .tabs-container {
          display: flex;
          border-bottom: 1px solid #eaeaea;
          margin-bottom: 30px;
        }

        .tab-button {
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          position: relative;
          transition: all 0.3s ease;
        }

        .tab-button:hover {
          color: #333;
        }

        .tab-button.active {
          color: #2563eb;
          font-weight: 600;
        }

        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #2563eb;
        }

        .tab-content {
          padding: 0 15px;
        }

        @media (max-width: 768px) {
          .legal-page-container {
            padding: 15px;
          }

          .tab-button {
            padding: 10px 15px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default LegalPage;
