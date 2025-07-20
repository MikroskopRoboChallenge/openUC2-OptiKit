import React from 'react';
import { useAppStore } from '../stores/appStore';
import './Toolbar.css';

export const Toolbar: React.FC = () => {
  const { 
    grid, 
    setGridConfig, 
    exportData, 
    exportToPyInventor,
    shareToGitHubDiscussions,
    downloadSTLBundle,
    importData, 
    importFromUrl,
    undo, 
    redo,
    centerView,
    annotationMode,
    setAnnotationMode,
    downloadScreenshot
  } = useAppStore();

  const handleExport = () => {
    const data = exportData();
    
    // Use File System Access API if available, otherwise fallback to prompt
    if ('showSaveFilePicker' in window) {
      // Modern browsers with File System Access API
      const saveFile = async () => {
        try {
          const fileHandle = await (window as unknown as { showSaveFilePicker: (options: unknown) => Promise<FileSystemFileHandle> }).showSaveFilePicker({
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

  const handleExportPyInventor = () => {
    const data = exportToPyInventor();
    
    // Use File System Access API if available, otherwise fallback to prompt
    if ('showSaveFilePicker' in window) {
      const saveFile = async () => {
        try {
          const fileHandle = await (window as unknown as { showSaveFilePicker: (options: unknown) => Promise<FileSystemFileHandle> }).showSaveFilePicker({
            types: [{
              description: 'JSON files',
              accept: {
                'application/json': ['.json'],
              },
            }],
            suggestedName: 'pyinventor-layout.json',
          });
          
          const writable = await fileHandle.createWritable();
          await writable.write(data);
          await writable.close();
        } catch (error) {
          console.log('Save cancelled or failed:', error);
        }
      };
      saveFile();
    } else {
      const defaultName = 'pyinventor-layout.json';
      const filename = prompt('Enter filename for PyInventor export:', defaultName) || defaultName;
      
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

  const handleExportSTL = () => {
    const password = prompt('Enter password to export STL files:');
    if (password === 'youseetoo') {
      downloadSTLBundle(password);
    } else if (password !== null) {
      alert('Incorrect password. Access denied.');
    }
  };

  const handleHelp = () => {
    const helpContent = `
OpenUC2 OptiKit - 2D Grid Builder Help

BASIC USAGE:
• Drag components from the Part Library to the grid
• Click components to select and view properties
• Use the rotate button to rotate selected components
• Use layer panel to work with different Z-levels

NAVIGATION:
• Mouse wheel: Zoom in/out
• Drag background: Pan the view
• Center button: Reset view to center

ANNOTATIONS:
• Line tool: Click to start, click again to finish
• Arrow tool: Click to start, click again to finish
• Optical Axis: Dashed line for optical paths
• Text tool: Click to place text

EXPORT/IMPORT:
• Save: Export layout to JSON file
• Share: Send layout via email
• Import: Load layout from JSON file
• Screenshot: Download PNG image of assembly

SHORTCUTS:
• Grid toggle: Show/hide grid lines
• Snap toggle: Enable/disable snap-to-grid
• Undo/Redo: Navigate through changes
`;
    
    alert(helpContent);
  };

  const handlePrivacy = () => {
    const privacyContent = `
OpenUC2 OptiKit - Privacy Policy

DATA STORAGE:
• Your layouts are stored locally in your browser
• No data is sent to external servers
• Email sharing uses your default mail client

COOKIES:
• We use localStorage to save your work
• No tracking cookies are used
• Data persists between sessions

EXTERNAL LINKS:
• STL files may link to external repositories
• Module data is loaded from local CSV files
• No personal information is collected

CONTACT:
For questions about data usage, contact:
openUC2 team via GitHub repository
`;
    
    alert(privacyContent);
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

  const handleImportFromUrl = async () => {
    const url = prompt('Enter URL to JSON layout file:');
    if (url) {
      const success = await importFromUrl(url);
      if (success) {
        alert('Layout imported successfully!');
      } else {
        alert('Failed to import layout from URL. Please check the URL and try again.');
      }
    }
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
        <button 
          className="toolbar-button"
          onClick={handleImportFromUrl}
          title="Import from URL"
        >
          🌐
        </button>
        <button 
          className="toolbar-button"
          onClick={handleExportPyInventor}
          title="Export for PyInventor"
        >
          🔧
        </button>
        <button 
          className="toolbar-button"
          onClick={downloadScreenshot}
          title="Download Screenshot"
        >
          📸
        </button>
        <button 
          className="toolbar-button"
          onClick={handleExportSTL}
          title="Export STL Files"
        >
          📦
        </button>
        <button 
          className="toolbar-button"
          onClick={shareToGitHubDiscussions}
          title="Share to GitHub Discussions"
        >
          🌐
        </button>
      </div>

      <div className="toolbar-separator" />

      <div className="toolbar-group">
        <button 
          className="toolbar-button"
          onClick={handleHelp}
          title="Help"
        >
          ❓
        </button>
        <button 
          className="toolbar-button"
          onClick={handlePrivacy}
          title="Privacy"
        >
          🔒
        </button>
      </div>

      <div className="toolbar-title">
        <h1>OptiKit - 2D Grid Builder</h1>
      </div>
    </div>
  );
};