const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/public';

export interface BackendEvent {
  id: string;
  name: string;
  description: string | null;
  date: number;
  schoolYear: number;
  status: 'active' | 'inactive' | 'completed';
}

export interface BackendMenuItem {
  id: string;
  eventId: string;
  name: string;
  description: string | null;
  price: number; // in cents
  stock: number | null;
  status: 'available' | 'inactive';
  displayOrder: number;
  image?: string | null;
}

export interface ClassSectionOption {
  id: string;
  description: string;
}

export interface OrderItemInput {
  menuItemId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  eventId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  classSection: string;
  items: OrderItemInput[];
  notes?: string;
}

export interface EditOrderPayload {
  items: OrderItemInput[];
  notes?: string;
}

export interface BackendOrder {
  id: string;
  eventId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  classSection: string;
  notes?: string | null;
  totalPrice: number; // in cents
  totalPaid: number; // in cents
  status: 'pending_payment' | 'paid' | 'delivered' | 'cancelled';
  items: {
    id: string;
    menuItemId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  proofs: {
    id: string;
    fileName: string;
    fileUrl: string;
    createdAt: number;
  }[];
}

export const api = {
  async getEvents(): Promise<BackendEvent[]> {
    const res = await fetch(`${API_BASE_URL}/events`);
    if (!res.ok) throw new Error('Error al obtener eventos');
    return res.json();
  },

  async getEventMenu(eventId: string): Promise<BackendMenuItem[]> {
    const res = await fetch(`${API_BASE_URL}/events/${eventId}/menu`);
    if (!res.ok) throw new Error('Error al obtener el menú');
    return res.json();
  },

  async getClassSections(schoolYear?: number): Promise<ClassSectionOption[]> {
    const url = new URL(`${API_BASE_URL}/class-sections`);
    if (schoolYear) {
      url.searchParams.append('schoolYear', schoolYear.toString());
    }
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Error al obtener grados/salas');
    return res.json();
  },

  async getOrder(orderId: string): Promise<BackendOrder> {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    if (!res.ok) throw new Error('Pedido no encontrado o error al recuperarlo');
    return res.json();
  },

  async createOrder(payload: CreateOrderPayload): Promise<{ order: BackendOrder }> {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Error al confirmar el pedido');
    }
    return res.json();
  },

  async editOrder(orderId: string, payload: EditOrderPayload): Promise<BackendOrder> {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Error al actualizar el pedido');
    }
    return res.json();
  },

  async uploadPaymentProof(
    orderId: string,
    file: File
  ): Promise<{ success: boolean; status: string; fileUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/payment`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Error al subir el comprobante');
    }
    return res.json();
  },
};
