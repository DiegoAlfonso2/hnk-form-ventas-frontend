import React from 'react';
import type { ContactInfo } from '../../hooks/useCart';
import { User, Phone, Mail, MapPin, MessageSquare, Truck, Store } from 'lucide-react';

interface ContactFormProps {
  contact: ContactInfo;
  onChange: (contact: ContactInfo) => void;
  isReadOnlyContact?: boolean;
}

export const ContactForm: React.FC<ContactFormProps> = ({ contact, onChange, isReadOnlyContact = false }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ ...contact, [name]: value });
  };

  const setDeliveryType = (type: 'delivery' | 'pickup') => {
    onChange({ ...contact, deliveryType: type });
  };

  return (
    <section className="glass-panel animate-fade-in" style={{ padding: '1.5rem', height: '100%' }}>
      <h3 style={{ 
        fontFamily: 'var(--font-display)', 
        fontSize: '1.4rem', 
        marginBottom: '1.5rem', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        color: 'var(--hnk-blue)'
      }}>
        <User size={22} style={{ color: 'var(--accent-pink)' }} />
        Datos de Contacto
      </h3>

      <div className="form-group">
        <label htmlFor="name" className="form-label">Nombre Completo {isReadOnlyContact && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(No editable)</span>}</label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            placeholder="Juan Pérez"
            value={contact.name}
            onChange={handleChange}
            required
            disabled={isReadOnlyContact}
            style={{ paddingLeft: '2.75rem', opacity: isReadOnlyContact ? 0.7 : 1, cursor: isReadOnlyContact ? 'not-allowed' : 'text' }}
          />
          <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', opacity: 0.8 }} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone" className="form-label">Teléfono / WhatsApp {isReadOnlyContact && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(No editable)</span>}</label>
          <div style={{ position: 'relative' }}>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-control"
              placeholder="+54 9 11 1234 5678"
              value={contact.phone}
              onChange={handleChange}
              required
              disabled={isReadOnlyContact}
              style={{ paddingLeft: '2.75rem', opacity: isReadOnlyContact ? 0.7 : 1, cursor: isReadOnlyContact ? 'not-allowed' : 'text' }}
            />
            <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', opacity: 0.8 }} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email {isReadOnlyContact && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(No editable)</span>}</label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="juan@email.com"
              value={contact.email}
              onChange={handleChange}
              required
              disabled={isReadOnlyContact}
              style={{ paddingLeft: '2.75rem', opacity: isReadOnlyContact ? 0.7 : 1, cursor: isReadOnlyContact ? 'not-allowed' : 'text' }}
            />
            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', opacity: 0.8 }} />
          </div>
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
        <label className="form-label">Método de Entrega</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.25rem' }}>
          <button
            type="button"
            className={`btn ${contact.deliveryType === 'pickup' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setDeliveryType('pickup')}
            style={{ padding: '0.75rem' }}
          >
            <Store size={18} />
            Retiro en Local
          </button>
          <button
            type="button"
            className={`btn ${contact.deliveryType === 'delivery' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setDeliveryType('delivery')}
            style={{ padding: '0.75rem' }}
          >
            <Truck size={18} />
            Envío a Domicilio
          </button>
        </div>
      </div>

      {contact.deliveryType === 'delivery' ? (
        <div className="form-group animate-fade-in">
          <label htmlFor="address" className="form-label">Dirección de Envío</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              id="address"
              name="address"
              className="form-control"
              placeholder="Av. Santa Fe 1234, CABA"
              value={contact.address}
              onChange={handleChange}
              required
              style={{ paddingLeft: '2.75rem' }}
            />
            <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', opacity: 0.8 }} />
          </div>
        </div>
      ) : (
        <div className="glass-panel animate-fade-in" style={{ padding: '1rem', background: 'var(--bg-secondary)', marginBottom: '1.25rem', borderStyle: 'dashed' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <Store size={18} style={{ color: 'var(--accent-pink)', marginTop: '0.125rem', flexShrink: 0 }} />
            <span>
              <strong>Punto de retiro:</strong> Ingreso por Pringles 268 (Colegio HNK).
              <br />
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Horario: Sábado 06 de Junio a partir de las 13:00 hs.</span>
            </span>
          </p>
        </div>
      )}

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label htmlFor="notes" className="form-label">Notas Adicionales (Opcional)</label>
        <div style={{ position: 'relative' }}>
          <textarea
            id="notes"
            name="notes"
            className="form-control"
            placeholder="Aclaraciones sobre alergias, indicaciones para retirar, etc..."
            value={contact.notes}
            onChange={handleChange}
            rows={3}
            style={{ paddingLeft: '2.75rem', resize: 'none' }}
          />
          <MessageSquare size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-muted)', opacity: 0.8 }} />
        </div>
      </div>
    </section>
  );
};
