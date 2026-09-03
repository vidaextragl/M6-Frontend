import { Link } from 'react-router-dom'

export function PrivacyPage() {
  return (
    <div className="auth-page">
      <div className="legal-page">
        <h1>Política de privacidad</h1>
        <p>Última actualización: {new Date().getFullYear()}</p>

        <h2>1. Qué datos recopilamos</h2>
        <p>Solo pedimos lo necesario: tu nombre, tu correo y tu contraseña (guardada de forma segura, encriptada, nunca la vemos tal cual la escribiste).</p>

        <h2>2. Para qué usamos tus datos</h2>
        <p>Usamos tu información únicamente para darte el servicio de billetera virtual y para avisarte cosas importantes sobre tu cuenta. Nada de venderla ni compartirla con quien no debe.</p>

        <h2>3. Tus derechos</h2>
        <p>Es tu cuenta y tus datos, así que puedes pedir que los borremos cuando quieras. Solo contáctanos y lo resolvemos.</p>

        <h2>4. Seguridad</h2>
        <p>Nos tomamos en serio proteger tu información. Aun así, te recomendamos usar una contraseña fuerte (por algo te la pedimos) y no compartirla con nadie.</p>

        <Link to="/register" className="legal-back-link">← Volver al registro</Link>
      </div>
    </div>
  )
}