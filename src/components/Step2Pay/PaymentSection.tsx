import React, { useState, useRef } from 'react';
import type { ContactInfo, CartItem } from '../../hooks/useCart';
import { 
  CheckCircle, Copy, Check, UploadCloud, FileText, Image as ImageIcon, 
  Trash2, ArrowLeft, Building, AlertCircle 
} from 'lucide-react';

interface PaymentSectionProps {
  orderNumber: string;
  contact: ContactInfo;
  cartItems: CartItem[];
  total: number;
  onBack: () => void;
  onOrderCompleted: () => void;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  orderNumber,
  contact,
  cartItems,
  total,
  onBack,
  onOrderCompleted
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [voucherFile, setVoucherFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bankDetails = {
    alias: 'hnk.comidas.mp',
    cbu: '0000003100098765432109',
    banco: 'Mercado Pago',
    titular: 'HNK Rotisería S.H.'
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
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

  const handleUploadVoucher = () => {
    if (!voucherFile) return;

    setUploadStatus('uploading');
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploadStatus('success');
      }
    }, 200);
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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="animate-fade-in">
      {/* Success Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(22, 163, 74, 0.1)', color: 'var(--success)', borderRadius: '50%', padding: '1rem', marginBottom: '1rem', border: '1px solid rgba(22, 163, 74, 0.2)' }}>
          <CheckCircle size={40} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Pedido Confirmado</h2>
        <p style={{ fontSize: '1rem' }}>
          Reserva <strong style={{ color: 'var(--color-primary)' }}>#{orderNumber}</strong> creada exitosamente.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {/* Left Side: Bank Details and File Upload */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Bank details instruction card */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
              <Building size={18} style={{ color: 'var(--color-primary)' }} />
              1. Transferir el Total
            </h3>
            
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--card-border)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Monto exacto a transferir:</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  ${total.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Titular</span>
                  <span style={{ fontWeight: 600 }}>{bankDetails.titular}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Banco</span>
                  <span style={{ fontWeight: 600 }}>{bankDetails.banco}</span>
                </div>
              </div>

              <hr style={{ border: 0, borderTop: '1px solid var(--card-border)' }} />

              {/* Alias Field */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ALIAS</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-primary)' }}>{bankDetails.alias}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => copyToClipboard(bankDetails.alias, 'alias')}
                  style={{ padding: '0.5rem', borderRadius: '8px' }}
                  title="Copiar Alias"
                >
                  {copiedField === 'alias' ? <Check size={16} style={{ color: 'var(--success)' }} /> : <Copy size={16} />}
                </button>
              </div>

              {/* CBU Field */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CBU</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-primary)' }}>{bankDetails.cbu}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => copyToClipboard(bankDetails.cbu, 'cbu')}
                  style={{ padding: '0.5rem', borderRadius: '8px' }}
                  title="Copiar CBU"
                >
                  {copiedField === 'cbu' ? <Check size={16} style={{ color: 'var(--success)' }} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Upload card */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
              <UploadCloud size={18} style={{ color: 'var(--color-primary)' }} />
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
                  border: `2px dashed ${dragActive ? 'var(--color-primary)' : 'var(--card-border)'}`,
                  borderRadius: '16px',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: dragActive ? 'rgba(0, 229, 255, 0.05)' : 'rgba(0,0,0,0.1)',
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
                <UploadCloud size={42} style={{ color: dragActive ? 'var(--color-primary)' : 'var(--text-muted)', marginBottom: '0.75rem', opacity: 0.8 }} />
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  {dragActive ? 'Suelte el archivo aquí' : 'Arrastre aquí su comprobante'}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  O haga click para buscar en su dispositivo
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem', opacity: 0.7 }}>
                  Formatos soportados: PNG, JPG, PDF (Máx 5MB)
                </p>
              </div>
            )}

            {/* Error state */}
            {uploadStatus === 'error' && (
              <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--error-bg)', border: '1px solid var(--error)', borderRadius: '12px', padding: '0.75rem', fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
                <AlertCircle size={18} style={{ color: 'var(--error)', flexShrink: 0 }} />
                <span>Formato de archivo no válido. Solo se admiten imágenes (PNG, JPG) o archivos PDF.</span>
              </div>
            )}

            {/* Selected File Details */}
            {voucherFile && (
              <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                    {voucherFile.type === 'application/pdf' ? (
                      <div style={{ padding: '0.5rem', background: 'rgba(220, 38, 38, 0.1)', color: 'var(--error)', borderRadius: '8px' }}>
                        <FileText size={24} />
                      </div>
                    ) : (
                      <div style={{ padding: '0.5rem', background: 'rgba(0, 229, 255, 0.1)', color: 'var(--color-primary)', borderRadius: '8px' }}>
                        <ImageIcon size={24} />
                      </div>
                    )}
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: 'var(--text-main)' }}>
                        {voucherFile.name}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {formatFileSize(voucherFile.size)}
                      </p>
                    </div>
                  </div>

                  {uploadStatus !== 'uploading' && uploadStatus !== 'success' && (
                    <button
                      type="button"
                      className="btn"
                      onClick={removeFile}
                      style={{ padding: '0.5rem', background: 'rgba(220, 38, 38, 0.1)', color: 'var(--error)', border: 0 }}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      <span>Subiendo comprobante...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${uploadProgress}%`, background: 'var(--color-primary)', transition: 'width 0.2s ease' }} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Success uploaded state */}
            {uploadStatus === 'success' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ display: 'flex', gap: '0.75rem', background: 'var(--success-bg)', border: '1px solid var(--success)', borderRadius: '12px', padding: '1rem', fontSize: '0.9rem', color: 'var(--text-main)', alignItems: 'center' }}>
                  <CheckCircle size={20} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  <div style={{ textAlign: 'left' }}>
                    <strong style={{ display: 'block', color: 'var(--success)' }}>Comprobante Enviado</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nuestro equipo validará tu pago a la brevedad. Recibirás confirmación por email/WhatsApp.</span>
                  </div>
                </div>
                
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onOrderCompleted}
                  style={{ width: '100%', padding: '1rem' }}
                >
                  Entendido / Volver al Inicio
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Order Summary Details */}
        <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>
            Detalle del Pedido
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
            
            {/* Customer Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cliente</span>
              <span style={{ fontWeight: 600 }}>{contact.name}</span>
              <span style={{ color: 'var(--text-muted)' }}>{contact.phone}</span>
              <span style={{ color: 'var(--text-muted)' }}>{contact.email}</span>
            </div>

            {/* Delivery/Pickup Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Método de Entrega</span>
              <span style={{ fontWeight: 600 }}>
                {contact.deliveryType === 'delivery' ? 'Envío a Domicilio' : 'Retiro en Local'}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>
                {contact.deliveryType === 'delivery' ? contact.address : 'Calle Ficticia 456, CABA'}
              </span>
            </div>

            <hr style={{ border: 0, borderTop: '1px solid var(--card-border)' }} />

            {/* Selected Items */}
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Platos
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {cartItems.map(item => (
                  <div key={item.menuItem.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                      <strong style={{ color: 'var(--color-primary)' }}>{item.quantity}</strong>x {item.menuItem.name}
                    </span>
                    <span>${(item.menuItem.price * item.quantity).toLocaleString('es-AR')}</span>
                  </div>
                ))}
              </div>
            </div>

            <hr style={{ border: 0, borderTop: '1px solid var(--card-border)' }} />

            {/* Total Paid */}
            <div style={{ display: 'flex', justifySelf: 'flex-end', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                ${total.toLocaleString('es-AR')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Back button link if not completed */}
      {uploadStatus !== 'success' && (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBack}
          style={{ width: 'fit-content', margin: '1rem auto 0 auto' }}
        >
          <ArrowLeft size={16} />
          Volver a editar pedido
        </button>
      )}
    </div>
  );
};
