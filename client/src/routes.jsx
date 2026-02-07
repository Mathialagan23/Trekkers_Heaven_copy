import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Accommodations from './pages/Accommodations';
import Flights from './pages/Flights';
import Buses from './pages/Buses';
import Trains from './pages/Trains';
import Itineraries from './pages/Itineraries';
import Blogs from './pages/Blogs';
import Map from './pages/Map';
import Expenses from './pages/Expenses';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accommodations"
        element={
          <ProtectedRoute>
            <Accommodations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/flights"
        element={
          <ProtectedRoute>
            <Flights />
          </ProtectedRoute>
        }
      />
      <Route
        path="/buses"
        element={
          <ProtectedRoute>
            <Buses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trains"
        element={
          <ProtectedRoute>
            <Trains />
          </ProtectedRoute>
        }
      />
      <Route
        path="/itineraries"
        element={
          <ProtectedRoute>
            <Itineraries />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blogs"
        element={
          <ProtectedRoute>
            <Blogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <Map />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses/:itineraryId"
        element={
          <ProtectedRoute>
            <Expenses />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;

