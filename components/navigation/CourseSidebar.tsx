import React from 'react';
import Link from 'next/link';
import { NavItem } from '../../lib/contentService';

interface CourseSidebarProps {
  navigationHierarchy: NavItem[];
  currentSlug: string[];
}

const renderNavItems = (items: NavItem[], currentPath: string, level = 0) => {
  return (
    <ul style={{ listStyle: 'none', paddingLeft: `${level * 20}px` }}>
      {items.map((item) => {
        const isActive = item.path === currentPath;
        return (
          <li key={item.path} style={{ fontWeight: isActive ? 'bold' : 'normal', margin: '5px 0' }}>
            <Link href={item.path}>
              <a>{item.title} ({item.type})</a>
            </Link>
            {item.children && item.children.length > 0 && renderNavItems(item.children, currentPath, level + 1)}
          </li>
        );
      })}
    </ul>
  );
};

const CourseSidebar: React.FC<CourseSidebarProps> = ({ navigationHierarchy, currentSlug }) => {
  const currentPath = `/courses/${currentSlug.join('/')}`;
  return (
    <aside style={{ width: '250px', borderRight: '1px solid #eee', padding: '20px', height: '100vh', overflowY: 'auto' }}>
      <h3>Courses</h3>
      {renderNavItems(navigationHierarchy, currentPath)}
    </aside>
  );
};

export default CourseSidebar;
