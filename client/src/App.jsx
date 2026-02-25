import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <div className="App">
            <Navbar />
            <AppRoutes />
            <Footer />
          </div>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}



export default App;

