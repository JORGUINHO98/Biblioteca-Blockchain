# 📚 Mini Biblioteca Blockchain

Una aplicación descentralizada de gestión de biblioteca construida con React, Vite y Solidity que permite registrar libros y gestionar su estado de préstamo utilizando la blockchain.

## 🎯 Descripción

**Mini Biblioteca Blockchain** es una DApp (Aplicación Descentralizada) que permite:

- ✅ Registrar libros con información detallada (título, autor, editorial, año)
- ✅ Consultar el catálogo completo de libros
- ✅ Cambiar el estado de préstamo de cada libro (disponible/prestado)
- ✅ Interactuar con un contrato inteligente desplegado en Sepolia Testnet
- ✅ Conexión segura mediante MetaMask

## 🏗️ Tecnologías Utilizadas

### Frontend
- **React 19** - Biblioteca para construir interfaces de usuario
- **Vite** - Herramienta de construcción rápida
- **Ethers.js v6** - Biblioteca para interactuar con la blockchain
- **CSS3** - Estilos modernos con gradientes y animaciones

### Blockchain
- **Solidity** - Lenguaje de programación para smart contracts
- **Sepolia Testnet** - Red de pruebas de Ethereum
- **MetaMask** - Wallet para interactuar con la blockchain

## 📋 Contrato Inteligente

### Funciones Principales

```solidity
- addBook(title, author, publisher, year) // Agregar nuevo libro
- getAllBooks() // Obtener todos los libros
- toggleLoan(bookId) // Cambiar estado de préstamo
- getBook(bookId) // Obtener información de un libro específico
```

### Estructura de Datos

Cada libro contiene:
- `id` - Identificador único
- `title` - Título del libro
- `author` - Autor
- `publisher` - Editorial
- `year` - Año de publicación
- `onLoan` - Estado de préstamo (true/false)
- `addedAt` - Timestamp de cuando fue agregado

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- MetaMask instalado en tu navegador
- Cuenta en Sepolia Testnet con ETH para gas

### Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd Mini-Biblioteca/frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura la dirección del contrato:
   - Abre `src/config.js`
   - Reemplaza `YOUR_CONTRACT_ADDRESS_HERE` con la dirección de tu contrato desplegado

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Abre tu navegador en `http://localhost:5173`

### Construir para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## 🌐 Despliegue en Vercel
https://biblioteca-blockchain.vercel.app/ 

## 📝 Uso de la Aplicación

1. **Conecta tu Wallet:**
   - Asegúrate de estar en la red Sepolia en MetaMask
   - Haz clic en "Conectar MetaMask"
   - Acepta la conexión

2. **Agregar un Libro:**
   - Completa el formulario con los datos del libro
   - Haz clic en "Agregar Libro"
   - Confirma la transacción en MetaMask
   - Espera la confirmación de la blockchain

3. **Ver Libros:**
   - Los libros se muestran automáticamente en el catálogo
   - Cada tarjeta muestra toda la información del libro
   - El estado de préstamo se indica con colores

4. **Cambiar Estado de Préstamo:**
   - Haz clic en el botón correspondiente
   - Confirma la transacción
   - El estado se actualiza en la blockchain

## 🔗 Dirección del Contrato

**Sepolia Testnet:**
```
Dirección del contrato: 0xe06C4263631d2CaD55D45Cb66Caa6c06821E43CA
```

Ver en SepoliaScan: [https://sepolia.etherscan.io/address/0xe06C4263631d2CaD55D45Cb66Caa6c06821E43CA](https://sepolia.etherscan.io/address/0xe06C4263631d2CaD55D45Cb66Caa6c06821E43CA)

## 🎨 Características de la UI

- ✨ Diseño moderno con gradientes y animaciones
- 📱 Totalmente responsive (móvil, tablet, desktop)
- 🎯 Interfaz intuitiva y fácil de usar
- ⚡ Feedback visual en tiempo real
- 🔐 Conexión segura con MetaMask
- 💫 Transiciones suaves y efectos hover

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado con ❤️ para demostrar las capacidades de Web3 y DApps.

## 🆘 Soporte

Si tienes problemas o preguntas:
- Abre un issue en el repositorio
- Verifica que estés en la red Sepolia
- Asegúrate de tener ETH para gas en tu wallet

---

**Nota:** Esta es una aplicación de demostración para fines educativos. Usa Sepolia Testnet para todas las transacciones.
