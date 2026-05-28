# HNK - Formulario de Ventas Frontend

Este es el frontend del sistema de pedidos de **HNK Rotisería Boutique**, desarrollado en **React, TypeScript y Vite**. Es una Single Page Application (SPA) responsiva y orientada a dispositivos móviles (Mobile-First) que consta de un flujo de dos pasos: armado de pedido/contacto y carga de comprobante de pago.

---

## 🚀 Decisiones de Diseño y Arquitectura

### 1. Stack Tecnológico
* **Vite + React + TypeScript**: Permite un entorno de desarrollo ultra veloz, bundling optimizado para producción y tipado estático que previene errores comunes de formulario.
* **Vanilla CSS (Mobile-First)**: En lugar de utilizar frameworks monolíticos de CSS, se implementó un sistema de diseño propio y a medida con variables HSL, gradientes fluidos, efectos de desenfoque de fondo (*glassmorphism*) y micro-animaciones en los botones y campos de entrada.
* **Navegación basada en Estados (Wizard)**: Dado que el flujo es lineal y corto (Paso 1 -> Paso 2), se optó por un gestor de estados simple en React en lugar de instalar librerías pesadas como `react-router-dom`, manteniendo el tamaño del bundle al mínimo.
* **Lucide React**: Biblioteca de iconos consistentes y estilizados para mejorar la estética visual.
* **Accesibilidad e Inputs Nativos**: Se utilizó la propiedad CSS `accent-color` para teñir los controles nativos (como checkbox y radio buttons) con la paleta de la marca, asegurando una interacción accesible y adaptada al sistema operativo, con estrategias fallback para navegadores antiguos que no la soportan.

### 2. Flujo de Usuario (Wizard)
* **Paso 1: Armado de Pedido e Información de Contacto**
  * El usuario carga su nombre, teléfono y dirección de correo.
  * Elige la modalidad de entrega: **Envío a Domicilio** (solicita dirección) o **Retiro en Local** (muestra horarios e indicaciones de retiro).
  * Selecciona la cantidad de porciones por plato desde una lista dinámica.
  * Un panel de resumen muestra el subtotal, costo de envío si aplica, y el botón para proceder a pagar (solo se habilita si todos los campos requeridos y de formato son válidos).
* **Paso 2: Confirmación y Carga de Comprobante**
  * Al confirmar, se simula la llamada al backend REST API y se genera un número de reserva único (ej: `#HNK-1234`).
  * Se muestran los datos del pedido y las instrucciones para realizar la transferencia bancaria (incluye alias y CBU del local con botones interactivos de copiado rápido al portapapeles).
  * El usuario dispone de una zona interactiva para subir su comprobante (arrastrar y soltar o examinar archivos). Soporta formato imagen (PNG/JPG) con previsualización o archivos PDF.
  * Al enviar el comprobante, se simula el proceso de subida y se muestra el estado de éxito definitivo.

---

## 📂 Estructura del Proyecto

El código está organizado de manera limpia y modular en el directorio `src`:

```
hnk-form-ventas-frontend/
├── public/                 # Recursos públicos estáticos
├── src/
│   ├── assets/             # Logos e imágenes del proyecto
│   ├── components/         # Componentes de la interfaz
│   │   ├── Step1Menu/      # Componentes del Paso 1 (Formulario de contacto y menú de platos)
│   │   │   ├── ContactForm.tsx
│   │   │   ├── MenuList.tsx
│   │   │   └── CartSummary.tsx
│   │   └── Step2Pay/       # Componentes del Paso 2 (Detalles de pago y upload de comprobante)
│   │       └── PaymentSection.tsx
│   ├── hooks/              # Hooks personalizados
│   │   └── useCart.ts      # Lógica de carrito, cálculo de totales y validación del formulario
│   ├── styles/             # Hojas de estilo y tokens de diseño
│   │   └── main.css        # Sistema de diseño, variables HSL y layouts responsivos
│   ├── App.tsx             # Orquestador del flujo y simulación de API
│   ├── index.css           # Punto de entrada de estilos globales
│   └── main.tsx            # Inicialización de la aplicación React
├── package.json            # Dependencias y scripts de npm
└── tsconfig.json           # Configuración de TypeScript
```

---

## 💻 Desarrollo Local

Para ejecutar la aplicación localmente, sigue estos pasos:

### 1. Clonar e Instalar Dependencias
Asegúrate de estar en el directorio de la aplicación frontend:
```bash
cd hnk-form-ventas-frontend
npm install
```

### 2. Ejecutar Servidor de Desarrollo
Inicia el servidor local de Vite:
```bash
npm run dev
```
La terminal indicará la URL local (normalmente `http://localhost:5173`). Abre ese enlace en tu navegador.

### 3. Compilar para Producción
Para verificar que el build compila correctamente y no tiene errores de TypeScript:
```bash
npm run build
```
Los archivos de distribución optimizados se generarán en la carpeta `dist/`.

---

## ☁️ Despliegue en Vercel

Este proyecto está preparado para desplegarse de manera independiente y en un repositorio Git propio en **Vercel**:

### Opción A: Despliegue automático con Git (Recomendado)
1. Crea un nuevo repositorio Git para este frontend (separado del backend).
2. Empuja el código de `hnk-form-ventas-frontend` a ese repositorio.
3. Entra a tu dashboard de [Vercel](https://vercel.com).
4. Haz clic en **Add New...** -> **Project**.
5. Importa el repositorio Git recién creado.
6. En la configuración del proyecto (Vercel detectará automáticamente que es un proyecto Vite):
   * **Framework Preset**: Vite
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
7. Haz clic en **Deploy**. Cada cambio que empujes a la rama principal se desplegará automáticamente.

### Opción B: Despliegue mediante Vercel CLI
Si prefieres desplegar directamente desde la terminal de forma manual:
1. Instala el CLI de Vercel globalmente (si no lo tienes):
   ```bash
   npm install -g vercel
   ```
2. Ejecuta el comando en la raíz del folder frontend:
   ```bash
   vercel
   ```
3. Sigue las instrucciones interactivas en pantalla para loguearte y asociar el proyecto.
4. Para desplegar a producción final:
   ```bash
   vercel --prod
   ```
