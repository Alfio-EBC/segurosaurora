import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo, useState } from "react";
import logoAurora from "./assets/logotipo-Aurora-Seguros.svg";
import icono from "./assets/icono.svg";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  ProgressBar,
  Row,
  OverlayTrigger,
  Tooltip,
  Modal,
  Tab,
  Tabs,
  Toast,
  ToastContainer,
} from "react-bootstrap";

import "./App.css";

const STEPS = [
  { title: "Filtrar", subtitle: "Tus necesidades" },
  { title: "Explorar", subtitle: "Opciones de cobertura" },
  { title: "Elegir", subtitle: "Modalidad" },
  { title: "Validar", subtitle: "Verificación y salud" },
  { title: "Pagar", subtitle: "Método de pago" },
  { title: "Confirmar", subtitle: "Resumen final" },
];

const USER_TYPES = [
  {
    id: "impaciente",
    title: "Práctico y ágil",
    description: "Prefieres pocos pasos, información directa y una decisión rápida.",
    recommendation: "Te mostraremos un resumen ejecutivo con la opción de descargar tu cotización al instante.",
  },
  {
    id: "analitico",
    title: "Detallista",
    description: "Te gusta comparar coberturas, condiciones y beneficios a fondo.",
    recommendation: "Destacaremos los detalles de coberturas, exclusiones y documentos clave para ti.",
  },
  {
    id: "corporativo",
    title: "Empresarial",
    description: "Buscas protección a la medida para tu compañía o equipo de trabajo.",
    recommendation: "Priorizaremos soluciones corporativas y la opción de contacto directo con un asesor especializado.",
  },
];

const CATEGORIES = [
  { id: "vida", title: "Vida", description: "Respaldo y estabilidad económica para tu familia." },
  { id: "salud", title: "Salud", description: "Bienestar integral y acceso a red médica preferencial." },
  { id: "accidentes", title: "Accidentes personales", description: "Protección y tranquilidad ante imprevistos diarios." },
  { id: "empresas", title: "Empresas", description: "Soluciones de alta cobertura para organizaciones." },
];

function ActionTooltip({ text, children }) {
  return (
    <span className="custom-tooltip-wrapper" data-tooltip={text}>
      {children}
    </span>
  );
}

function StepIndicator({ currentStep, onStepClick }) {
  const getStepTooltip = (number, title, completed, active) => {
    if (completed) {
      return `Paso ${number}: ${title} (Completado). Haz clic para regresar y modificar.`;
    }
    if (active) {
      return `Paso ${number}: ${title} (Paso actual).`;
    }
    return `Paso ${number}: ${title}. Completa los pasos anteriores para acceder.`;
  };

  return (
    <nav aria-label="Progreso de la cotización" className="stepper mb-4" role="navigation">
      {STEPS.map((step, index) => {
        const number = index + 1;
        const completed = number < currentStep;
        const active = number === currentStep;
        const tooltipText = getStepTooltip(number, step.title, completed, active);

        return (
          <ActionTooltip key={step.title} text={tooltipText}>
            <button
              type="button"
              className={`stepper-item ${active ? "active" : ""} ${completed ? "completed" : ""}`}
              aria-current={active ? "step" : undefined}
              aria-label={`Paso ${number}: ${step.title}${completed ? ", completado" : active ? ", actual" : ""}`}
              onClick={() => {
                if (number < currentStep) onStepClick(number);
              }}
              disabled={number >= currentStep}
            >
              <span className="stepper-number" aria-hidden="true">
                {completed ? "✓" : number}
              </span>
              <span className="stepper-copy">
                <strong>{step.title}</strong>
                <small>{step.subtitle}</small>
              </span>
            </button>
          </ActionTooltip>
        );
      })}
    </nav>
  );
}

function StepOne({ data, updateData }) {
  return (
    <section aria-label="Paso 1: Filtrar datos de cotización">
      <p className="section-intro">
        Cuéntanos quién se va a proteger y qué tipo de cobertura buscas. Diseñaremos las mejores alternativas para ti.
      </p>
      <Row className="g-3">
        <Col md={6}>
          <Form.Group controlId="userKind">
            <Form.Label>¿Para quién deseas tu seguro? <span className="required" aria-hidden="true">*</span></Form.Label>
            <Form.Select
              value={data.userKind}
              onChange={(event) => updateData("userKind", event.target.value)}
              required
              aria-required="true"
              aria-describedby="userKindHelp"
            >
              <option value="">Elige una opción</option>
              <option value="persona">Para mí o mi familia</option>
              <option value="empresa">Para una empresa u organización</option>
            </Form.Select>
            <Form.Text id="userKindHelp">Esto nos ayuda a enfocar las opciones según tus necesidades.</Form.Text>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="ages">
            <Form.Label>Edades de los asegurados <span className="required" aria-hidden="true">*</span></Form.Label>
            <Form.Control
              value={data.ages}
              onChange={(event) => updateData("ages", event.target.value)}
              placeholder="Ej. 35, 32, 8"
              aria-describedby="agesHelp"
              aria-required="true"
              required
            />
            <Form.Text id="agesHelp">Escribe solo las edades separadas por comas (sin nombres).</Form.Text>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="planType">
            <Form.Label>Modalidad de plan <span className="required" aria-hidden="true">*</span></Form.Label>
            <Form.Select
              value={data.planType}
              onChange={(event) => updateData("planType", event.target.value)}
              required
              aria-required="true"
            >
              <option value="">Selecciona la modalidad</option>
              <option value="individual">Individual</option>
              <option value="familiar">Familiar</option>
              <option value="colectivo">Colectivo</option>
              <option value="empresarial">Empresarial</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="budget">
            <Form.Label>Presupuesto orientativo (opcional)</Form.Label>
            <Form.Select value={data.budget} onChange={(event) => updateData("budget", event.target.value)}>
              <option value="">Prefiero explorar todas las opciones</option>
              <option value="bajo">Económico / Básico</option>
              <option value="medio">Equilibrado / Intermedio</option>
              <option value="alto">Cobertura amplia / Premium</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </section>
  );
}

function StepTwo({ data, updateData }) {
  const filtered = useMemo(() => {
    if (data.userKind === "empresa") return CATEGORIES.filter((item) => item.id === "empresas");
    return CATEGORIES.filter((item) => item.id !== "empresas");
  }, [data.userKind]);

  return (
    <section aria-label="Paso 2: Explorar categorías y preferencias">
      <p className="section-intro">
        Selecciona la categoría de protección que deseas y cuéntanos cómo prefieres tomar tu decisión.
      </p>
      <fieldset className="mb-4">
        <legend className="form-label fs-6 fw-bold">¿Qué área deseas proteger? <span className="required" aria-hidden="true">*</span></legend>
        <Row className="g-3" role="radiogroup" aria-label="Categorías de servicio">
          {filtered.map((category) => (
            <Col md={6} key={category.id}>
              <Form.Check
                type="radio"
                id={`category-${category.id}`}
                name="category"
                className="visually-hidden"
                checked={data.category === category.id}
                onChange={() => updateData("category", category.id)}
                label={category.title}
              />
              <label
                htmlFor={`category-${category.id}`}
                className={`category-option ${data.category === category.id ? "selected" : ""}`}
              >
                <span className="category-check" aria-hidden="true">{data.category === category.id ? "✓" : "+"}</span>
                <strong>{category.title}</strong>
                <span>{category.description}</span>
              </label>
            </Col>
          ))}
        </Row>
      </fieldset>

      <hr className="my-4" />
      <fieldset>
        <legend className="form-label fs-6 fw-bold">¿Cómo describes tu estilo para decidir? <span className="required" aria-hidden="true">*</span></legend>
        <Row className="g-3" role="radiogroup" aria-label="Perfil de toma de decisión">
          {USER_TYPES.map((type) => (
            <Col lg={4} key={type.id}>
              <Form.Check
                type="radio"
                id={`profile-${type.id}`}
                name="profile"
                className="visually-hidden"
                checked={data.profile === type.id}
                onChange={() => updateData("profile", type.id)}
                label={type.title}
              />
              <label
                htmlFor={`profile-${type.id}`}
                className={`profile-option ${data.profile === type.id ? "selected" : ""}`}
              >
                <strong>{type.title}</strong>
                <span>{type.description}</span>
              </label>
            </Col>
          ))}
        </Row>
      </fieldset>
      {data.profile && (
        <Alert variant="info" className="mt-4 recommendation-alert" role="status" aria-live="polite">
          <strong>Enfoque recomendado:</strong>{" "}
          {USER_TYPES.find((item) => item.id === data.profile)?.recommendation}
        </Alert>
      )}
    </section>
  );
}

function StepThree({ data, updateData, onRequestQuote, onPurchase }) {
  const selectedProfile = USER_TYPES.find((item) => item.id === data.profile);
  const corporate = data.userKind === "empresa" || data.profile === "corporativo";
  return (
    <section aria-label="Paso 3: Elegir modalidad de cotización o compra">
      <p className="section-intro">
        Estás a un paso de asegurar tu tranquilidad. Guarda tu cotización detallada o avanza directamente a la contratación.
      </p>
      {selectedProfile && (
        <Alert variant="light" className="profile-summary" role="status">
          <Badge bg="secondary" className="me-2">Tu estilo</Badge>
          <strong>{selectedProfile.title}.</strong> {selectedProfile.recommendation}
        </Alert>
      )}
      <Row className="g-3">
        <Col md={6}>
          <Card className="choice-card h-100">
            <Card.Body>
              <div className="choice-icon" aria-hidden="true">↧</div>
              <Card.Title as="h3" className="h5">Guardar cotización</Card.Title>
              <Card.Text>Te enviamos un resumen completo a tu correo para analizarlo con calma.</Card.Text>
              <Form.Group controlId="quoteName" className="mb-3">
                <Form.Label>Nombre y apellido <span className="required" aria-hidden="true">*</span></Form.Label>
                <Form.Control value={data.name} onChange={(e) => updateData("name", e.target.value)} autoComplete="name" required aria-required="true" />
              </Form.Group>
              <Form.Group controlId="quoteEmail" className="mb-3">
                <Form.Label>Correo electrónico <span className="required" aria-hidden="true">*</span></Form.Label>
                <Form.Control type="email" value={data.email} onChange={(e) => updateData("email", e.target.value)} autoComplete="email" required aria-required="true" />
              </Form.Group>
              <Form.Group controlId="quotePhone" className="mb-3">
                <Form.Label>Teléfono de contacto <span className="required" aria-hidden="true">*</span></Form.Label>
                <Form.Control type="tel" value={data.phone} onChange={(e) => updateData("phone", e.target.value)} autoComplete="tel" required aria-required="true" />
              </Form.Group>
              <Form.Check
                id="quoteConsent"
                checked={data.consent}
                onChange={(e) => updateData("consent", e.target.checked)}
                label="Autorizo el tratamiento de mis datos para gestionar esta solicitud."
                aria-required="true"
              />
              <div className="mt-3">
                <ActionTooltip text="Valida tus datos y genera tu cotización en formato digital.">
                  <Button variant="primary" onClick={onRequestQuote} aria-label="Solicitar cotización en PDF">
                    Enviar cotización por correo
                  </Button>
                </ActionTooltip>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="choice-card h-100">
            <Card.Body>
              <div className="choice-icon" aria-hidden="true">→</div>
              <Card.Title as="h3" className="h5">{corporate ? "Asesoría especializada" : "Continuar con la contratación"}</Card.Title>
              <Card.Text>
                {corporate
                  ? "Un especialista se pondrá en contacto para diseñar una solución corporativa a la medida."
                  : "Ingresa tus datos personales, completa la declaración de salud y finaliza de forma segura."}
              </Card.Text>
              {corporate && (
                <Alert variant="secondary" role="note">
                  En este modo demo, simularemos el contacto directo con un asesor asignado.
                </Alert>
              )}
              <ActionTooltip text="Conserva tu progreso y avanza hacia la validación de identidad y pago.">
                <Button variant="primary" onClick={onPurchase} aria-label="Continuar con el flujo de compra">
                  {corporate ? "Solicitar llamada con asesor" : "Iniciar contratación online →"}
                </Button>
              </ActionTooltip>
              <p className="small-muted mt-2">Ambiente de pruebas seguro y libre de cobros reales.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
  );
}

function StepFour({ data, updateData }) {
  return (
    <section aria-label="Paso 4: Validar datos y declaración de salud">
      <p className="section-intro">Por favor, confirma los datos del tomador y responde con honestidad la declaración de salud.</p>
      <Row className="g-3">
        <Col md={6}>
          <Form.Group controlId="fullName">
            <Form.Label>Nombre completo <span className="required" aria-hidden="true">*</span></Form.Label>
            <Form.Control value={data.name} onChange={(e) => updateData("name", e.target.value)} autoComplete="name" required aria-required="true" />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="document">
            <Form.Label>Documento de identidad <span className="required" aria-hidden="true">*</span></Form.Label>
            <Form.Control value={data.document} onChange={(e) => updateData("document", e.target.value)} placeholder="Ej. CC 12345678" autoComplete="off" required aria-required="true" />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="email">
            <Form.Label>Correo electrónico <span className="required" aria-hidden="true">*</span></Form.Label>
            <Form.Control type="email" value={data.email} onChange={(e) => updateData("email", e.target.value)} autoComplete="email" required aria-required="true" />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="phone">
            <Form.Label>Celular de contacto <span className="required" aria-hidden="true">*</span></Form.Label>
            <Form.Control type="tel" value={data.phone} onChange={(e) => updateData("phone", e.target.value)} autoComplete="tel" required aria-required="true" />
          </Form.Group>
        </Col>
      </Row>
      <hr className="my-4" />
      <Form.Check
        id="healthDeclaration"
        className="mb-3"
        checked={data.healthDeclaration}
        onChange={(e) => updateData("healthDeclaration", e.target.checked)}
        label="Confirmo que he respondido la declaración de salud de forma veraz y completa."
        aria-required="true"
      />
      <Form.Check
        id="privacyConsent"
        className="mb-3"
        checked={data.privacyConsent}
        onChange={(e) => updateData("privacyConsent", e.target.checked)}
        label="He leído el aviso de privacidad y autorizo el tratamiento seguro de mis datos."
        aria-required="true"
      />
      <Alert variant="warning" role="region" aria-label="Instrucciones OTP">
        <strong>Verificación de seguridad:</strong> Te enviaremos un código temporal para validar tu identidad.
      </Alert>
      <Form.Group controlId="otp">
        <Form.Label>Código de verificación (OTP) <span className="required" aria-hidden="true">*</span></Form.Label>
        <Form.Control
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={data.otp}
          onChange={(e) => updateData("otp", e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="Ingresa el código de 6 dígitos"
          aria-describedby="otpHelp"
          aria-required="true"
          required
        />
        <Form.Text id="otpHelp">Pista para pruebas: puedes escribir <strong>123456</strong>.</Form.Text>
      </Form.Group>
    </section>
  );
}

function StepFive({ data, updateData }) {
  return (
    <section aria-label="Paso 5: Pagar y facturación">
      <p className="section-intro">Indica cómo deseas realizar el pago de tu póliza. Recuerda que este es un entorno de pruebas.</p>
      <Alert variant="info" role="note">
        Transacción simulada por seguridad. No se realizarán cargos reales a tus cuentas.
      </Alert>
      <Row className="g-3">
        <Col md={6}>
          <Form.Group controlId="payerName">
            <Form.Label>Titular del medio de pago <span className="required" aria-hidden="true">*</span></Form.Label>
            <Form.Control value={data.payerName} onChange={(e) => updateData("payerName", e.target.value)} autoComplete="cc-name" required aria-required="true" />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="paymentMethod">
            <Form.Label>Pasarela o método de pago <span className="required" aria-hidden="true">*</span></Form.Label>
            <Form.Select value={data.paymentMethod} onChange={(e) => updateData("paymentMethod", e.target.value)} required aria-required="true">
              <option value="">Selecciona una opción</option>
              <option value="payu">PayU (Tarjetas / PSE)</option>
              <option value="paypal">PayPal</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="billingEmail">
            <Form.Label>Correo para recibir la factura <span className="required" aria-hidden="true">*</span></Form.Label>
            <Form.Control type="email" value={data.email} onChange={(e) => updateData("email", e.target.value)} autoComplete="email" required aria-required="true" />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="billingAddress">
            <Form.Label>Dirección de correspondencia <span className="required" aria-hidden="true">*</span></Form.Label>
            <Form.Control value={data.billingAddress} onChange={(e) => updateData("billingAddress", e.target.value)} autoComplete="street-address" required aria-required="true" />
          </Form.Group>
        </Col>
      </Row>
    </section>
  );
}

function StepSix({ data, updateData }) {
  return (
    <section aria-label="Paso 6: Confirmación y calificación">
      <div className="success-mark text-center mb-3" aria-hidden="true" style={{ fontSize: "2rem", color: "#00875A" }}>✓</div>
      <h2 className="h4 text-center">¡Solicitud lista con éxito!</h2>
      <p className="section-intro text-center">Revisa el resumen de los detalles de tu póliza seleccionada.</p>
      <Card className="summary-card mb-4" role="region" aria-label="Resumen de solicitud">
        <Card.Body>
          <Row className="g-3">
            <Col sm={6}><span className="summary-label d-block text-muted">Tipo de cliente</span><strong>{data.userKind === "empresa" ? "Empresa / persona jurídica" : "Persona o familia"}</strong></Col>
            <Col sm={6}><span className="summary-label d-block text-muted">Categoría elegida</span><strong>{CATEGORIES.find((item) => item.id === data.category)?.title || "Sin seleccionar"}</strong></Col>
            <Col sm={6}><span className="summary-label d-block text-muted">Modalidad</span><strong>{data.planType || "Sin seleccionar"}</strong></Col>
            <Col sm={6}><span className="summary-label d-block text-muted">Método de pago</span><strong>{data.paymentMethod ? data.paymentMethod.toUpperCase() : "Sin seleccionar"}</strong></Col>
            <Col sm={12}><span className="summary-label d-block text-muted">Correo electrónico registrado</span><strong>{data.email || "Sin registrar"}</strong></Col>
          </Row>
        </Card.Body>
      </Card>
      <fieldset>
        <legend className="form-label fs-6 fw-bold">¿Cómo calificarías tu experiencia en este cotizador?</legend>
        <div className="rating-options d-flex gap-2 mb-2" role="group" aria-label="Califica la experiencia del 1 al 5">
          {[1, 2, 3, 4, 5].map((score) => (
            <Button
              key={score}
              variant={data.rating === score ? "primary" : "outline-secondary"}
              aria-pressed={data.rating === score}
              aria-label={`Calificar con ${score} de 5 estrellas`}
              onClick={() => updateData("rating", score)}
            >
              {score}
            </Button>
          ))}
        </div>
        <Form.Text id="ratingHelp">1 = Muy difícil · 5 = Excelente</Form.Text>
      </fieldset>
      <Form.Group controlId="feedback" className="mt-3">
        <Form.Label>Comentarios o sugerencias (opcional)</Form.Label>
        <Form.Control as="textarea" rows={3} value={data.feedback} onChange={(e) => updateData("feedback", e.target.value)} placeholder="¿Hay algo que podríamos haber hecho mejor?" />
      </Form.Group>
    </section>
  );
}

function WelcomeScreen({ onStart }) {
  return (
    <section 
      className="welcome-screen min-vh-100" 
      aria-labelledby="welcome-title"
    >
      <div 
        className="welcome-content d-flex flex-column align-items-center justify-content-center py-5 px-4 w-100 mx-auto text-center position-relative z-1" 
        style={{ maxWidth: "700px" }}
      >
        <div className="d-flex flex-column align-items-center justify-content-center w-100 mb-4">
          <div className="mb-2">
            <img
              src={icono}
              alt="Aurora Seguros"
              className="logo-aurora"
              style={{ height: "40px", width: "auto", display: "block" }}
              onError={(e) => {
                console.error("Error al cargar la imagen del logo:", e);
              }}
            />
          </div>

          <div className="d-flex align-items-center justify-content-center gap-2">
            <span style={{ width: "24px", height: "1px", backgroundColor: "rgba(255, 255, 255, 0.6)" }} aria-hidden="true"></span>
            
            <span className="text-uppercase fw-semibold tracking-widest text-light small" style={{ letterSpacing: "3px", fontSize: "0.8rem", opacity: 0.95 }}>
              AURORA SEGUROS
            </span>
            
            <span style={{ width: "24px", height: "1px", backgroundColor: "rgba(255, 255, 255, 0.6)" }} aria-hidden="true"></span>
          </div>
        </div>
        <h1 
          id="welcome-title" 
          className="display-4 fw-bold text-white text-center mb-4" 
          style={{ letterSpacing: "-1px", lineHeight: "1.15", textShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
        >
          Tu tranquilidad comienza aquí
        </h1>

        <div className="mb-5" style={{ maxWidth: "540px" }}>
          <p 
            className="welcome-description text-white fs-5 mb-0 fw-light text-center lh-base" 
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)", opacity: 0.92 }}
          >
            Diseña tu protección ideal a tu propio ritmo. Puedes avanzar o regresar en cualquier momento sin perder la información ingresada.
          </p>
        </div>

        <div className="d-flex flex-column align-items-center justify-content-center text-center w-100">
          <Button
            type="button"
            className="welcome-button px-5 py-3 fw-medium shadow-lg btn btn-success btn-lg rounded-pill mb-4"
            onClick={onStart}
            aria-label="Iniciar proceso de cotización de seguros"
            style={{ 
              backgroundColor: "#00875A", 
              borderColor: "#00875A",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              fontSize: "1.05rem",
              letterSpacing: "0.5px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#006E45";
              e.currentTarget.style.borderColor = "#006E45";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 135, 90, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#00875A";
              e.currentTarget.style.borderColor = "#00875A";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            Comenzar cotización 
          </Button>
          
          <p className="welcome-note small text-white-50 m-0 text-center" style={{ opacity: 0.75, letterSpacing: "0.2px" }}>
            Proceso 100% confidencial · Te tomará solo un par de minutos
          </p>
        </div>
      </div>
    </section>
  );
}

const initialData = {
  userKind: "",
  ages: "",
  planType: "",
  budget: "",
  category: "",
  profile: "",
  name: "",
  email: "",
  phone: "",
  consent: false,
  document: "",
  healthDeclaration: false,
  privacyConsent: false,
  otp: "",
  payerName: "",
  paymentMethod: "",
  billingAddress: "",
  rating: 0,
  feedback: "",
};

export default function App() {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState(initialData);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    title: "",
    message: "",
    variant: "success",
  });

  const updateData = (field, value) => setData((previous) => ({ ...previous, [field]: value }));
  const notify = (title, message, variant = "warning") => setToast({ show: true, title, message, variant });

  // Validación campo por campo con Toasts descriptivos específicos
  const validateStep = (step) => {
    if (step === 1) {
      if (!data.userKind) {
        notify("Campo requerido", "Selecciona para quién deseas el seguro.", "warning");
        return false;
      }
      if (!data.ages.trim()) {
        notify("Edades faltantes", "Ingresa las edades de las personas a asegurar.", "warning");
        return false;
      }
      if (!/^\s*\d{1,3}(\s*,\s*\d{1,3})*\s*$/.test(data.ages)) {
        notify("Formato incorrecto", "Escribe las edades separadas por comas (Ej: 35, 32, 8).", "danger");
        return false;
      }
      if (!data.planType) {
        notify("Modalidad faltante", "Selecciona un tipo de plan para continuar.", "warning");
        return false;
      }
    }

    if (step === 2) {
      if (!data.category) {
        notify("Categoría requerida", "Selecciona el área que deseas proteger.", "warning");
        return false;
      }
      if (!data.profile) {
        notify("Estilo requerido", "Indica tu estilo preferido para tomar la decisión.", "warning");
        return false;
      }
    }

    if (step === 3) {
      if (!data.name.trim()) {
        notify("Nombre requerido", "Ingresa tu nombre completo en la sección de descarga.", "warning");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        notify("Correo inválido", "Escribe un correo electrónico válido.", "danger");
        return false;
      }
      if (!data.phone.trim()) {
        notify("Teléfono requerido", "Ingresa un número de teléfono de contacto.", "warning");
        return false;
      }
      if (!data.consent) {
        notify("Autorización requerida", "Debes autorizar el tratamiento de tus datos para continuar.", "warning");
        return false;
      }
    }

    if (step === 4) {
      if (!data.name.trim()) {
        notify("Nombre faltante", "Ingresa el nombre completo del tomador.", "warning");
        return false;
      }
      if (!data.document.trim()) {
        notify("Documento faltante", "Ingresa tu tipo y número de documento de identidad.", "warning");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        notify("Correo inválido", "Verifica el formato de tu correo electrónico.", "danger");
        return false;
      }
      if (!data.phone.trim()) {
        notify("Celular faltante", "Ingresa tu número de celular móvil.", "warning");
        return false;
      }
      if (!data.healthDeclaration) {
        notify("Declaración obligatoria", "Debes confirmar la respuesta de la declaración de salud.", "warning");
        return false;
      }
      if (!data.privacyConsent) {
        notify("Aviso de privacidad", "Debes aceptar el aviso de privacidad y términos.", "warning");
        return false;
      }
      if (!/^\d{6}$/.test(data.otp)) {
        notify("Código OTP inválido", "Ingresa el código de verificación de 6 dígitos (Ej: 123456).", "danger");
        return false;
      }
    }

    if (step === 5) {
      if (!data.payerName.trim()) {
        notify("Titular requerido", "Ingresa el nombre del titular del medio de pago.", "warning");
        return false;
      }
      if (!data.paymentMethod) {
        notify("Método de pago", "Selecciona una pasarela o método de pago.", "warning");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        notify("Correo de factura", "Ingresa un correo electrónico válido para el comprobante.", "danger");
        return false;
      }
      if (!data.billingAddress.trim()) {
        notify("Dirección requerida", "Ingresa tu dirección de correspondencia o facturación.", "warning");
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep === 3 && (data.userKind === "empresa" || data.profile === "corporativo")) {
      notify("Asesoría recomendada", "Por tu selección empresarial, un especialista se pondrá en contacto pronto.", "info");
    }
    if (currentStep < 6) {
      setCurrentStep((step) => step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1);
      notify("Paso anterior", "Tus datos se conservan intactos para que puedas modificarlos.", "info");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const requestQuote = () => {
    if (!data.name.trim()) {
      notify("Nombre requerido", "Ingresa tu nombre para enviar la cotización.", "warning");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      notify("Correo inválido", "Ingresa un correo electrónico válido.", "danger");
      return;
    }
    if (!data.phone.trim()) {
      notify("Teléfono requerido", "Ingresa tu número telefónico.", "warning");
      return;
    }
    if (!data.consent) {
      notify("Consentimiento requerido", "Autoriza el tratamiento de datos para continuar.", "warning");
      return;
    }
    notify("¡Cotización enviada!", "Revisa tu bandeja de entrada en los próximos minutos.", "success");
  };

  const finish = () => {
    notify("¡Proceso completado!", "Gracias por confiar en Aurora Seguros.", "success");
  };

return (
    <div className="app-shell d-flex flex-column min-vh-100">
      
      {/* HEADER AL 100% DE ANCHO */}
      <header className="site-header d-flex justify-content-between align-items-center px-4 py-3 border-bottom bg-white w-100 shadow-sm" role="banner">
        {/* Logotipo de la marca */}
        <button className="brand-lockup border-0 bg-transparent p-0" type="button" onClick={() => setStarted(false)} aria-label="Volver al inicio de Aurora Seguros">
          <img
            src={logoAurora}
            alt="Aurora Seguros"
            className="logo-aurora"
            style={{ maxHeight: "40px" }}
          />
        </button>

        {/* Accesos rápidos superiores (Centro de Información + Asesoría en línea) */}
        <div className="d-flex align-items-center gap-2">
          <OverlayTrigger
            placement="bottom"
            trigger={["hover", "focus"]}
            overlay={
              <Tooltip id="tooltip-glosario">
                Consulta conceptos, preguntas frecuentes y opiniones de otros clientes.
              </Tooltip>
            }
          >
            <button
              type="button"
              className="prototype-label badge bg-light text-dark border p-2"
              style={{ cursor: "pointer", fontSize: "0.875rem" }}
              onClick={() => setShowInfoModal(true)}
              aria-label="Abrir centro de información"
            >
              Glosario & FAQs
            </button>
          </OverlayTrigger>

          <OverlayTrigger
            placement="bottom"
            trigger={["hover", "focus"]}
            overlay={
              <Tooltip id="tooltip-asesoria">
                Chatea o recibe orientación personalizada durante tu cotización.
              </Tooltip>
            }
          >
            <span
              className="prototype-label badge bg-light text-dark border p-2"
              tabIndex={0}
              aria-label="Asesoría en línea"
              style={{ cursor: "pointer", fontSize: "0.875rem" }}
            >
              Asesoría en línea
            </span>
          </OverlayTrigger>
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <main className="flex-grow-1 container py-4">
        {/* CONTENEDOR DE TOASTS FLOTANTES EN VIVO */}
        <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1080 }}>
          <Toast 
            onClose={() => setToast((prev) => ({ ...prev, show: false }))} 
            show={toast.show} 
            delay={4000} 
            autohide
            bg={toast.variant}
          >
            <Toast.Header closeButton>
              <strong className="me-auto">{toast.title}</strong>
            </Toast.Header>
            <Toast.Body className={toast.variant === "light" || toast.variant === "warning" ? "text-dark" : "text-white"}>
              {toast.message}
            </Toast.Body>
          </Toast>
        </ToastContainer>

        {!started ? (
          <WelcomeScreen onStart={() => setStarted(true)} />
        ) : (
          <section className="wizard-wrap" aria-labelledby="page-title">
            <div className="page-heading mb-3">
              <p className="eyebrow text-uppercase small fw-bold mb-1 text-white">COTIZA A TU RITMO</p>
              <h1 id="page-title" className="h3">
                Encuentra <span className="text-green">el seguro perfecto para ti</span>
              </h1>
              <p className="text-white">Avanza paso a paso, compara alternativas y ajusta tus respuestas cuando lo necesites.</p>
            </div>

            <Card className="wizard-card shadow-sm">
              <Card.Body>
                {/* Metadatos de progreso con porcentaje destacado */}
                <div className="progress-meta d-flex justify-content-between align-items-center mb-2" aria-hidden="true">
                  <span className="text-muted fw-semibold">Paso {currentStep} de 6</span>
                  <span className="badge bg-success bg-opacity-10 text-success px-2 py-1 fw-bold fs-6">
                    {Math.round((currentStep / 6) * 100)}% completado
                  </span>
                </div>
                <ProgressBar 
                  now={(currentStep / 6) * 100} 
                  aria-label={`Progreso del formulario: Paso ${currentStep} de 6, ${Math.round((currentStep / 6) * 100)}% completado`} 
                  className="wizard-progress mb-4" 
                />
                <StepIndicator currentStep={currentStep} onStepClick={(step) => setCurrentStep(step)} />

                <div className="step-heading d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <p className="eyebrow text-uppercase text-success medium fw-bold mb-0">PASO {currentStep}</p>
                    <h2 className="h4 mb-0">{STEPS[currentStep - 1].title}: {STEPS[currentStep - 1].subtitle}</h2>
                  </div>
                  <Badge bg="light" text="dark" className="border">
                    {currentStep === 6 ? "Último paso" : `${6 - currentStep} pasos restantes`}
                  </Badge>
                </div>

                <Form onSubmit={(event) => { event.preventDefault(); next(); }} noValidate aria-label={`Formulario del paso ${currentStep}`}>
                  {currentStep === 1 && <StepOne data={data} updateData={updateData} />}
                  {currentStep === 2 && <StepTwo data={data} updateData={updateData} />}
                  {currentStep === 3 && (
                    <StepThree
                      data={data}
                      updateData={updateData}
                      onRequestQuote={requestQuote}
                      onPurchase={() => {
                        if (!validateStep(3)) return;
                        setCurrentStep(4);
                        notify("Continuemos", "Tus respuestas se conservan. Completa los datos requeridos.", "info");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  )}
                  {currentStep === 4 && <StepFour data={data} updateData={updateData} />}
                  {currentStep === 5 && <StepFive data={data} updateData={updateData} />}
                  {currentStep === 6 && <StepSix data={data} updateData={updateData} />}

                  <div className="wizard-actions d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                    <ActionTooltip text="Vuelve al paso anterior sin perder ningún dato ingresado.">
                      <Button 
                        variant="outline-secondary" 
                        onClick={goBack} 
                        disabled={currentStep === 1} 
                        type="button"
                        aria-label="Regresar al paso anterior"
                      >
                        ← Anterior
                      </Button>
                    </ActionTooltip>
                    <div className="action-right">
                      {currentStep < 6 ? (
                        <ActionTooltip text="Valida la información y avanza al siguiente paso.">
                          <Button variant="primary" type="submit" aria-label="Avanzar al siguiente paso">
                            Siguiente →
                          </Button>
                        </ActionTooltip>
                      ) : (
                        <ActionTooltip text="Finaliza y envía tu solicitud de póliza.">
                          <Button variant="success" type="button" onClick={finish} aria-label="Finalizar cotización">
                            Finalizar solicitud ✓
                          </Button>
                        </ActionTooltip>
                      )}
                    </div>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </section>
        )}

        {/* MODAL MULTIPESTAÑA: GLOSARIO, PREGUNTAS FRECUENTES Y TESTIMONIOS */}
        <Modal 
          show={showInfoModal} 
          onHide={() => setShowInfoModal(false)} 
          centered 
          size="lg"
          scrollable
          aria-labelledby="info-modal-title"
        >
          <Modal.Header closeButton className="border-bottom">
            <Modal.Title id="info-modal-title" className="h5 fw-bold" style={{ color: "#00875A" }}>
              Centro de Ayuda Aurora Seguros
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Tabs defaultActiveKey="glosario" id="info-modal-tabs" className="mb-4 custom-green-tabs">
              
              {/* PESTAÑA 1: GLOSARIO */}
              <Tab eventKey="glosario" title="📖 Glosario">
                <p className="text-muted small mb-3">Términos esenciales para comprender tu póliza sin enredos:</p>
                <dl className="row g-3 small">
                  <dt className="col-sm-4 fw-bold" style={{ color: "#00875A" }}>Tomador</dt>
                  <dd className="col-sm-8 mb-2">Persona natural o jurídica que contrata formalmente el seguro y sus condiciones.</dd>

                  <dt className="col-sm-4 fw-bold" style={{ color: "#00875A" }}>Asegurado</dt>
                  <dd className="col-sm-8 mb-2">Persona o personas protegidas directamente bajo los beneficios de la póliza.</dd>

                  <dt className="col-sm-4 fw-bold" style={{ color: "#00875A" }}>Prima</dt>
                  <dd className="col-sm-8 mb-2">Valor económico de la protección que se paga para mantener activa la cobertura.</dd>

                  <dt className="col-sm-4 fw-bold" style={{ color: "#00875A" }}>Código OTP</dt>
                  <dd className="col-sm-8 mb-2">Clave numérica temporal de seguridad enviada para certificar tu identidad.</dd>

                  <dt className="col-sm-4 fw-bold" style={{ color: "#00875A" }}>Declaración de Salud</dt>
                  <dd className="col-sm-8 mb-0">Cuestionario donde se registra el estado médico general de los futuros asegurados.</dd>
                </dl>
              </Tab>

              {/* PESTAÑA 2: PREGUNTAS FRECUENTES (FAQs) */}
              <Tab eventKey="faq" title="❓ Preguntas Frecuentes">
                <div className="accordion accordion-flush" id="faqAccordion">
                  <div className="mb-3">
                    <h6 className="fw-bold" style={{ color: "#00875A" }}>¿Puedo corregir mis datos si ya avancé de paso?</h6>
                    <p className="small text-muted mb-0">
                      Sí, usa el botón "Anterior" o haz clic directamente sobre los pasos anteriores en la barra superior. Tu información se conservará intacta.
                    </p>
                  </div>
                  <hr />
                  <div className="mb-3">
                    <h6 className="fw-bold" style={{ color: "#00875A" }}>¿Mis datos personales se encuentran protegidos?</h6>
                    <p className="small text-muted mb-0">
                      Absolutamente. Cumplimos rigurosamente con normativas de confidencialidad y utilizamos validación de identidad mediante códigos OTP seguros.
                    </p>
                  </div>
                  <hr />
                  <div className="mb-0">
                    <h6 className="fw-bold" style={{ color: "#00875A" }}>¿Se efectuarán cobros reales en esta simulación?</h6>
                    <p className="small text-muted mb-0">
                      No. Este es un entorno de pruebas interactivo diseñado exclusivamente para que evalúes la experiencia de cotización sin cargos reales.
                    </p>
                  </div>
                </div>
              </Tab>

              {/* PESTAÑA 3: TESTIMONIOS */}
              <Tab eventKey="testimonios" title="⭐ Testimonios">
                <p className="text-muted small mb-3">
                  Descubre por qué nuestros clientes confían en la protección de Aurora Seguros:
                </p>
                <Row className="g-3">
                  <Col md={6}>
                    <Card className="h-100 border p-3 rounded-3 shadow-sm" style={{ backgroundColor: "#F4FBF7", borderColor: "#D0EBDD" }}>
                      <Card.Body className="p-0 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fs-5" style={{ color: "#00875A" }}>“</span>
                            <span className="fw-bold" style={{ color: "#00875A" }}>★ ★ ★ ★ ★</span>
                          </div>
                          <p className="small fst-italic text-dark mb-3">
                            "Coticé el seguro para toda mi familia en pocos minutos. El proceso guiado es sumamente claro y transparente."
                          </p>
                        </div>
                        <div className="border-top pt-2" style={{ borderColor: "#D0EBDD" }}>
                          <strong className="d-block small" style={{ color: "#00875A" }}>Carolina R.</strong>
                          <small className="text-muted">Plan Familiar</small>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={6}>
                    <Card className="h-100 border p-3 rounded-3 shadow-sm" style={{ backgroundColor: "#F4FBF7", borderColor: "#D0EBDD" }}>
                      <Card.Body className="p-0 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fs-5" style={{ color: "#00875A" }}>“</span>
                            <span className="fw-bold" style={{ color: "#00875A" }}>★ ★ ★ ★ ★</span>
                          </div>
                          <p className="small fst-italic text-dark mb-3">
                            "La atención digital y la opción de descargar la cotización en PDF facilitó la toma de decisiones en nuestra empresa."
                          </p>
                        </div>
                        <div className="border-top pt-2" style={{ borderColor: "#D0EBDD" }}>
                          <strong className="d-block small" style={{ color: "#00875A" }}>Mateo V.</strong>
                          <small className="text-muted">Seguro Corporativo</small>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>

            </Tabs>
          </Modal.Body>
          <Modal.Footer className="border-top">
            <Button 
              variant="success" 
              size="sm" 
              onClick={() => setShowInfoModal(false)}
              style={{ backgroundColor: "#00875A", borderColor: "#00875A" }}
            >
              Entendido
            </Button>
          </Modal.Footer>
        </Modal>
      </main>

      {/* FOOTER CORPORATIVO CON TEXTO COMPLETAMENTE BLANCO */}
    <footer className="text-white py-4 mt-auto w-100" style={{ backgroundColor: "#001016" }}>
        <div className="container">
          <Row className="gy-3 align-items-center">
            <Col md={4} className="text-center text-md-start">
              <span className="fw-bold text-uppercase tracking-wider text-white" style={{ fontSize: "0.95rem" }}>
                Aurora Seguros S.A.
              </span>
              <p className="small text-white-50 mb-0 mt-1">
                NIT: 900.842.119-5 · Vigilado Superintendencia Financiera de Colombia.
              </p>
            </Col>
            <Col md={4} className="text-center small text-white-50">
              <p className="mb-1">Línea de atención nacional: 01 8000 954321</p>
              <p className="mb-0">Sede Principal: Cra. 7 # 72-41, Bogotá D.C.</p>
            </Col>
            <Col md={4} className="text-center text-md-end small">
              <div className="d-flex justify-content-center justify-content-md-end gap-3 text-white-50">
                <span className="text-white" style={{ cursor: "pointer" }} onClick={() => setShowInfoModal(true)}>Términos y Condiciones</span>
                <span>·</span>
                <span className="text-white" style={{ cursor: "pointer" }} onClick={() => setShowInfoModal(true)}>Política de Privacidad</span>
              </div>
              <p className="text-white-50 mb-0 mt-1" style={{ fontSize: "0.75rem" }}>
                © 2026 Aurora Seguros. Todos los derechos reservados.
              </p>
            </Col>
          </Row>
        </div>
      </footer>
    </div>




  );






  
}