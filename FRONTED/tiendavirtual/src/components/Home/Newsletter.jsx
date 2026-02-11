import { useState } from 'react';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!email || !email.includes('@')) {
      setMessage('Por favor ingresa un email válido');
      return;
    }

    setIsSubmitting(true);
    
    // Simular envío (aquí conectarías con tu backend/API)
    setTimeout(() => {
      setMessage('¡Gracias por suscribirte! 🎉');
      setEmail('');
      setIsSubmitting(false);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  return (
    <section className="py-16 bg-linear-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto px-4 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Mantente al día con TechStore Pro</h2>
        <p className="text-lg mb-8 opacity-90">
          Recibe las últimas ofertas y novedades tecnológicas
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu email"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando...' : 'Suscribirse'}
            </button>
          </div>
          
          {/* Mensaje de feedback */}
          {message && (
            <p className="mt-4 text-sm font-medium">
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default Newsletter;