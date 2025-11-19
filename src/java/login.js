// script de login - Techstore pro

// verificar que toda la paginna este cargada con los elementos
// html

document.addEventListener('DOMContentLoaded', function(){
    console.log('✅ pagina cargada correcta - sistema listo');
    // creamos la constante de la Api

    const API_URL="http://localhost:8081/api/login";

    // enviar los datos del formulario

    document.getElementById('login-form').addEventListener('submit',async function (e){
        e.preventDefault();

        //Preparamos los elementos de la pagina
        
        const btn = document.getElementById('login-btn');
        const errorDiv=document.getElementById('login-error');
        const errormsg=document.getElementById('login-error-message');

        errorDiv.classList.add('hidden');

        // recoger los campos del formulario

        const datos={
            email:document.getElementById('email').value.trim(),
            password:document.getElementById('password').value
        };
        // validar los campos no esten vacios

    if (!datos.email || !datos.password){
        errormsg.textContent='por favor complete los datos';
        errorDiv.classList.remove('hidden');
        return;
    }
    // cambiar el boton mientras procesa

    btn.disabled=true;
    btn.textContent='iniciando sesion...';

    //envai los datos al servidor
    try {
        const response=await fetch(API_URL,{
            method :'POST',
            headers :{'Content-Type': 'application/json'},
            body : JSON.stringify(datos)
            
        }); 
        // recibir respuesta del servidor

        const resultado= await response.json();
        if (response.ok){
            console.log('201- inicio de sesion exitoso');

            // guardar informacion

            localStorage.setItem("sesionActiva", "true");
            localStorage.setItem("usuario",JSON.stringify({
                id:resultado.usuario.id,
                email: resultado.usuario.email,
                telefono: resultado.usuario.telefono

            }));
            //mensaje de exito
            errorDiv.className= 'bg-green-50 border-green-200 text-green-800 px-4 py-3 rounder-lg';
            errormsg.textContent='inicio de sesion, redirigiendo....';
            errorDiv.classList.remove('hidden');

            //redirigir a productos

            setTimeout(()=> window.location.href ='productos.html', 8000);
            // credenciales incorrectas

        }   else{
            errormsg.textContent=resultado.message || ' credenciales incorrectas';
            errorDiv.classList.remove('hidden');
            btn.disabled=false;
            btn.innerHTML= 'iniciar sesio';
        }

        //si no hay conexion al servidor


    } catch (error) {
        console.error('error 404- error de conexion con el servidor');
        errormsg.textContent='error de conexion de servidor';
        errorDiv.classList.remove('hidden');
        btn.disabled=false;
        btn.innerHTML='iniciar sesion';
    }


    });

});