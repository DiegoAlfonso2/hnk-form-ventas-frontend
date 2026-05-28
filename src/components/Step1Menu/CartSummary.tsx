import React from 'react';
import type { CartItem } from '../../hooks/useCart';
import { ShoppingBag, ArrowRight, Info } from 'lucide-react';

interface CartSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  isDelivery: boolean;
  isValid: boolean;
  onCheckout: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  cartItems,
  subtotal,
  deliveryFee,
  total,
  isDelivery,
  isValid,
  onCheckout
}) => {
  return (
    <section className="glass-panel animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'fit-content' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShoppingBag size={20} style={{ color: 'var(--color-primary)' }} />
        Resumen de Compra
      </h3>

      {cartItems.length === 0 ? (
        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '0.9rem' }}>Tu carrito está vacío.</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Selecciona platos del menú para empezar.</p>
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
              <div key={item.menuItem.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-main)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)', marginRight: '0.5rem' }}>
                    {item.quantity}x
                  </span>
                  {item.menuItem.name}
                </span>
                <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
                  ${(item.menuItem.price * item.quantity).toLocaleString('es-AR')}
                </span>
              </div>
            ))}
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--card-border)' }} />

          {/* Pricing Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ color: 'var(--text-main)' }}>${subtotal.toLocaleString('es-AR')}</span>
            </div>
            
            {isDelivery && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Envío</span>
                <span style={{ color: 'var(--text-main)' }}>${deliveryFee.toLocaleString('es-AR')}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Total a Pagar
              </span>
              <span style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '1.25rem', 
                fontWeight: 800, 
                color: 'var(--color-primary)',
                textShadow: '0 0 10px rgba(0, 229, 255, 0.2)'
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
          gap: '0.5rem', 
          background: 'rgba(168, 85, 247, 0.1)', 
          border: '1px solid rgba(168, 85, 247, 0.2)', 
          borderRadius: '12px', 
          padding: '0.75rem',
          fontSize: '0.8rem',
          color: 'var(--text-main)'
        }}>
          <Info size={16} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '0.125rem' }} />
          <div>
            <strong>Para realizar el pedido:</strong>
            <ul style={{ paddingLeft: '1rem', marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
              {cartItems.length === 0 && <li>Elige al menos 1 porción</li>}
              <li>Completa tus datos de contacto</li>
              {isDelivery && <li>Ingresa tu dirección de envío</li>}
            </ul>
          </div>
        </div>
      )}

      <button
        type="button"
        className="btn btn-primary"
        disabled={!isValid}
        onClick={onCheckout}
        style={{ width: '100%', padding: '1rem' }}
      >
        <span>Confirmar y Pagar</span>
        <ArrowRight size={18} />
      </button>
    </section>
  );
};
