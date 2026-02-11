function Categories() {
  const categories = [
    {
      id: 'laptops',
      emoji: '💻',
      title: 'Laptops',
      description: 'Las mejores marcas y modelos para trabajo y gaming'
    },
    {
      id: 'celulares',
      emoji: '📱',
      title: 'Celulares',
      description: 'Última tecnología móvil de todas las marcas'
    },
    {
      id: 'componentes',
      emoji: '⚙️',
      title: 'Componentes PC',
      description: 'Arma tu PC ideal con los mejores componentes'
    }
  ];

return (
    <section id="categorias" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Nuestras Categorías</h2>
          <p className="text-gray-600 text-lg">Descubre nuestra amplia gama de productos tecnológicos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 cursor-pointer"
            >
              <div className="text-6xl mb-6 filter drop-shadow-lg">
                {category.emoji}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                {category.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {category.description}
              </p>
              <div className="text-blue-600 font-semibold">Ver más -----</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;