import React from 'react';
import { ContentNode, DifficultyLevel } from '@/types/content';

interface ExerciseCardProps {
  exercise: ContentNode;
  onClick: (id: string) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onClick }) => {
  return (
    <div className="exercise-card" onClick={() => onClick(exercise.id)}>
      <div className="exercise-details">
        <div className="exercise-difficulty">
          <span>Level: {exercise.level || 'Beginner'}</span>
        </div>
        <div className="exercise-time">
          <span>Est. Time: {exercise.duration || 10} min</span>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;