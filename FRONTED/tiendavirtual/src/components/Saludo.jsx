import brayan from '../assets/brayan.jpg';

const Saludo = () => {
    return (
        <div className='min-h-screen w-full flex flex-col items-center justify-center bg-amber-600 text-amber-500 p-6'>
            <img src={brayan} alt="brayan"  className='w-40 h-40 rounded-full object-cover mb-4'/>
            <h2 className='text-2xl font-bold'>Brayan Ortiz</h2>
            <p> Estoy aprendiendo a crear componenten en React Vite</p>
             </div>

    );
}   
export default Saludo;