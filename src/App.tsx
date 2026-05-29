import { useState, useEffect } from 'react';
import { useCart } from './hooks/useCart';
import type { MenuItem } from './hooks/useCart';
import { ContactForm } from './components/Step1Menu/ContactForm';
import { MenuList } from './components/Step1Menu/MenuList';
import { CartSummary } from './components/Step1Menu/CartSummary';
import { PaymentSection } from './components/Step2Pay/PaymentSection';
import { OrderConfirmed } from './components/Step3Confirm/OrderConfirmed';
import { HnkLogo } from './components/ui/HnkLogo';
import { api } from './utils/api';
import type { BackendEvent, ClassSectionOption } from './utils/api';

function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [classSections, setClassSections] = useState<ClassSectionOption[]>([]);
  const [currentEvent, setCurrentEvent] = useState<BackendEvent | null>(null);
  const [orderId, setOrderId] = useState<string>(''); // UUID of the order
  const [orderNumber, setOrderNumber] = useState<string>(''); // Readable PED-XXXXXX
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditingExistingOrder, setIsEditingExistingOrder] = useState<boolean>(false);

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
  } = useCart(menuItems);

  // Fetch initial app data (Events, Menu Items, Class Sections) and handle deep linking on mount
  useEffect(() => {
    const loadAppData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch active events
        const eventsList = await api.getEvents();
        const activeEvent = eventsList[0];
        if (!activeEvent) {
          console.error("No active events found");
          setIsLoading(false);
          return;
        }
        setCurrentEvent(activeEvent);

        // 2. Fetch menu items for this event (and convert prices from cents to pesos)
        const backendMenu = await api.getEventMenu(activeEvent.id);
        const mappedMenu: MenuItem[] = backendMenu.map((item, idx) => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          price: item.price / 100,
          imageColor: idx % 4 === 0 
            ? 'linear-gradient(135deg, #ff7b00, #ffae00)' 
            : idx % 4 === 1 
              ? 'linear-gradient(135deg, #e63946, #f77f00)' 
              : idx % 4 === 2 
                ? 'linear-gradient(135deg, #2a9d8f, #e9c46a)' 
                : 'linear-gradient(135deg, #6d597a, #b56576)'
        }));
        setMenuItems(mappedMenu);

        // 3. Fetch class sections for this event's school year
        const sectionsList = await api.getClassSections(activeEvent.schoolYear);
        setClassSections(sectionsList);

        // 4. Check for deep linking (?orderId={UUID})
        const params = new URLSearchParams(window.location.search);
        const urlOrderId = params.get('orderId');
        
        if (urlOrderId) {
          setOrderId(urlOrderId);
          setIsEditingExistingOrder(true);
          setStep(2);

          try {
            const order = await api.getOrder(urlOrderId);
            setOrderNumber(order.orderNumber);
            
            // Map order items to quantities state
            const quantitiesMap: Record<string, number> = {};
            order.items.forEach(it => {
              quantitiesMap[it.menuItemId] = it.quantity;
            });

            loadOrderData(
              {
                name: order.customerName,
                phone: order.customerPhone,
                email: order.customerEmail,
                classSection: order.classSection,
                deliveryTimeSlot: '13-14', // Default placeholder Horario
                notes: ''
              },
              quantitiesMap
            );
          } catch (orderErr) {
            console.error("Error retrieving order details via UUID link", orderErr);
            // Clear invalid URL parameter and reset step
            window.history.pushState({}, '', window.location.pathname);
            setIsEditingExistingOrder(false);
            setStep(1);
          }
        }
      } catch (err) {
        console.error("Initialization error", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppData();
  }, []);

  const handleCheckout = async () => {
    if (!isFormValid || !currentEvent) return;

    setIsLoading(true);

    try {
      const itemsPayload = cartItems.map(item => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity
      }));

      if (isEditingExistingOrder) {
        // Edit flow
        const updatedOrder = await api.editOrder(orderId, {
          items: itemsPayload
        });
        setOrderNumber(updatedOrder.orderNumber);
      } else {
        // Create flow
        const createRes = await api.createOrder({
          eventId: currentEvent.id,
          customerName: contact.name,
          customerEmail: contact.email,
          customerPhone: contact.phone,
          classSection: contact.classSection,
          items: itemsPayload
        });
        
        setOrderId(createRes.order.id);
        setOrderNumber(createRes.order.orderNumber);
        
        // Update URL to use UUID (order.id)
        const newUrl = `${window.location.origin}${window.location.pathname}?orderId=${createRes.order.id}`;
        window.history.pushState({ orderId: createRes.order.id }, '', newUrl);
      }
      
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      alert(err.message || 'Ocurrió un error al procesar el pedido. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToStep3 = () => {
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderCompleted = () => {
    resetCart();
    setStep(1);
    setOrderId('');
    setOrderNumber('');
    setIsEditingExistingOrder(false);
    
    // Clear URL parameters
    window.history.pushState({}, '', window.location.pathname);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUploadVoucher = async (file: File) => {
    return api.uploadPaymentProof(orderId, file);
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
          <div className={`step-num ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
            {step > 2 ? '✓' : '2'}
          </div>
          <span className="step-label">Pago</span>
        </div>

        <div className={`step-line ${step > 2 ? 'active' : ''}`} />
        
        <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>
          <div className={`step-num ${step === 3 ? 'active' : ''}`}>
            3
          </div>
          <span className="step-label">Confirmación</span>
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
                classSections={classSections}
              />

              {/* Menu Portions Selector */}
              <MenuList 
                menuItems={menuItems}
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
        ) : step === 2 ? (
          /* Step 2: Order receipt, Bank details, upload transfer voucher */
          <PaymentSection
            orderNumber={orderNumber}
            contact={contact}
            cartItems={cartItems}
            total={total}
            onBack={handleBackToStep1}
            onOrderCompleted={handleGoToStep3}
            onUploadVoucher={handleUploadVoucher}
          />
        ) : (
          /* Step 3: Confirmation and withdrawal details */
          <OrderConfirmed
            orderNumber={orderNumber}
            contact={contact}
            cartItems={cartItems}
            total={total}
            onCompleted={handleOrderCompleted}
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
