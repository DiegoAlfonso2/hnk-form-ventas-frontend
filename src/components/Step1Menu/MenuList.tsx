import React from 'react';
import type { MenuItem } from '../../hooks/useCart';
import { Plus, Minus, Utensils } from 'lucide-react';

interface MenuListProps {
  menuItems: MenuItem[];
  quantities: Record<string, number>;
  onQuantityChange: (id: string, delta: number) => void;
}

export const MenuList: React.FC<MenuListProps> = ({ menuItems = [], quantities, onQuantityChange }) => {
  return (
    <section className="animate-fade-in">
      <h3 style={{ 
        fontFamily: 'var(--font-display)', 
        fontSize: '1.4rem', 
        marginBottom: '1.5rem', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        color: 'var(--hnk-blue)'
      }}>
        <Utensils size={22} style={{ color: 'var(--accent-pink)' }} />
        Menú de Platos
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
        {menuItems.map((item: MenuItem) => {
          const qty = quantities[item.id] || 0;
          return (
            <div key={item.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', minHeight: '140px', transition: 'all var(--transition-normal)' }}>
              
              {/* Card Banner / Header - Mobile responsive */}
              <div style={{ display: 'flex', flexDirection: 'row', flex: 1, padding: '1.25rem', gap: '1rem', alignItems: 'flex-start' }}>
                {/* Decorative Gradient Thumbnail */}
                <div style={{ 
                  width: '70px', 
                  height: '70px', 
                  background: item.image ? `url(/${item.image}) center/cover no-repeat` : item.imageColor, 
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '1.6rem',
                  fontFamily: 'var(--font-display)',
                  flexShrink: 0,
                  border: '2px solid var(--hnk-blue)',
                  boxShadow: '2px 2px 0px var(--hnk-blue)'
                }}>
                  {!item.image && item.name.charAt(0)}
                </div>

                {/* Info */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
                      {item.name}
                      {item.id === 'lasagna' && <span className="badge-delicioso">¡Más Pedido! ⭐️</span>}
                      {item.id === 'sorrentinos' && <span className="badge-delicioso">¡El Favorito! 🌸</span>}
                    </h4>
                    <span style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: 700, 
                      color: 'var(--hnk-blue)', 
                      fontFamily: 'var(--font-display)' 
                    }}>
                      ${item.price.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.4', margin: 0, color: 'var(--text-muted)' }}>
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Bottom Actions Area */}
              <div style={{ 
                borderTop: '2px solid var(--hnk-blue)', 
                background: 'var(--bg-secondary)', 
                padding: '0.75rem 1.25rem', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--hnk-blue)', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                  Porciones
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => onQuantityChange(item.id, -1)}
                    disabled={qty === 0}
                    style={{ 
                      width: '34px', 
                      height: '34px', 
                      padding: 0, 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: qty === 0 ? 'none' : '2px 2px 0px var(--hnk-blue)'
                    }}
                    aria-label={`Quitar porción de ${item.name}`}
                  >
                    <Minus size={14} />
                  </button>

                  <span style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontWeight: 700, 
                    fontSize: '1.25rem', 
                    minWidth: '28px', 
                    textAlign: 'center',
                    color: qty > 0 ? 'var(--accent-pink)' : 'var(--text-muted)'
                  }}>
                    {qty}
                  </span>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => onQuantityChange(item.id, 1)}
                    style={{ 
                      width: '34px', 
                      height: '34px', 
                      padding: 0, 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '2px 2px 0px var(--hnk-blue)'
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
