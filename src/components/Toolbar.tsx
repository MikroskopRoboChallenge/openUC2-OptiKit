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
    redo,
    centerView,
    annotationMode,
    setAnnotationMode
  } = useAppStore();

  const handleExport = () => {
    const data = exportData();
    
    // Use File System Access API if available, otherwise fallback to prompt
    if ('showSaveFilePicker' in window) {
      // Modern browsers with File System Access API
      const saveFile = async () => {
        try {
          const fileHandle = await (window as any).showSaveFilePicker({
            types: [{
              description: 'JSON files',
              accept: {
                'application/json': ['.json'],
              },
            }],
            suggestedName: 'optikit-layout.json',
          });
          
          const writable = await fileHandle.createWritable();
          await writable.write(data);
          await writable.close();
        } catch (error) {
          // User cancelled or error occurred
          console.log('Save cancelled or failed:', error);
        }
      };
      saveFile();
    } else {
      // Fallback for older browsers - prompt for filename
      const defaultName = 'optikit-layout.json';
      const filename = prompt('Enter filename:', defaultName) || defaultName;
      
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename.endsWith('.json') ? filename : filename + '.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleShare = () => {
    const data = exportData();
    const subject = 'OpenUC2 OptiKit Layout';
    const body = `I've created an optical system layout using OpenUC2 OptiKit!

Please find the layout configuration below. You can import this into OpenUC2 OptiKit by copying the JSON data and using the Import function.

Layout Configuration:
${data}

Best regards`;
    
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Try to open in default mail client
    const link = document.createElement('a');
    link.href = mailtoUrl;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div className="toolbar-logo">
        <div className="toolbar-logo-icon">UC2</div>
        <span className="toolbar-logo-text">openUC2</span>
      </div>

      <div className="toolbar-separator" />

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
        <button 
          className="toolbar-button"
          onClick={centerView}
          title="Center View"
        >
          ⌖
        </button>
      </div>

      <div className="toolbar-separator" />

      <div className="toolbar-group">
        <button 
          className={`toolbar-button ${annotationMode === 'line' ? 'active' : ''}`}
          onClick={() => setAnnotationMode(annotationMode === 'line' ? 'none' : 'line')}
          title="Draw Line"
        >
          ╱
        </button>
        <button 
          className={`toolbar-button ${annotationMode === 'arrow' ? 'active' : ''}`}
          onClick={() => setAnnotationMode(annotationMode === 'arrow' ? 'none' : 'arrow')}
          title="Draw Arrow"
        >
          ↗
        </button>
        <button 
          className={`toolbar-button ${annotationMode === 'optical-axis' ? 'active' : ''}`}
          onClick={() => setAnnotationMode(annotationMode === 'optical-axis' ? 'none' : 'optical-axis')}
          title="Draw Optical Axis"
        >
          ⟷
        </button>
        <button 
          className={`toolbar-button ${annotationMode === 'text' ? 'active' : ''}`}
          onClick={() => setAnnotationMode(annotationMode === 'text' ? 'none' : 'text')}
          title="Add Text"
        >
          T
        </button>
      </div>

      <div className="toolbar-separator" />

      <div className="toolbar-group">
        <button 
          className="toolbar-button"
          onClick={handleExport}
          title="Save Layout As..."
        >
          💾
        </button>
        <button 
          className="toolbar-button"
          onClick={handleShare}
          title="Share via Email"
        >
          ✉
        </button>
        <button 
          className="toolbar-button"
          onClick={handleImport}
          title="Import Layout"
        >
          📁
        </button>
      </div>

      <div className="toolbar-title">
        <h1>OptiKit - 2D Grid Builder</h1>
      </div>
    </div>
  );
};