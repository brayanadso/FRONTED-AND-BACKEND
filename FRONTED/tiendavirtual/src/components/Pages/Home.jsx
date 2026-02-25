import Navbar from "../Layout/Navbar.jsx"
import Hero from "../Home/Hero.jsx"
import Categoria from "../Home/Categoria.jsx"
import Newsletter from "../Home/Newsletter.jsx"
import Footer from "../Layout/Footer.jsx"
import Featureproducts from "../Home/Featureproducts.jsx"
import Contacto from "../Home/Contacto.jsx"

export default function Home() {
    return(
        <>
        <Navbar />
        <Hero/>
        <Categoria/>
        <Featureproducts/>
        <Contacto/>
        <Newsletter/>
        <Footer/>
        
        </>
    );
}