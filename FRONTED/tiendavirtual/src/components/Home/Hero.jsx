export default function Hero() {
  return (
    <section className="bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-5xl md:text-6xl mb-6 font-bold">
          Encuentra la mejor <span className="text-yellow-300">tecnología</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Laptops, celulares y componentes PC al mejor precio del mercado
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#productos"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition duration-300 transform hover:scale-105"
          >
            Ver Productos
          </a>
          
          <a 
            href="#"
            className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
          >
            Ofertas Especiales
          </a>
        </div>
      </div>
    </section>
  );
}