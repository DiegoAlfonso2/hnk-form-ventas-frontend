import { useState, useEffect } from 'react';
import { useCart } from './hooks/useCart';
import { ContactForm } from './components/Step1Menu/ContactForm';
import { MenuList } from './components/Step1Menu/MenuList';
import { CartSummary } from './components/Step1Menu/CartSummary';
import { PaymentSection } from './components/Step2Pay/PaymentSection';
import { HnkLogo } from './components/ui/HnkLogo';

function App() {
  const {
    contact,
    setContact,
    quantities,
    updateQuantity,
    cartItems,
    subtotal,
    total,
    isFormValid,
    resetCart,
    loadOrderData
  } = useCart();

  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [isEditingExistingOrder, setIsEditingExistingOrder] = useState<boolean>(false);

  // Check for deep links (e.g. ?orderId=HNK-4819) on page mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlOrderId = params.get('orderId');
    
    if (urlOrderId) {
      // Set states for the retrieved order
      setOrderNumber(urlOrderId);
      setIsEditingExistingOrder(true);
      setStep(2); // Jump directly to Payment and upload proof step (Step 2)
      
      // Inject mock retrieved order data for prototyping
      loadOrderData(
        {
          name: 'Pedro Mármol',
          phone: '+54 9 11 9876 5432',
          email: 'pedro@marmol.com',
          deliveryTimeSlot: '14-15',
          notes: 'Retiro a las 14:30 hs. Por favor preparar caliente.'
        },
        {
          sorrentinos: 2,
          lasagna: 1
        }
      );
    }
  }, []);

  const handleCheckout = () => {
    if (!isFormValid) return;

    setIsLoading(true);

    // Simulate backend REST API call to submit/update order
    setTimeout(() => {
      // If we are editing, preserve orderNumber; otherwise generate a new one
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const finalOrderNumber = isEditingExistingOrder ? orderNumber : `HNK-${randomId}`;
      
      if (!isEditingExistingOrder) {
        setOrderNumber(finalOrderNumber);
      }
      
      setIsLoading(false);
      setStep(2);
      
      // Synchronize URL: add ?orderId=HNK-XXXX to address bar
      const newUrl = `${window.location.origin}${window.location.pathname}?orderId=${finalOrderNumber}`;
      window.history.pushState({ orderId: finalOrderNumber }, '', newUrl);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const handleBackToStep1 = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderCompleted = () => {
    resetCart();
    setStep(1);
    setOrderNumber('');
    setIsEditingExistingOrder(false);
    
    // Clear URL parameters
    window.history.pushState({}, '', window.location.pathname);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container animate-fade-in">
      {/* Brand Header */}
      <header style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '0.5rem', 
        marginBottom: '1.5rem',
        marginTop: '0.5rem'
      }}>
        <HnkLogo width={140} height={120} />
      </header>

      {/* School Festival Event Banner */}
      <div className="banner-escolar">
        <span>🌸</span>
        <span><strong>¡KARAOKE 2026!</strong> Preventa de Comida - Sábado 06 de Junio</span>
        <span>🎤</span>
      </div>

      {/* Steps Tracker Navigation */}
      <div className="steps-tracker">
        <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>
          <div className={`step-num ${step === 1 ? 'active' : 'completed'}`}>
            {step > 1 ? '✓' : '1'}
          </div>
          <span className="step-label">Pedido</span>
        </div>
        
        <div className={`step-line ${step > 1 ? 'active' : ''}`} />
        
        <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>
          <div className={`step-num ${step === 2 ? 'active' : ''}`}>
            2
          </div>
          <span className="step-label">Pago</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main style={{ minHeight: '60vh' }}>
        {isLoading ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '4rem 2rem',
            gap: '1.5rem'
          }} className="glass-panel animate-fade-in">
            <div className="spinner" />
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem', fontSize: '1.25rem', color: 'var(--hnk-blue)' }}>
                {isEditingExistingOrder ? 'Actualizando tu pedido en cocina...' : 'Enviando pedido a cocina...'}
              </h3>
              <p style={{ fontSize: '0.9rem' }}>Esto tomará solo un momento.</p>
            </div>
          </div>
        ) : step === 1 ? (
          /* Step 1: Menu selection and Contact details */
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr', 
            gap: '2rem' 
          }} className="step1-layout">
            
            {/* Grid Container for inputs and menu list */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="step1-main">
              
              {/* Edit Mode Alert Banner */}
              {isEditingExistingOrder && (
                <div style={{
                  background: 'var(--accent-yellow-light)',
                  border: '3px dashed var(--accent-yellow)',
                  borderRadius: '18px',
                  padding: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: 'var(--hnk-blue)',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  boxShadow: 'var(--card-shadow)'
                }} className="animate-fade-in">
                  <span style={{ fontSize: '1.5rem' }}>✏️</span>
                  <div>
                    <span style={{ display: 'block', fontSize: '1.05rem' }}>Editando Pedido #{orderNumber}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Los datos de contacto personales están bloqueados y no pueden ser modificados.</span>
                  </div>
                </div>
              )}

              {/* Contact Info Form */}
              <ContactForm 
                contact={contact} 
                onChange={setContact} 
                isReadOnlyContact={isEditingExistingOrder}
              />

              {/* Menu Portions Selector */}
              <MenuList 
                quantities={quantities} 
                onQuantityChange={updateQuantity} 
              />
            </div>

            {/* Cart Summary Panel */}
            <div className="step1-sidebar">
              <CartSummary
                cartItems={cartItems}
                subtotal={subtotal}
                total={total}
                isValid={isFormValid}
                onCheckout={handleCheckout}
                isEditing={isEditingExistingOrder}
              />
            </div>
          </div>
        ) : (
          /* Step 2: Order receipt, Bank details, upload transfer voucher */
          <PaymentSection
            orderNumber={orderNumber}
            contact={contact}
            cartItems={cartItems}
            total={total}
            onBack={handleBackToStep1}
            onOrderCompleted={handleOrderCompleted}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{ 
        marginTop: '4rem', 
        paddingTop: '1.5rem', 
        borderTop: '2px solid var(--hnk-blue-light)', 
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        fontWeight: 500
      }}>
        <p>&copy; {new Date().getFullYear()} HNK Rotisería Boutique. Todos los derechos reservados.</p>
        <p style={{ marginTop: '0.25rem', opacity: 0.7 }}>Desarrollado para el evento escolar Karaoke 2026.</p>
      </footer>

      {/* Injecting CSS specifically for the responsive Grid Layout of Step 1 */}
      <style>{`
        .step1-layout {
          grid-template-columns: 1fr;
        }
        @media (min-width: 1024px) {
          .step1-layout {
            grid-template-columns: 60% 40%;
            align-items: start;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
