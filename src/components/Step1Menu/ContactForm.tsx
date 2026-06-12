import React from 'react';
import type { ContactInfo } from '../../hooks/useCart';
import { User, Phone, Mail, Clock, Store, GraduationCap } from 'lucide-react';

interface ContactFormProps {
  contact: ContactInfo;
  onChange: (contact: ContactInfo) => void;
  isReadOnlyContact?: boolean;
  classSections: { id: string; description: string }[];
  timeSlotsEnabled?: boolean;
  timeSlotsRaw?: string | null;
}

const formatTimeSlot = (slot: string) => {
  if (slot === 'evento-fin') {
    return 'Al finalizar el evento';
  }
  const parts = slot.split('-');
  if (parts.length === 2) {
    const start = parts[0].trim();
    const end = parts[1].trim();
    if (!isNaN(Number(start)) && !isNaN(Number(end))) {
      return `${start}:00 a ${end}:00 hs`;
    }
  }
  return slot;
};

export const ContactForm: React.FC<ContactFormProps> = ({ 
  contact, 
  onChange, 
  isReadOnlyContact = false,
  classSections = [],
  timeSlotsEnabled = true,
  timeSlotsRaw = ''
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ ...contact, [name]: value });
  };

  const options = React.useMemo(() => {
    if (!timeSlotsRaw) return [];
    return timeSlotsRaw.split(',').map((slot) => {
      const trimmed = slot.trim();
      return {
        value: trimmed,
        label: formatTimeSlot(trimmed),
      };
    });
  }, [timeSlotsRaw]);

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

      {/* Class Section Dropdown */}
      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="classSection" className="form-label">Sala / Grado / Año del Alumno (Seleccione hija/o mayor - "Otros" si es externo al colegio) {isReadOnlyContact && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(No editable)</span>}</label>
        <div style={{ position: 'relative' }}>
          <select
            id="classSection"
            name="classSection"
            className="form-control"
            value={contact.classSection}
            onChange={handleChange}
            required
            disabled={isReadOnlyContact}
            style={{ 
              paddingLeft: '2.75rem', 
              appearance: 'none', 
              cursor: isReadOnlyContact ? 'not-allowed' : 'pointer',
              opacity: isReadOnlyContact ? 0.7 : 1
            }}
          >
            <option value="" disabled>Selecciona una sala o grado...</option>
            {classSections.map(section => (
              <option key={section.id} value={section.id}>{section.description}</option>
            ))}
          </select>
          <GraduationCap size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', opacity: 0.8, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid currentColor' }} />
        </div>
      </div>

      {/* Time Slot Selection Dropdown */}
      {timeSlotsEnabled && (
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="deliveryTimeSlot" className="form-label">Franja Horaria de Entrega</label>
          <div style={{ position: 'relative' }}>
            <select
              id="deliveryTimeSlot"
              name="deliveryTimeSlot"
              className="form-control"
              value={contact.deliveryTimeSlot}
              onChange={handleChange}
              required={timeSlotsEnabled}
              style={{ paddingLeft: '2.75rem', appearance: 'none', cursor: 'pointer' }}
            >
              <option value="" disabled>Selecciona un horario de retiro...</option>
              {options.map(slot => (
                <option key={slot.value} value={slot.value}>{slot.label}</option>
              ))}
            </select>
            <Clock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', opacity: 0.8, pointerEvents: 'none' }} />
            {/* Dropdown Arrow Indicator */}
            <div style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid currentColor' }} />
          </div>
        </div>
      )}

      {/* Static Pickup Details Box */}
      <div className="glass-panel" style={{ padding: '1rem', background: 'var(--hnk-blue-light)', marginTop: '1.25rem',marginBottom: '1.25rem', borderColor: 'var(--accent-blue)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <Store size={22} style={{ color: 'var(--hnk-blue)', flexShrink: 0, marginTop: '0.125rem' }} />
        <div>
          <strong style={{ fontFamily: 'var(--font-display)', color: 'var(--hnk-blue)', fontSize: '0.95rem', display: 'block' }}>Retiro de Pedidos</strong>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
            {timeSlotsEnabled
              ? 'Los pedidos se retiran en el comedor de Primaria en la franja horaria seleccionada.'
              : 'Los pedidos se retiran en el comedor de Primaria durante el evento.'}
          </span>
        </div>
      </div>

    </section>
  );
};
