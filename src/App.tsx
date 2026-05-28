import { useState } from 'react';
import { useCart } from './hooks/useCart';
import { ContactForm } from './components/Step1Menu/ContactForm';
import { MenuList } from './components/Step1Menu/MenuList';
import { CartSummary } from './components/Step1Menu/CartSummary';
import { PaymentSection } from './components/Step2Pay/PaymentSection';
import { ChefHat } from 'lucide-react';

function App() {
  const {
    contact,
    setContact,
    quantities,
    updateQuantity,
    cartItems,
    subtotal,
    deliveryFee,
    total,
    isFormValid,
    resetCart
  } = useCart();

  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>('');

  const handleCheckout = () => {
    if (!isFormValid) return;

    setIsLoading(true);

    // Simulate backend REST API call to submit order
    setTimeout(() => {
      const randomId = Math.floor(1000 + Math.random() * 9000);
      setOrderNumber(`HNK-${randomId}`);
      setIsLoading(false);
      setStep(2);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container animate-fade-in">
      {/* Brand Header */}
      <header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '0.75rem', 
        marginBottom: '2rem',
        marginTop: '0.5rem'
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
          padding: '0.6rem',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-inverse)',
          boxShadow: '0 4px 16px rgba(0, 229, 255, 0.2)'
        }}>
          <ChefHat size={28} />
        </div>
        <h1 style={{ 
          fontSize: '1.75rem', 
          background: 'linear-gradient(to right, var(--text-main), var(--text-muted))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'var(--font-display)',
          fontWeight: 800
        }}>
          HNK Rotisería
        </h1>
      </header>

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
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem', fontSize: '1.25rem' }}>
                Enviando pedido a cocina...
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
              {/* Contact Info Form */}
              <ContactForm 
                contact={contact} 
                onChange={setContact} 
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
                deliveryFee={deliveryFee}
                total={total}
                isDelivery={contact.deliveryType === 'delivery'}
                isValid={isFormValid}
                onCheckout={handleCheckout}
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
        borderTop: '1px solid var(--card-border)', 
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <p>&copy; {new Date().getFullYear()} HNK Rotisería Boutique. Todos los derechos reservados.</p>
        <p style={{ marginTop: '0.25rem', opacity: 0.7 }}>Desarrollado de forma segura.</p>
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
