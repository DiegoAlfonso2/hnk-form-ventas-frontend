import React from 'react';
import type { ContactInfo } from '../../hooks/useCart';
import { User, Phone, Mail, Clock, MessageSquare, Store } from 'lucide-react';

interface ContactFormProps {
  contact: ContactInfo;
  onChange: (contact: ContactInfo) => void;
  isReadOnlyContact?: boolean;
}

export const ContactForm: React.FC<ContactFormProps> = ({ contact, onChange, isReadOnlyContact = false }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ ...contact, [name]: value });
  };

  const timeSlots = [
    { value: '13-14', label: '13:00 a 14:00 hs' },
    { value: '14-15', label: '14:00 a 15:00 hs' },
    { value: '15-16', label: '15:00 a 16:00 hs' },
    { value: '16-17', label: '16:00 a 17:00 hs' },
    { value: '17-18', label: '17:00 a 18:00 hs' },
    { value: 'evento-fin', label: 'Al finalizar el evento' }
  ];

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

      {/* Static Pickup Details Box */}
      <div className="glass-panel" style={{ padding: '1rem', background: 'var(--hnk-blue-light)', marginBottom: '1.25rem', borderColor: 'var(--accent-blue)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <Store size={22} style={{ color: 'var(--hnk-blue)', flexShrink: 0, marginTop: '0.125rem' }} />
        <div>
          <strong style={{ fontFamily: 'var(--font-display)', color: 'var(--hnk-blue)', fontSize: '0.95rem', display: 'block' }}>Retiro de Pedidos</strong>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>Todos los pedidos se retiran únicamente en el Colegio (Ingreso por Pringles 268) el Sábado 06 de Junio.</span>
        </div>
      </div>

      {/* Time Slot Selection Dropdown */}
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="deliveryTimeSlot" className="form-label">Franja Horaria de Entrega</label>
        <div style={{ position: 'relative' }}>
          <select
            id="deliveryTimeSlot"
            name="deliveryTimeSlot"
            className="form-control"
            value={contact.deliveryTimeSlot}
            onChange={handleChange}
            required
            style={{ paddingLeft: '2.75rem', appearance: 'none', cursor: 'pointer' }}
          >
            <option value="" disabled>Selecciona un horario de retiro...</option>
            {timeSlots.map(slot => (
              <option key={slot.value} value={slot.value}>{slot.label}</option>
            ))}
          </select>
          <Clock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', opacity: 0.8, pointerEvents: 'none' }} />
          {/* Dropdown Arrow Indicator */}
          <div style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid currentColor' }} />
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label htmlFor="notes" className="form-label">Notas Adicionales (Opcional)</label>
        <div style={{ position: 'relative' }}>
          <textarea
            id="notes"
            name="notes"
            className="form-control"
            placeholder="Aclaraciones sobre alergias, indicaciones especiales, etc..."
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
