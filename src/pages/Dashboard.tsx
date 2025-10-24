import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <h1>全体ダッシュボード</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>顧客数</h3>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <h3>進行中の案件</h3>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <h3>タスク</h3>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <h3>今月の売上</h3>
          <p className="stat-value">¥0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;