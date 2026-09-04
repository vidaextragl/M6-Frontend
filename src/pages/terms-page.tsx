import { Link } from 'react-router-dom'

export function TermsPage() {
  return (
    <div className="auth-page">
      <div className="legal-page">
        <h1>Términos y condiciones</h1>
        <p>Última actualización: {new Date().getFullYear()}</p>

        <h2>1. Aceptación de los términos</h2>
        <p>Al registrarte en Vida Extra, aceptas estos términos y condiciones de uso. Si no estás de acuerdo con alguno, mejor no te registres, compa.</p>

        <h2>2. Uso de la plataforma</h2>
        <p>Vida Extra es una billetera virtual multi-moneda pensada para la comunidad gamer. Está bien usarla para tus compras de juegos, cambiar divisas y acumular tu cashback — no está bien usarla para cosas raras. El mal uso puede resultar en la suspensión de tu cuenta.</p>

        <h2>3. Cuentas de usuario</h2>
        <p>Eres responsable de cuidar tu contraseña y de todo lo que pase en tu cuenta. Si crees que alguien más entró sin tu permiso, avísanos de volada.</p>

        <h2>4. Cambios en el servicio</h2>
        <p>Podemos actualizar la plataforma, agregar funciones nuevas o hacer ajustes cuando haga falta, siempre buscando mejorar tu experiencia.</p>

        <Link to="/register" className="legal-back-link">← Volver al registro</Link>
      </div>
    </div>
  )
}