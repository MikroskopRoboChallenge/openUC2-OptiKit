import React from 'react';
import { PartLibrary } from './PartLibrary';
import { GridCanvas } from './GridCanvas';
import { LayerPanel } from './LayerPanel';
import { PropertyPanel } from './PropertyPanel';
import { Toolbar } from './Toolbar';
import './Layout.css';

export const Layout: React.FC = () => {
  return (
    <div className="layout">
      <div className="layout-toolbar">
        <Toolbar />
      </div>
      
      <div className="layout-main">
        <div className="layout-sidebar-left">
          <PartLibrary />
        </div>
        
        <div className="layout-canvas">
          <GridCanvas />
        </div>
        
        <div className="layout-sidebar-right">
          <LayerPanel />
          <PropertyPanel />
        </div>
      </div>
    </div>
  );
};