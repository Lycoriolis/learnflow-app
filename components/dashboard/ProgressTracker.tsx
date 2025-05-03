import React from 'react';

interface ProgressData {
  completed: number;
  total: number;
  lastActivity?: string;
}

interface ProgressTrackerProps {
  data: ProgressData;
  title: string;
  showDetails?: boolean;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  data, 
  title, 
  showDetails = true 
}) => {
  const progressPercentage = data.total > 0 
    ? Math.round((data.completed / data.total) * 100) 
    : 0;

  return (
    <div className="progress-tracker">
      <h3>{title}</h3>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="progress-stats">
        <span>{progressPercentage}% Complete</span>
        <span>{data.completed} / {data.total} Items</span>
      </div>
      {showDetails && data.lastActivity && (
        <div className="last-activity">
          Last activity: {data.lastActivity}
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;