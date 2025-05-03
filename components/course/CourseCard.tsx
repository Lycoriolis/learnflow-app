import React from 'react';
import { ContentNode } from '@/types/content';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    level?: string;
    duration?: number;
  };
  onClick: (id: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  return (
    <div className="course-card" onClick={() => onClick(course.id)}>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <div className="course-details">
        <div className="course-level">
          <span>Level: {course.level || 'Beginner'}</span>
        </div>
        <div className="course-duration">
          <span>Duration: {course.duration || 30} min</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;