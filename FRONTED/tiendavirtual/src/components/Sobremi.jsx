import brayan from '../assets/brayan.jpg';
const Sobremi = () => {
    return (
        
        <div className='w-100 bg-green-300 items-center justify center p-6 mx-auto mt-50'>
            <div className= "text-5xl font-extrabold text-black-100 tracking-tight text-center mb-3"> Brayan Ortiz 
            <img src={brayan} alt="brayan"  className="mx-auto w-64 h-auto my-4"/>
        <div>
            <h2 className="text-5xl font-extrabold text-indigo-700 tracking-tight text-center mb-3">Sobre mi</h2>
            <p className="text-base text-black leading-7 text-center"> Hola, mi nombre es Brayan Ortiz, tengo 19 años y soy de Colombia. Actualmente estoy aprendiendo a crear componentes en React Vite</p>
        </div>
        </div>
        </div>
       
    );
}
export default Sobremi;