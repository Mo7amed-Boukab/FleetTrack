
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation simple
    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    // Simulation de connexion
    setTimeout(() => {
      if (formData.email && formData.password) {
        navigate('/dashboard');
      } else {
        setError('Email ou mot de passe incorrect');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-800 rounded mb-4">
            <Truck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">FleetTrack</h1>
          <p className="text-sm text-gray-600">Gestion de flotte de transport</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white border border-gray-200 rounded p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2  text-center">Connexion</h2>
          <p className="text-center text-sm text-gray-500 mb-8">Entrez vos identifiants pour accéder à votre compte</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded outline-none"
                  placeholder="votre@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded outline-none"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-800 text-white py-2.5 text-sm font-medium rounded hover:bg-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Note de test */}
          <div className="mt-6 p-3 bg-gray-50 border border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-1">Comptes de test :</p>
            <p className="text-xs text-gray-600">
              <strong>Admin:</strong> admin@fleettrack.com
            </p>
            <p className="text-xs text-gray-600">
              <strong>Chauffeur:</strong> driver@fleettrack.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;