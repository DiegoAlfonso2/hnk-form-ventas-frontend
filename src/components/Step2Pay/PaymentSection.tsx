import React, { useState, useRef } from 'react';
import type { ContactInfo, CartItem } from '../../hooks/useCart';
import { 
  CheckCircle, Copy, Check, UploadCloud, FileText, Image as ImageIcon, 
  Trash2, ArrowLeft, Building, AlertCircle, Clock 
} from 'lucide-react';

interface PaymentSectionProps {
  orderNumber: string;
  contact: ContactInfo;
  cartItems: CartItem[];
  total: number;
  onBack: () => void;
  onOrderCompleted: () => void;
  onUploadVoucher: (file: File) => Promise<any>;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  orderNumber,
  contact,
  cartItems,
  total,
  onBack,
  onOrderCompleted,
  onUploadVoucher
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [voucherFile, setVoucherFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bankDetails = {
    alias: 'okane.mp',
    cvu: '0000003100028351961072',
    banco: 'Mercado Libre SRL (MercadoPago)',
    titular: 'INSTITUTO NICHIA GAKUIN ASOCIACION CIVIL'
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const getFriendlyTimeSlot = (slot: string) => {
    const slotsMap: Record<string, string> = {
      '13-14': '13:00 a 14:00 hs',
      '14-15': '14:00 a 15:00 hs',
      '15-16': '15:00 a 16:00 hs',
      '16-17': '16:00 a 17:00 hs',
      '17-18': '17:00 a 18:00 hs',
      'evento-fin': 'Al finalizar el evento'
    };
    return slotsMap[slot] || slot;
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (validTypes.includes(file.type)) {
      setVoucherFile(file);
      setUploadStatus('idle');
      setUploadProgress(0);
    } else {
      setUploadStatus('error');
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadVoucher = async () => {
    if (!voucherFile) return;

    setUploadStatus('uploading');
    setUploadProgress(20);
    
    try {
      setUploadProgress(60);
      await onUploadVoucher(voucherFile);
      setUploadProgress(100);
      setUploadStatus('success');
      setTimeout(() => {
        onOrderCompleted();
      }, 800);
    } catch (err) {
      console.error(err);
      setUploadStatus('error');
    }
  };

  const removeFile = () => {
    setVoucherFile(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Title Header (Pedido Reservado) */}
      <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: 'var(--accent-yellow-light)', 
          color: 'var(--hnk-blue)', 
          borderRadius: '50%', 
          padding: '1.2rem', 
          marginBottom: '1rem', 
          border: '3px solid var(--hnk-blue)',
          boxShadow: '3px 3px 0px var(--hnk-blue)'
        }}>
          <Clock size={44} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--hnk-blue)', marginBottom: '0.5rem', fontSize: '2rem' }}>Pedido Reservado</h2>
        <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>
          Tu reserva <strong style={{ color: 'var(--accent-pink)', fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>#{orderNumber}</strong> ha sido registrada.
        </p>
        <div style={{ 
          background: 'var(--accent-pink-light)', 
          border: '2.5px solid var(--accent-pink)', 
          borderRadius: '16px', 
          padding: '1.25rem', 
          maxWidth: '650px', 
          margin: '1.25rem auto 0 auto',
          fontSize: '0.95rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          boxShadow: '3px 3px 0px var(--accent-pink)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-pink)', fontSize: '1.05rem', fontWeight: 800 }}>
            <AlertCircle size={20} />
            <span>Información Importante sobre tu Reserva</span>
          </div>
          <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-main)' }}>
            El pedido se confirmará una vez que se suba el comprobante de transferencia en el paso siguiente.
          </p>
          <p style={{ margin: 0, fontWeight: 700, color: 'var(--accent-pink)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>⚠️</span> Las reservas se cancelan automáticamente a las 24 horas si no se sube el comprobante de pago.
          </p>
        </div>
      </div>

      {/* STEP A: Order Summary Details (Placed ABOVE payment sections, spanning full width) */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '1.25rem', color: 'var(--hnk-blue)' }}>
          Detalle del Pedido Reservado
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="details-grid">
          {/* Customer & Pickup Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }} className="info-subgrid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Cliente</span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.05rem' }}>{contact.name}</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{contact.phone} | {contact.email}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Horario de Retiro</span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.05rem' }}>
                {getFriendlyTimeSlot(contact.deliveryTimeSlot)}
              </span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                Entrega en Comedor de Primaria
              </span>
            </div>
          </div>

          {/* Items & Total info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Platos Reservados
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {cartItems.map(item => (
                <div key={item.menuItem.id} style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500 }}>
                  <span>
                    <strong style={{ color: 'var(--accent-pink)' }}>{item.quantity}</strong>x {item.menuItem.name}
                  </span>
                  <span style={{ fontWeight: 700 }}>${(item.menuItem.price * item.quantity).toLocaleString('es-AR')}</span>
                </div>
              ))}
            </div>
            <hr style={{ border: 0, borderTop: '2px solid var(--hnk-blue-light)', margin: '0.5rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--hnk-blue)', fontSize: '1.25rem' }}>Total a Transferir</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-pink)' }}>
                ${total.toLocaleString('es-AR')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* STEP B: Payment & Upload operational cards (Side by side on desktop) */}
      <div className="payment-grid">
        
        {/* Card 1: Bank Transfer Instructions */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '1.25rem', 
            marginBottom: '1.25rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: 'var(--hnk-blue)' 
          }}>
            <Building size={20} style={{ color: 'var(--accent-pink)' }} />
            1. Realizar Transferencia
          </h3>
          
          <div style={{ 
            background: 'var(--accent-yellow-light)', 
            padding: '1.25rem', 
            borderRadius: '18px', 
            border: '2.5px solid var(--accent-yellow)', 
            marginBottom: '1.25rem' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 600 }}>Monto exacto:</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--hnk-blue)' }}>
                ${total.toLocaleString('es-AR')}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', fontSize: '0.95rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Titular</span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{bankDetails.titular}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', fontSize: '0.95rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Banco</span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{bankDetails.banco}</span>
            </div>

            <hr style={{ border: 0, borderTop: '2px solid var(--hnk-blue-light)' }} />

            {/* Alias Field */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>ALIAS</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.05rem', color: 'var(--hnk-blue)' }}>{bankDetails.alias}</span>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => copyToClipboard(bankDetails.alias, 'alias')}
                style={{ padding: '0.5rem', borderRadius: '10px', boxShadow: '2px 2px 0px var(--hnk-blue)' }}
                title="Copiar Alias"
              >
                {copiedField === 'alias' ? <Check size={16} style={{ color: 'var(--success)' }} /> : <Copy size={16} />}
              </button>
            </div>

            {/* CVU Field */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>CVU</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem', color: 'var(--hnk-blue)' }}>{bankDetails.cvu}</span>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => copyToClipboard(bankDetails.cvu, 'cvu')}
                style={{ padding: '0.5rem', borderRadius: '10px', boxShadow: '2px 2px 0px var(--hnk-blue)' }}
                title="Copiar CVU"
              >
                {copiedField === 'cvu' ? <Check size={16} style={{ color: 'var(--success)' }} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Upload payment proof */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '1.25rem', 
            marginBottom: '1.25rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: 'var(--hnk-blue)' 
          }}>
            <UploadCloud size={20} style={{ color: 'var(--accent-pink)' }} />
            2. Subir Comprobante de Pago
          </h3>

          {/* Drag & Drop Zone */}
          {uploadStatus !== 'success' && (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              style={{
                border: `3px dashed ${dragActive ? 'var(--accent-pink)' : 'var(--text-muted)'}`,
                borderRadius: '20px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragActive ? 'var(--accent-blue-light)' : 'var(--bg-secondary)',
                transition: 'all var(--transition-normal)',
                marginBottom: '1rem'
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="visually-hidden"
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg, application/pdf"
              />
              <UploadCloud size={48} style={{ color: dragActive ? 'var(--accent-pink)' : 'var(--hnk-blue)', marginBottom: '0.75rem', opacity: 0.8 }} />
              <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem', fontFamily: 'var(--font-display)' }}>
                {dragActive ? '¡Suéltalo aquí!' : 'Arrastra aquí tu comprobante'}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                O haz clic para buscar en tu dispositivo
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem', opacity: 0.8, fontWeight: 500 }}>
                Formatos soportados: PNG, JPG, PDF (Máx 5MB)
              </p>
            </div>
          )}

          {/* Error state */}
          {uploadStatus === 'error' && (
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              background: 'var(--error-light)', 
              border: '2px solid var(--error)', 
              borderRadius: '16px', 
              padding: '0.85rem', 
              fontSize: '0.85rem', 
              color: 'var(--text-main)', 
              marginBottom: '1rem',
              fontWeight: 600
            }}>
              <AlertCircle size={18} style={{ color: 'var(--error)', flexShrink: 0 }} />
              <span>Formato de archivo no válido. Solo se admiten imágenes (PNG, JPG) o archivos PDF.</span>
            </div>
          )}

          {/* Selected File Details */}
          {voucherFile && (
            <div className="glass-panel" style={{ padding: '1rem', background: 'var(--accent-blue-light)', marginBottom: '1.25rem', borderColor: 'var(--accent-blue)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                  {voucherFile.type === 'application/pdf' ? (
                    <div style={{ padding: '0.5rem', background: 'var(--error-light)', color: 'var(--error)', borderRadius: '10px', border: '1.5px solid var(--error)' }}>
                      <FileText size={24} />
                    </div>
                  ) : (
                    <div style={{ padding: '0.5rem', background: 'var(--hnk-blue-light)', color: 'var(--hnk-blue)', borderRadius: '10px', border: '1.5px solid var(--hnk-blue)' }}>
                      <ImageIcon size={24} />
                    </div>
                  )}
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: 'var(--text-main)' }}>
                      {voucherFile.name}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {formatFileSize(voucherFile.size)}
                    </p>
                  </div>
                </div>

                {uploadStatus !== 'uploading' && uploadStatus !== 'success' && (
                  <button
                    type="button"
                    className="btn"
                    onClick={removeFile}
                    style={{ padding: '0.5rem', background: 'var(--error-light)', color: 'var(--error)', border: '2px solid var(--error)', boxShadow: 'none' }}
                    title="Eliminar archivo"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Upload Action Button */}
              {uploadStatus === 'idle' && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUploadVoucher}
                  style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
                >
                  Enviar Comprobante
                </button>
              )}

              {/* Uploading progress bar state */}
              {uploadStatus === 'uploading' && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600 }}>
                    <span>Subiendo comprobante...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden', border: '1.5px solid var(--hnk-blue)' }}>
                    <div style={{ height: '100%', width: `${uploadProgress}%`, background: 'var(--accent-pink)', transition: 'width 0.2s ease' }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Success uploaded state */}
          {uploadStatus === 'success' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ 
                display: 'flex', 
                gap: '0.75rem', 
                background: 'var(--success-light)', 
                border: '2px solid var(--success)', 
                borderRadius: '16px', 
                padding: '1.25rem', 
                fontSize: '0.95rem', 
                color: 'var(--text-main)', 
                alignItems: 'center' 
              }}>
                <CheckCircle size={24} style={{ color: 'var(--success)', flexShrink: 0 }} />
                <div style={{ textAlign: 'left' }}>
                  <strong style={{ display: 'block', color: 'var(--success)', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>¡Comprobante Enviado!</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>El equipo de Haha No Kai validará tu pago. Recibirás tu confirmación pronto.</span>
                </div>
              </div>
              
              <button
                type="button"
                className="btn btn-primary"
                onClick={onOrderCompleted}
                style={{ width: '100%', padding: '1rem' }}
              >
                Volver al Inicio
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Back button link - always available to allow editing confirmed/paid orders */}
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onBack}
        style={{ width: 'fit-content', margin: '1rem auto 0 auto', padding: '0.75rem 1.25rem' }}
      >
        <ArrowLeft size={16} />
        Volver a editar pedido
      </button>

      <style>{`
        .payment-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        .details-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .payment-grid {
            grid-template-columns: 1fr;
          }
          .details-grid {
            grid-template-columns: 1fr 1.2fr;
          }
        }
      `}</style>
    </div>
  );
};
export default PaymentSection;
