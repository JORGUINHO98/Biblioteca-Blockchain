import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import ABI from './abi.json';
import { CONTRACT_ADDRESS } from './config';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    year: ''
  });

  // Listen for network changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User disconnected
          setAccount('');
          setContract(null);
        }
      };

      const handleChainChanged = () => {
        // Reload page when network changes
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  // Check if MetaMask is installed
  const checkMetaMask = () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask no está instalado. Por favor instálalo para continuar.');
      return false;
    }
    return true;
  };

  // Switch to Sepolia network
  const switchToSepolia = async () => {
    try {
      // Try to switch to Sepolia
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID
      });
      return true;
    } catch (switchError) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia',
              nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            }],
          });
          return true;
        } catch (addError) {
          console.error('Error adding Sepolia network:', addError);
          return false;
        }
      }
      console.error('Error switching to Sepolia:', switchError);
      return false;
    }
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!checkMetaMask()) return;

    try {
      setError('');
      setLoading(true);
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      // Check if connected to Sepolia
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(11155111)) {
        // Try to switch to Sepolia automatically
        const switched = await switchToSepolia();
        if (!switched) {
          setError('Por favor cambia a la red Sepolia en MetaMask manualmente');
          setLoading(false);
          return;
        }
        // Wait a bit for the switch to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      
      setContract(contractInstance);
      setAccount(accounts[0]);
      
      await loadBooks(contractInstance);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Error al conectar con MetaMask: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load books from the contract
  const loadBooks = async (contractInstance) => {
    // Check if contract address is configured
    if (CONTRACT_ADDRESS === "YOUR_CONTRACT_ADDRESS_HERE" || !CONTRACT_ADDRESS) {
      setError('⚠️ ¡IMPORTANTE! Debes actualizar la dirección del contrato en frontend/src/config.js');
      return;
    }

    try {
      setLoading(true);
      const allBooks = await contractInstance.getAllBooks();
      setBooks(allBooks);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error loading books:', err);
      
      // Better error messages
      if (err.message && err.message.includes('ENS')) {
        setError('❌ Error: La dirección del contrato no es válida. Verifica frontend/src/config.js y reemplaza YOUR_CONTRACT_ADDRESS_HERE con tu dirección del contrato en Sepolia.');
      } else {
        setError('Error al cargar los libros: ' + (err.reason || err.message || err));
      }
    } finally {
      setLoading(false);
    }
  };

  // Add a new book
  const addBook = async () => {
    if (!contract) {
      setError('Por favor conecta tu wallet primero');
      return;
    }

    // Check if contract address is configured
    if (CONTRACT_ADDRESS === "YOUR_CONTRACT_ADDRESS_HERE" || !CONTRACT_ADDRESS) {
      setError('⚠️ ¡IMPORTANTE! Debes actualizar la dirección del contrato en frontend/src/config.js con tu contrato desplegado en Sepolia.');
      return;
    }

    // Validate form data
    if (!formData.title || !formData.author || !formData.publisher || !formData.year) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const tx = await contract.addBook(
        formData.title,
        formData.author,
        formData.publisher,
        parseInt(formData.year)
      );
      
      // Show transaction hash
      console.log('Transaction sent:', tx.hash);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      // Reset form
      setFormData({ title: '', author: '', publisher: '', year: '' });
      
      // Reload books
      await loadBooks(contract);
      
      alert('✅ Libro agregado exitosamente a la blockchain!');
    } catch (err) {
      console.error('Error adding book:', err);
      
      // Better error messages
      if (err.message && err.message.includes('ENS')) {
        setError('❌ Error: La dirección del contrato no es válida. Verifica frontend/src/config.js');
      } else if (err.message && err.message.includes('user rejected')) {
        setError('❌ Transacción cancelada por el usuario');
      } else if (err.message && err.message.includes('insufficient funds')) {
        setError('❌ No tienes suficiente ETH para pagar la transacción. Necesitas Sepolia ETH');
      } else {
        setError('Error al agregar el libro: ' + (err.reason || err.message || err));
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle loan status
  const toggleLoan = async (bookId) => {
    if (!contract) {
      setError('Por favor conecta tu wallet primero');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const tx = await contract.toggleLoan(bookId);
      await tx.wait();
      
      // Reload books
      await loadBooks(contract);
    } catch (err) {
      console.error('Error toggling loan:', err);
      setError('Error al cambiar el estado de préstamo: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📚 Mini Biblioteca Blockchain</h1>
        <p className="subtitle">Sistema descentralizado de gestión de libros</p>
      </header>

      <main className="main-content">
        {/* Wallet Connection */}
        {!account ? (
          <div className="connect-section">
            <div className="wallet-card">
              <h2>Conecta tu Wallet</h2>
              <p>Conecta tu cuenta de MetaMask en la red Sepolia para comenzar</p>
              <p className="info-text">💡 No tienes la red Sepolia? La agregaremos automáticamente</p>
              <button 
                className="btn btn-primary btn-large" 
                onClick={connectWallet}
                disabled={loading}
              >
                {loading ? '⏳ Conectando...' : '🦊 Conectar MetaMask'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Wallet Info */}
            <div className="wallet-info">
              <div className="account-badge">
                <span className="badge-dot"></span>
                <span className="account-text">Conectado: {account.slice(0, 6)}...{account.slice(-4)}</span>
              </div>
              <div className="wallet-actions">
                <button 
                  className="btn btn-icon" 
                  onClick={() => loadBooks(contract)}
                  disabled={loading}
                  title="Actualizar libros"
                >
                  🔄 Actualizar
                </button>
                <button className="btn btn-secondary" onClick={() => window.location.reload()}>
                  🚪 Desconectar
                </button>
              </div>
            </div>

            {/* Add Book Form */}
            <div className="form-section">
              <div className="form-card">
                <h2>➕ Agregar Nuevo Libro</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Título del Libro</label>
                    <input
                      type="text"
                      placeholder="Ingresa el título"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Autor</label>
                    <input
                      type="text"
                      placeholder="Ingresa el autor"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Editorial</label>
                    <input
                      type="text"
                      placeholder="Ingresa la editorial"
                      value={formData.publisher}
                      onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Año de Publicación</label>
                    <input
                      type="number"
                      placeholder="Ej: 2024"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button 
                    className="btn btn-outline btn-block"
                    onClick={() => setFormData({ title: '', author: '', publisher: '', year: '' })}
                    disabled={loading}
                    type="button"
                  >
                    🗑️ Limpiar
                  </button>
                  <button 
                    className="btn btn-primary btn-block" 
                    onClick={addBook}
                    disabled={loading}
                    type="button"
                  >
                    {loading ? '⏳ Procesando...' : '✨ Agregar Libro'}
                  </button>
                </div>
              </div>
            </div>

            {/* Books List */}
            <div className="books-section">
              <div className="section-header">
                <h2>📖 Catálogo de Libros</h2>
                <button 
                  className="btn btn-secondary btn-small"
                  onClick={() => loadBooks(contract)}
                  disabled={loading}
                >
                  🔄 Actualizar
                </button>
              </div>
              
              {loading && books.length === 0 ? (
                <div className="loading">Cargando libros...</div>
              ) : books.length === 0 ? (
                <div className="empty-state">
                  <p>📭 No hay libros registrados aún</p>
                  <p>Agrega tu primer libro usando el formulario de arriba</p>
                </div>
              ) : (
                <div className="books-grid">
                  {books.map((book, index) => (
                    <div key={index} className={`book-card ${book.onLoan ? 'on-loan' : ''}`}>
                      <div className="book-header">
                        <h3>{book.title}</h3>
                        <span className={`status-badge ${book.onLoan ? 'loan' : 'available'}`}>
                          {book.onLoan ? '⏳ Prestado' : '✅ Disponible'}
                        </span>
                      </div>
                      <div className="book-details">
                        <div className="detail-row">
                          <span className="detail-label">✍️ Autor:</span>
                          <span className="detail-value">{book.author}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">🏢 Editorial:</span>
                          <span className="detail-value">{book.publisher}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">📅 Año:</span>
                          <span className="detail-value">{book.year.toString()}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">📆 Agregado:</span>
                          <span className="detail-value">{formatDate(book.addedAt)}</span>
                        </div>
      </div>
                      <button
                        className={`btn btn-toggle ${book.onLoan ? 'btn-available' : 'btn-loan'}`}
                        onClick={() => toggleLoan(book.id)}
                        disabled={loading}
                      >
                        {book.onLoan ? '✅ Marcar como Disponible' : '⏳ Marcar como Prestado'}
        </button>
                    </div>
                  ))}
                </div>
              )}
      </div>
          </>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
            <button 
              className="error-close" 
              onClick={() => setError('')}
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Desarrollado con ❤️ usando React, Vite y Solidity</p>
        <p>Red: Sepolia Testnet</p>
      </footer>
    </div>
  );
}

export default App;
