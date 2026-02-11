async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);
  setMessage({ type: '', text: '' });

  try {
    const response = await axios.post(
      'http://localhost:8081/api/login',
      {
        email: email,
        password: password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const data = response.data;

    setMessage({
      type: 'success',
      text: `¡Bienvenido ${data.usuario?.nombre || ''}!`
    });

    // guardar sesión
    localStorage.setItem('usuario', JSON.stringify(data.usuario));

    setTimeout(() => {
      navigate('/Home');
    }, 1000);

  } catch (error) {
    console.error('Error:', error);

    if (error.response) {
      if (error.response.status === 404) {
        setMessage({ type: 'error', text: 'Usuario no encontrado' });
      } else if (error.response.status === 401) {
        setMessage({ type: 'error', text: 'Contraseña incorrecta' });
      } else {
        setMessage({
          type: 'error',
          text: error.response.data.message || 'Error al iniciar sesión'
        });
      }
    } else {
      setMessage({
        type: 'error',
        text: 'No se pudo conectar con el servidor'
      });
    }
  } finally {
    setLoading(false);
  }
}
