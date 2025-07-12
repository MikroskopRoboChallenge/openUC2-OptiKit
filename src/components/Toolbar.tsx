import React from 'react';
import { useAppStore } from '../stores/appStore';
import './Toolbar.css';

export const Toolbar: React.FC = () => {
  const { 
    grid, 
    setGridConfig, 
    exportData, 
    importData, 
    undo, 
    redo 
  } = useAppStore();

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optikit-layout.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target?.result as string;
          importData(data);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button 
          className="toolbar-button"
          onClick={undo}
          title="Undo"
        >
          ↶
        </button>
        <button 
          className="toolbar-button"
          onClick={redo}
          title="Redo"
        >
          ↷
        </button>
      </div>

      <div className="toolbar-separator" />

      <div className="toolbar-group">
        <button 
          className={`toolbar-button ${grid.gridVisible ? 'active' : ''}`}
          onClick={() => setGridConfig({ gridVisible: !grid.gridVisible })}
          title="Toggle Grid"
        >
          #
        </button>
        <button 
          className={`toolbar-button ${grid.snapEnabled ? 'active' : ''}`}
          onClick={() => setGridConfig({ snapEnabled: !grid.snapEnabled })}
          title="Toggle Snap to Grid"
        >
          ⊞
        </button>
      </div>

      <div className="toolbar-separator" />

      <div className="toolbar-group">
        <button 
          className="toolbar-button"
          onClick={handleExport}
          title="Export Layout"
        >
          ↓
        </button>
        <button 
          className="toolbar-button"
          onClick={handleImport}
          title="Import Layout"
        >
          ↑
        </button>
      </div>

      <div className="toolbar-title">
        <h1>OpenUC2 OptiKit - 2D Grid Builder</h1>
      </div>
    </div>
  );
};