import React from 'react';
import { MENU_ITEMS } from '../../hooks/useCart';
import type { MenuItem } from '../../hooks/useCart';
import { Plus, Minus, Utensils } from 'lucide-react';

interface MenuListProps {
  quantities: Record<string, number>;
  onQuantityChange: (id: string, delta: number) => void;
}

export const MenuList: React.FC<MenuListProps> = ({ quantities, onQuantityChange }) => {
  return (
    <section className="animate-fade-in">
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Utensils size={20} style={{ color: 'var(--color-primary)' }} />
        Nuestra Carta
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
        {MENU_ITEMS.map((item: MenuItem) => {
          const qty = quantities[item.id] || 0;
          return (
            <div key={item.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', minHeight: '140px', transition: 'all var(--transition-normal)' }}>
              
              {/* Card Banner / Header - Mobile responsive */}
              <div style={{ display: 'flex', flexDirection: 'row', flex: 1, padding: '1.25rem', gap: '1rem', alignItems: 'flex-start' }}>
                {/* Decorative Gradient Thumbnail */}
                <div style={{ 
                  width: '70px', 
                  height: '70px', 
                  background: item.imageColor, 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  fontFamily: 'var(--font-display)',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                  {item.name.charAt(0)}
                </div>

                {/* Info */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
                      {item.name}
                    </h4>
                    <span style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 700, 
                      color: 'var(--color-primary)', 
                      fontFamily: 'var(--font-display)' 
                    }}>
                      ${item.price.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', lineHeight: '1.4', margin: 0, color: 'var(--text-muted)' }}>
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Bottom Actions Area */}
              <div style={{ 
                borderTop: '1px solid var(--card-border)', 
                background: 'rgba(0,0,0,0.15)', 
                padding: '0.75rem 1.25rem', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Porciones
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => onQuantityChange(item.id, -1)}
                    disabled={qty === 0}
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      padding: 0, 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                    aria-label={`Quitar porción de ${item.name}`}
                  >
                    <Minus size={14} />
                  </button>

                  <span style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontWeight: 700, 
                    fontSize: '1.1rem', 
                    minWidth: '24px', 
                    textAlign: 'center',
                    color: qty > 0 ? 'var(--color-primary)' : 'var(--text-muted)'
                  }}>
                    {qty}
                  </span>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => onQuantityChange(item.id, 1)}
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      padding: 0, 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                    aria-label={`Agregar porción de ${item.name}`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
