import React from 'react';
import { useAppStore } from '../stores/appStore';
import './PropertyPanel.css';

export const PropertyPanel: React.FC = () => {
  const { 
    selectedItemId, 
    selectedItemType, 
    placedModules, 
    annotations, 
    modules,
    removeModule,
    removeAnnotation,
    rotateModule
  } = useAppStore();

  if (!selectedItemId || !selectedItemType) {
    return (
      <div className="property-panel">
        <div className="property-panel-header">
          <h4>Properties</h4>
        </div>
        <div className="property-panel-content">
          <p className="no-selection">Select an item to view its properties</p>
        </div>
      </div>
    );
  }

  const renderModuleProperties = () => {
    const module = placedModules.find(m => m.id === selectedItemId);
    if (!module) return null;

    const moduleDefinition = modules.find(m => m.id === module.moduleId);
    if (!moduleDefinition) return null;

    const handleRotate = () => {
      const newRotation = (module.rotation + 90) % 360;
      rotateModule(module.id, newRotation);
    };

    return (
      <div className="property-content">
        <div className="property-group">
          <h5>Module Info</h5>
          <div className="property-item">
            <label>Name:</label>
            <span>{moduleDefinition.name}</span>
          </div>
          <div className="property-item">
            <label>Position:</label>
            <span>({module.position.x}, {module.position.y})</span>
          </div>
          <div className="property-item">
            <label>Rotation:</label>
            <span>{module.rotation}°</span>
          </div>
          <div className="property-item">
            <label>Layer:</label>
            <span>{module.layer}</span>
          </div>
          <div className="property-item">
            <label>Footprint:</label>
            <span>
              {module.rotation === 90 || module.rotation === 270 ? 
                `${moduleDefinition.footprint.height} × ${moduleDefinition.footprint.width}` : 
                `${moduleDefinition.footprint.width} × ${moduleDefinition.footprint.height}`}
            </span>
          </div>
        </div>

        <div className="property-group">
          <h5>Actions</h5>
          <div className="property-actions">
            <button 
              className="property-button"
              onClick={handleRotate}
            >
              Rotate 90°
            </button>
            <button 
              className="property-button danger"
              onClick={() => removeModule(module.id)}
            >
              Delete
            </button>
          </div>
        </div>

        {module.params && Object.keys(module.params).length > 0 && (
          <div className="property-group">
            <h5>Parameters</h5>
            {Object.entries(module.params).map(([key, value]) => (
              <div key={key} className="property-item">
                <label>{key}:</label>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAnnotationProperties = () => {
    const annotation = annotations.find(a => a.id === selectedItemId);
    if (!annotation) return null;

    return (
      <div className="property-content">
        <div className="property-group">
          <h5>Annotation Info</h5>
          <div className="property-item">
            <label>Type:</label>
            <span>{annotation.type}</span>
          </div>
          <div className="property-item">
            <label>Layer:</label>
            <span>{annotation.layer}</span>
          </div>
          {annotation.text && (
            <div className="property-item">
              <label>Text:</label>
              <span>{annotation.text}</span>
            </div>
          )}
        </div>

        <div className="property-group">
          <h5>Actions</h5>
          <div className="property-actions">
            <button 
              className="property-button danger"
              onClick={() => removeAnnotation(annotation.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="property-panel">
      <div className="property-panel-header">
        <h4>Properties</h4>
      </div>
      <div className="property-panel-content">
        {selectedItemType === 'module' && renderModuleProperties()}
        {selectedItemType === 'annotation' && renderAnnotationProperties()}
      </div>
    </div>
  );
};