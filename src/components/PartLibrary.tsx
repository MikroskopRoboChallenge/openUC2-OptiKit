import React, { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import type { ModuleDefinition } from '../types';
import './PartLibrary.css';

export const PartLibrary: React.FC = () => {
  const { modules } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent, moduleId: string) => {
    e.dataTransfer.setData('moduleId', moduleId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const renderModuleTile = (module: ModuleDefinition) => {
    return (
      <div
        key={module.id}
        className="module-tile"
        draggable
        onDragStart={(e) => handleDragStart(e, module.id)}
      >
        <div 
          className="module-preview"
          style={{ backgroundColor: module.color }}
        >
          <div className="module-footprint">
            {module.footprint.width} × {module.footprint.height}
          </div>
        </div>
        <div className="module-info">
          <div className="module-name">{module.name}</div>
          <div className="module-description">
            {module.footprint.width} × {module.footprint.height} cells
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="part-library">
      <div className="part-library-header">
        <h3>Part Library</h3>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search parts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="part-library-content">
        <div className="module-grid">
          {filteredModules.map(renderModuleTile)}
        </div>
        
        {filteredModules.length === 0 && (
          <div className="no-results">
            No parts found matching "{searchTerm}"
          </div>
        )}
      </div>
      
      <div className="part-library-footer">
        <p className="drag-hint">
          💡 Drag parts onto the canvas to place them
        </p>
      </div>
    </div>
  );
};