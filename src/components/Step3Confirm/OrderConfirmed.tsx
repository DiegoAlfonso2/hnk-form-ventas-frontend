import React from 'react';
import { CheckCircle, Mail, HelpCircle, ArrowRight } from 'lucide-react';
import type { ContactInfo, CartItem } from '../../hooks/useCart';

interface OrderConfirmedProps {
  orderNumber: string;
  contact: ContactInfo;
  cartItems: CartItem[];
  total: number;
  onCompleted: () => void;
}

export const OrderConfirmed: React.FC<OrderConfirmedProps> = ({
  orderNumber,
  contact,
  cartItems,
  total,
  onCompleted,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '650px', margin: '0 auto' }} className="animate-fade-in">
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: 'var(--success-light)', 
          color: 'var(--success)', 
          borderRadius: '50%', 
          padding: '1.2rem', 
          marginBottom: '1rem', 
          border: '3px solid var(--success)',
          boxShadow: '3px 3px 0px var(--success)'
        }}>
          <CheckCircle size={48} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--hnk-blue)', marginBottom: '0.5rem', fontSize: '2rem' }}>
          ¡Comprobante Recibido!
        </h2>
        <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
          La Administración del colegio controlará el comprobante de pago para confirmar tu pedido <strong style={{ color: 'var(--accent-pink)' }}>#{orderNumber}</strong>.
        </p>
      </div>

      {/* Info panel */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Mail size={24} style={{ color: 'var(--accent-pink)', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--hnk-blue)', marginBottom: '0.25rem', fontSize: '1.05rem' }}>
              Revisa tu correo
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.4 }}>
              Te debería haber llegado un correo de confirmación con tu código QR de retiro.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <HelpCircle size={24} style={{ color: 'var(--accent-pink)', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--hnk-blue)', marginBottom: '0.25rem', fontSize: '1.05rem' }}>
              Formas de retiro
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.4 }}>
              Puedes retirar tu pedido en el festival presentando el <strong>código QR</strong>, indicando el número de pedido (<strong>#{orderNumber}</strong>) o indicando el nombre registrado en el formulario (<strong>{contact.name}</strong>).
            </p>
          </div>
        </div>
      </div>

      {/* Summary of order */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--hnk-blue)' }}>
          Resumen del Pago
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          {cartItems.map(item => (
            <div key={item.menuItem.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span>{item.quantity}x {item.menuItem.name}</span>
              <span style={{ fontWeight: 700 }}>${(item.menuItem.price * item.quantity).toLocaleString('es-AR')}</span>
            </div>
          ))}
        </div>
        <hr style={{ border: 0, borderTop: '2px solid var(--hnk-blue-light)', margin: '0.75rem 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--hnk-blue)' }}>Total Abonado</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>
            ${total.toLocaleString('es-AR')}
          </span>
        </div>
      </div>

      {/* Help section */}
      <div style={{
        background: 'var(--accent-yellow-light)',
        border: '2px solid var(--accent-yellow)',
        borderRadius: '18px',
        padding: '1.2rem',
        color: 'var(--text-main)',
        fontSize: '0.9rem',
        fontWeight: 600,
        lineHeight: 1.4,
        boxShadow: 'var(--card-shadow)'
      }}>
        💡 Si necesitas modificar o cancelar el pedido ahora que realizaste el pago, escríbenos a la brevedad a <a href="mailto:hahanokai@nichiagakuin.edu.ar" style={{ color: 'var(--hnk-blue)', fontWeight: 700, textDecoration: 'underline' }}>hahanokai@nichiagakuin.edu.ar</a>.
      </div>

      {/* Finish button */}
      <button
        type="button"
        className="btn btn-primary"
        onClick={onCompleted}
        style={{ padding: '1rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
      >
        Volver al Inicio <ArrowRight size={18} />
      </button>
    </div>
  );
};
