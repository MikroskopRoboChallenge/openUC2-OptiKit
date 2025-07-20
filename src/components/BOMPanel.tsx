import React from 'react';
import { useAppStore } from '../stores/appStore';
import './BOMPanel.css';

export const BOMPanel: React.FC = () => {
  const { placedModules, modules } = useAppStore();

  // Calculate BOM from placed modules
  const bomItems = React.useMemo(() => {
    const bomMap = new Map<string, { module: any; count: number; totalPrice: number }>();
    
    placedModules.forEach(placedModule => {
      const moduleDefinition = modules.find(m => m.id === placedModule.moduleId);
      if (moduleDefinition) {
        const key = moduleDefinition.id;
        const existing = bomMap.get(key);
        const price = (moduleDefinition.defaultParams as any)?.price || 0;
        
        if (existing) {
          existing.count += 1;
          existing.totalPrice += price;
        } else {
          bomMap.set(key, {
            module: moduleDefinition,
            count: 1,
            totalPrice: price
          });
        }
      }
    });
    
    return Array.from(bomMap.values()).sort((a, b) => a.module.name.localeCompare(b.module.name));
  }, [placedModules, modules]);

  const totalCost = bomItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="bom-panel">
      <h3>Bill of Materials (BOM)</h3>
      
      {bomItems.length === 0 ? (
        <p className="empty-state">No modules placed yet</p>
      ) : (
        <>
          <div className="bom-summary">
            <p><strong>Total Items:</strong> {bomItems.reduce((sum, item) => sum + item.count, 0)}</p>
            <p><strong>Unique Modules:</strong> {bomItems.length}</p>
            <p><strong>Total Cost:</strong> ${totalCost.toFixed(2)}</p>
          </div>
          
          <div className="bom-list">
            <div className="bom-header">
              <span>Module</span>
              <span>Qty</span>
              <span>Unit Cost</span>
              <span>Total</span>
            </div>
            
            {bomItems.map((item, index) => {
              const unitPrice = (item.module.defaultParams as any)?.price || 0;
              return (
                <div key={index} className="bom-item">
                  <div className="module-info">
                    <div className="module-name">{item.module.name}</div>
                    <div className="module-id">{item.module.id}</div>
                    {item.module.autodeskInventor && (
                      <div className="module-inventor">{item.module.autodeskInventor}</div>
                    )}
                  </div>
                  <span className="quantity">{item.count}</span>
                  <span className="unit-price">${unitPrice.toFixed(2)}</span>
                  <span className="total-price">${item.totalPrice.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};