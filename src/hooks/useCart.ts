import { useState, useMemo } from 'react';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageColor: string; // Gradient color for beautiful cards
  image?: string | null; // Optional image filename
  status: 'available' | 'inactive';
  stock: number | null;
  displayOrder: number;
}

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  classSection: string;
  deliveryTimeSlot: string;
  notes: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'sorrentinos',
    name: 'Sorrentinos de Calabaza y Cabra',
    description: 'Pasta artesanal rellena de calabaza asada y queso de cabra cremoso con tomillo.',
    price: 8500,
    imageColor: 'linear-gradient(135deg, #ff7b00, #ffae00)',
    status: 'available',
    stock: 10,
    displayOrder: 1
  },
  {
    id: 'lasagna',
    name: 'Lasagna Bolognese al Horno',
    description: 'Capas de pasta fresca, ragú de ternera estofado lentamente y salsa bechamel gratinada.',
    price: 9200,
    imageColor: 'linear-gradient(135deg, #e63946, #f77f00)',
    status: 'available',
    stock: 10,
    displayOrder: 2
  },
  {
    id: 'canelones',
    name: 'Canelones de Espinaca y Ricota',
    description: 'Canelones rellenos de espinaca orgánica y ricota suave, bañados en salsa pomodoro y queso parmesano.',
    price: 7800,
    imageColor: 'linear-gradient(135deg, #2a9d8f, #e9c46a)',
    status: 'available',
    stock: 10,
    displayOrder: 3
  },
  {
    id: 'risotto',
    name: 'Risotto de Hongos y Trufa',
    description: 'Arroz arborio cremoso con mix de champiñones, portobellos, gírgolas y un toque de aceite de trufa negra.',
    price: 10500,
    imageColor: 'linear-gradient(135deg, #6d597a, #b56576)',
    status: 'available',
    stock: 10,
    displayOrder: 4
  }
];

export const useCart = (fetchedMenuItems: MenuItem[] = []) => {
  const [contact, setContact] = useState<ContactInfo>({
    name: '',
    phone: '',
    email: '',
    classSection: '',
    deliveryTimeSlot: '',
    notes: ''
  });

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const activeMenuItems = fetchedMenuItems.length > 0 ? fetchedMenuItems : MENU_ITEMS;

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      let next = Math.max(0, current + delta);
      if (delta > 0) {
        const item = activeMenuItems.find(i => i.id === id);
        if (item && item.stock !== null && next > item.stock) {
          next = item.stock;
        }
      }
      return { ...prev, [id]: next };
    });
  };

  const cartItems = useMemo<CartItem[]>(() => {
    return activeMenuItems.map(menuItem => ({
      menuItem,
      quantity: quantities[menuItem.id] || 0
    })).filter(item => item.quantity > 0);
  }, [quantities, activeMenuItems]);

  const itemsCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.menuItem.price * item.quantity), 0);
  }, [cartItems]);

  const deliveryFee = 0; // All pickups at school, no delivery fee

  const total = subtotal;

  const isFormValid = useMemo(() => {
    const hasItems = itemsCount > 0;
    const hasName = contact.name.trim().length > 0;
    const hasPhone = contact.phone.trim().length > 0;
    const hasEmail = contact.email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email);
    const hasClassSection = contact.classSection.trim().length > 0;
    const hasTimeSlot = contact.deliveryTimeSlot.trim().length > 0;

    return hasItems && hasName && hasPhone && hasEmail && hasClassSection && hasTimeSlot;
  }, [contact, itemsCount]);

  const resetCart = () => {
    setContact({
      name: '',
      phone: '',
      email: '',
      classSection: '',
      deliveryTimeSlot: '',
      notes: ''
    });
    setQuantities({});
  };

  const loadOrderData = (loadedContact: ContactInfo, loadedQuantities: Record<string, number>) => {
    setContact(loadedContact);
    setQuantities(loadedQuantities);
  };

  return {
    contact,
    setContact,
    quantities,
    updateQuantity,
    cartItems,
    itemsCount,
    subtotal,
    deliveryFee,
    total,
    isFormValid,
    resetCart,
    loadOrderData
  };
};
