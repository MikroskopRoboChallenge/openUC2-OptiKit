import React from 'react';
import { useAppStore } from '../stores/appStore';
import './LayerPanel.css';

export const LayerPanel: React.FC = () => {
  const { 
    layers, 
    activeLayerId, 
    setActiveLayer, 
    addLayer, 
    removeLayer 
  } = useAppStore();

  const handleAddLayer = () => {
    const layerName = `Layer ${layers.length}`;
    addLayer(layerName);
  };

  const handleRemoveLayer = (layerId: string) => {
    if (layers.length > 1) {
      removeLayer(layerId);
    }
  };

  return (
    <div className="layer-panel">
      <div className="layer-panel-header">
        <h4>Layers</h4>
        <button 
          className="add-layer-button"
          onClick={handleAddLayer}
          title="Add Layer"
        >
          +
        </button>
      </div>
      
      <div className="layer-list">
        {layers.map((layer) => (
          <div 
            key={layer.id}
            className={`layer-item ${activeLayerId === layer.id ? 'active' : ''}`}
            onClick={() => setActiveLayer(layer.id)}
          >
            <div className="layer-info">
              <span className="layer-name">{layer.name}</span>
              <span className="layer-index">Z: {layer.index}</span>
            </div>
            {layers.length > 1 && (
              <button 
                className="remove-layer-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveLayer(layer.id);
                }}
                title="Remove Layer"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};