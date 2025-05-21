import React, { ReactNode } from 'react';
import CourseSidebar from '../navigation/CourseSidebar'; // We'll create this next
import { NavItem } from '../../lib/contentService'; // Assuming NavItem is exported

interface CourseLayoutProps {
  children: ReactNode;
  navigationHierarchy: NavItem[];
  currentSlug: string[];
}

const CourseLayout: React.FC<CourseLayoutProps> = ({ children, navigationHierarchy, currentSlug }) => {
  return (
    <div style={{ display: 'flex' }}>
      <CourseSidebar navigationHierarchy={navigationHierarchy} currentSlug={currentSlug} />
      <main style={{ flexGrow: 1, padding: '20px' }}>
        {/* Header can go here */}
        {children}
        {/* Footer can go here */}
      </main>
    </div>
  );
};

export default CourseLayout;
