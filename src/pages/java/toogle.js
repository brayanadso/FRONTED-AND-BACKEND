// funcion de visibilidad del ojito

document.getElementById('toogle-password').addEventListener('click', function(){
    const passwordInput=document.getElementById('password');
    const eyeopen=document.getElementById('eye-icon-open');
    const eyeclosed=document.getElementById('eye-icon-closed');

    // verificacion si la contraseña esta oculta 

    const isHidden = passwordInput.type ==='password';

    // cambiar el password a texto

    passwordInput.type=isHidden ? 'text':'password';

    // alteracion de ojito 

    eyeopen.classList.toogle('hidden',!isHidden);
    eyeclosed.classList.toogle('hidden',isHidden);
})