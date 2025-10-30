# 📚 Mini Biblioteca Blockchain

## 📖 Descripción

**Mini Biblioteca Blockchain** es una aplicación descentralizada (DApp) desarrollada con React, Vite y Solidity que permite gestionar una biblioteca de manera descentralizada en la blockchain de Ethereum.

### Características Principales

- ✅ Registro de libros con información completa (título, autor, editorial, año)
- ✅ Gestión del estado de préstamo de cada libro
- ✅ Catálogo completo visible para todos los usuarios
- ✅ Integración con MetaMask para transacciones seguras
- ✅ Contrato inteligente desplegado en Sepolia Testnet

## 🏗️ Estructura del Proyecto

```
Mini-Biblioteca/
├── frontend/              # Aplicación React + Vite
│   ├── src/
│   │   ├── App.jsx       # Componente principal
│   │   ├── App.css       # Estilos modernos
│   │   ├── abi.json      # ABI del contrato
│   │   └── config.js     # Configuración del contrato
│   ├── README.md         # Documentación del frontend
│   └── package.json      # Dependencias
└── README.md             # Este archivo
```

## 🚀 Tecnologías

### Frontend
- **React 19** - Framework de UI
- **Vite** - Build tool
- **Ethers.js v6** - Biblioteca para blockchain
- **CSS3** - Estilos modernos y responsive

### Blockchain
- **Solidity** - Lenguaje de smart contracts
- **Sepolia Testnet** - Red de pruebas
- **MetaMask** - Wallet

## ⚡ Inicio Rápido

### Prerrequisitos

- Node.js 18+
- MetaMask instalado
- Cuenta en Sepolia con ETH de prueba

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd Mini-Biblioteca/frontend

# Instalar dependencias
npm install

# Configurar la dirección del contrato
# Editar src/config.js con tu dirección

# Iniciar el servidor de desarrollo
npm run dev
```

## 🔗 Contrato Inteligente

### Dirección en Sepolia
```
0xe06C4263631d2CaD55D45Cb66Caa6c06821E43CA
```

**Ver en SepoliaScan:** [Ver contrato en Etherscan](https://sepolia.etherscan.io/address/0xe06C4263631d2CaD55D45Cb66Caa6c06821E43CA)

### Funciones del Contrato

```solidity
- addBook(title, author, publisher, year)
- getAllBooks()
- toggleLoan(bookId)
- getBook(bookId)
- totalBooks()
```

## 🌐 Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. Configura:
   - Framework Preset: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. ¡Deploy!

O usa el botón:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📸 Capturas

![Pantalla Principal](https://via.placeholder.com/800x400?text=Pantalla+Principal)
![Formulario de Agregar Libro](https://via.placeholder.com/800x400?text=Formulario)

## 🎯 Uso

1. **Conectar Wallet:** Conecta MetaMask (red Sepolia)
2. **Agregar Libro:** Completa el formulario y confirma
3. **Ver Libros:** Navega por el catálogo
4. **Cambiar Estado:** Marca libros como prestados/disponibles

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Abre un issue o pull request.

## 📄 Licencia

MIT License - Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado con ❤️ para demostrar Web3 y DApps.

---

**Nota:** Esta es una aplicación educativa. Usa siempre Sepolia Testnet.

