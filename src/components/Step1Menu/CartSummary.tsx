import React from 'react';
import type { CartItem } from '../../hooks/useCart';
import { ShoppingBag, ArrowRight, Info } from 'lucide-react';

interface CartSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  total: number;
  isValid: boolean;
  onCheckout: () => void;
  isEditing?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  cartItems,
  subtotal,
  total,
  isValid,
  onCheckout,
  isEditing = false
}) => {
  return (
    <section className="glass-panel animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'fit-content' }}>
      <h3 style={{ 
        fontFamily: 'var(--font-display)', 
        fontSize: '1.4rem', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        color: 'var(--hnk-blue)'
      }}>
        <ShoppingBag size={22} style={{ color: 'var(--accent-pink)' }} />
        Resumen del Pedido
      </h3>

      {cartItems.length === 0 ? (
        <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1rem', fontWeight: 600 }}>El carrito está vacío 🌸</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Agrega porciones de los platos para continuar.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Cart Items List */}
          <div style={{ 
            maxHeight: '200px', 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.75rem', 
            paddingRight: '0.5rem' 
          }}>
            {cartItems.map(item => (
              <div key={item.menuItem.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
                  <span style={{ fontWeight: 800, color: 'var(--accent-pink)', marginRight: '0.5rem' }}>
                    {item.quantity}x
                  </span>
                  {item.menuItem.name}
                </span>
                <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>
                  ${(item.menuItem.price * item.quantity).toLocaleString('es-AR')}
                </span>
              </div>
            ))}
          </div>

          <hr style={{ border: 0, borderTop: '2px solid var(--hnk-blue-light)' }} />

          {/* Pricing Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Subtotal</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>${subtotal.toLocaleString('es-AR')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--hnk-blue)' }}>
                Total a Pagar
              </span>
              <span style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '1.4rem', 
                fontWeight: 800, 
                color: 'var(--accent-pink)'
              }}>
                ${total.toLocaleString('es-AR')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Validation Warnings */}
      {!isValid && (
        <div style={{ 
          display: 'flex', 
          gap: '0.6rem', 
          background: 'var(--accent-yellow-light)', 
          border: '2px solid var(--accent-yellow)', 
          borderRadius: '16px', 
          padding: '0.85rem',
          fontSize: '0.85rem',
          color: 'var(--text-main)'
        }}>
          <Info size={18} style={{ color: 'var(--hnk-blue)', flexShrink: 0, marginTop: '0.125rem' }} />
          <div>
            <strong style={{ fontFamily: 'var(--font-display)', color: 'var(--hnk-blue)' }}>Completar datos:</strong>
            <ul style={{ paddingLeft: '1.1rem', marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', fontWeight: 600 }}>
              {cartItems.length === 0 && <li>Selecciona al menos 1 porción</li>}
              <li>Completa tus datos de contacto</li>
              <li>Selecciona una franja horaria de entrega</li>
            </ul>
          </div>
        </div>
      )}

      <button
        type="button"
        className="btn btn-primary"
        disabled={!isValid}
        onClick={onCheckout}
        style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}
      >
        <span>{isEditing ? 'Actualizar Pedido' : 'Confirmar Pedido'}</span>
        <ArrowRight size={18} />
      </button>
    </section>
  );
};
