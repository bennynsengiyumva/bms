'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';
import { Card } from '@/components/ui';

interface HierarchyNode {
  id: string;
  name: string;
  type: 'union' | 'field' | 'district' | 'church';
  children?: HierarchyNode[];
}

interface ChurchHierarchyProps {
  data: HierarchyNode[];
}

export function ChurchHierarchy({ data }: ChurchHierarchyProps) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNode = (node: HierarchyNode, level: number = 0) => {
    const isExpanded = expanded[node.id];
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="select-none">
        <div 
          className={`
            flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors
            ${level === 0 ? 'bg-blue-50 dark:bg-blue-900/20 mb-2' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
          `}
          style={{ marginLeft: `${level * 1.5}rem` }}
          onClick={() => hasChildren && toggleExpand(node.id)}
        >
          {hasChildren ? (
            <svg 
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <div className="w-4" />
          )}
          
          <span className={`
            text-sm font-medium
            ${level === 0 ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}
          `}>
            {node.name}
          </span>
          
          <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">
            {node.type}
          </span>
        </div>

        {isExpanded && hasChildren && (
          <div className="mt-1">
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {t.churches.hierarchyTitle || 'Church Hierarchy'}
      </h3>
      <div className="space-y-1">
        {data.map(node => renderNode(node))}
      </div>
    </Card>
  );
}
