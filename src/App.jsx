import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo, useState } from "react";
import logoAurora from "./assets/logotipo-Aurora-Seguros.svg";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  ProgressBar,
  Row,
  Toast,
  ToastContainer,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

import "./App.css";

const STEPS = [
  { title: "Filtrar", subtitle: "Datos para cotizar" },
  { title: "Explorar", subtitle: "Servicios y categorías" },
  { title: "Elegir", subtitle: "Cotización o compra" },
  { title: "Validar", subtitle: "Datos y declaración de salud" },
  { title: "Pagar", subtitle: "Información de pago" },
  { title: "Confirmar", subtitle: "Compra y experiencia" },
];

const USER_TYPES = [
  {
    id: "impaciente",
    title: "Agil",
    description: "Prefiere pocos pasos, información directa y una acción rápida.",
    recommendation: "Mostrar un resumen corto, permitir descargar la cotización y mantener visible la acción principal.",
  },
  {
    id: "analitico",
    title: "Analítico",
    description: "Compara coberturas, condiciones, precios y beneficios antes de decidir.",
    recommendation: "Destacar coberturas, exclusiones, beneficios, precio y documentos para comparar.",
  },
  {
    id: "corporativo",
    title: "Corporativo o persona jurídica",
    description: "Necesita soluciones para una empresa y posiblemente orientación especializada.",
    recommendation: "Priorizar productos empresariales y la opción de contactar a un asesor.",
  },
];

const CATEGORIES = [
  { id: "vida", title: "Vida", description: "Protección para personas y familias." },
  { id: "salud", title: "Salud", description: "Alternativas relacionadas con bienestar y atención en salud." },
  { id: "accidentes", title: "Accidentes personales", description: "Opciones de protección frente a accidentes." },
  { id: "empresas", title: "Empresas", description: "Soluciones para organizaciones y personas jurídicas." },
];

function ActionTooltip({ text, children }) {
  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>{text}</Tooltip>}
      trigger={["hover", "focus"]}
    >
      <span className="d-inline-flex">{children}</span>
    </OverlayTrigger>
  );
}

function StepIndicator({ currentStep, onStepClick }) {
  return (
    <nav aria-label="Progreso de la cotización" className="stepper mb-4">
      {STEPS.map((step, index) => {
        const number = index + 1;
        const completed = number < currentStep;
        const active = number === currentStep;
        return (
          <button
            type="button"
            key={step.title}
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
        );
      })}
    </nav>
  );
}

function StepOne({ data, updateData }) {
  return (
    <>
      <p className="section-intro">
        Cuéntanos para quién es el seguro y qué necesitas. Usaremos estos datos para filtrar las opciones.
      </p>
      <Row className="g-3">
        <Col md={6}>
          <Form.Group controlId="userKind">
            <Form.Label>¿Para quién buscas el seguro? <span className="required">*</span></Form.Label>
            <Form.Select
              value={data.userKind}
              onChange={(event) => updateData("userKind", event.target.value)}
              required
            >
              <option value="">Selecciona una opción</option>
              <option value="persona">Persona o familia</option>
              <option value="empresa">Empresa / persona jurídica</option>
            </Form.Select>
            <Form.Text>Permite priorizar servicios para personas o empresas.</Form.Text>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="ages">
            <Form.Label>Edades de las personas a asegurar <span className="required">*</span></Form.Label>
            <Form.Control
              value={data.ages}
              onChange={(event) => updateData("ages", event.target.value)}
              placeholder="Ej. 35, 32, 8"
              aria-describedby="agesHelp"
              required
            />
            <Form.Text id="agesHelp">Separa las edades con comas. No ingreses nombres ni documentos en este campo.</Form.Text>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="planType">
            <Form.Label>Tipo de plan <span className="required">*</span></Form.Label>
            <Form.Select
              value={data.planType}
              onChange={(event) => updateData("planType", event.target.value)}
              required
            >
              <option value="">Selecciona un tipo de plan</option>
              <option value="individual">Individual</option>
              <option value="familiar">Familiar</option>
              <option value="colectivo">Colectivo</option>
              <option value="empresarial">Empresarial</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="budget">
            <Form.Label>Presupuesto estimado (opcional)</Form.Label>
            <Form.Select value={data.budget} onChange={(event) => updateData("budget", event.target.value)}>
              <option value="">Prefiero revisar las opciones</option>
              <option value="bajo">Económico</option>
              <option value="medio">Intermedio</option>
              <option value="alto">Amplia cobertura</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
}

function StepTwo({ data, updateData }) {
  const filtered = useMemo(() => {
    if (data.userKind === "empresa") return CATEGORIES.filter((item) => item.id === "empresas");
    return CATEGORIES.filter((item) => item.id !== "empresas");
  }, [data.userKind]);

  return (
    <>
      <p className="section-intro">
        Explora las categorías disponibles y selecciona la que más se acerque a tu necesidad.
      </p>
      <fieldset>
        <legend className="form-label">Categorías de servicio <span className="required">*</span></legend>
        <Row className="g-3">
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
        <legend className="form-label">¿Cómo prefieres tomar la decisión? <span className="required">*</span></legend>
        <Row className="g-3">
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
        <Alert variant="info" className="mt-4 recommendation-alert">
          <strong>Experiencia sugerida:</strong>{" "}
          {USER_TYPES.find((item) => item.id === data.profile)?.recommendation}
        </Alert>
      )}
    </>
  );
}

function StepThree({ data, updateData, onRequestQuote, onPurchase }) {
  const selectedProfile = USER_TYPES.find((item) => item.id === data.profile);
  const corporate = data.userKind === "empresa" || data.profile === "corporativo";
  return (
    <>
      <p className="section-intro">
        Puedes obtener una cotización para revisarla después o continuar con la contratación si ya tomaste una decisión.
      </p>
      {selectedProfile && (
        <Alert variant="light" className="profile-summary">
          <Badge bg="secondary" className="me-2">Perfil</Badge>
          <strong>{selectedProfile.title}.</strong> {selectedProfile.recommendation}
        </Alert>
      )}
      <Row className="g-3">
        <Col md={6}>
          <Card className="choice-card h-100">
            <Card.Body>
              <div className="choice-icon" aria-hidden="true">↧</div>
              <Card.Title>Descargar cotización</Card.Title>
              <Card.Text>Recibe un resumen para revisar las opciones antes de decidir.</Card.Text>
              <Form.Group controlId="quoteName" className="mb-3">
                <Form.Label>Nombre completo <span className="required">*</span></Form.Label>
                <Form.Control value={data.name} onChange={(e) => updateData("name", e.target.value)} autoComplete="name" required />
              </Form.Group>
              <Form.Group controlId="quoteEmail" className="mb-3">
                <Form.Label>Correo electrónico <span className="required">*</span></Form.Label>
                <Form.Control type="email" value={data.email} onChange={(e) => updateData("email", e.target.value)} autoComplete="email" required />
              </Form.Group>
              <Form.Group controlId="quotePhone" className="mb-3">
                <Form.Label>Teléfono <span className="required">*</span></Form.Label>
                <Form.Control type="tel" value={data.phone} onChange={(e) => updateData("phone", e.target.value)} autoComplete="tel" />
              </Form.Group>
              <Form.Check
                id="quoteConsent"
                checked={data.consent}
                onChange={(e) => updateData("consent", e.target.checked)}
                label="Autorizo el tratamiento de mis datos para gestionar esta solicitud."
              />
              <div className="mt-3">
                <ActionTooltip text="Valida tus datos y muestra una confirmación de solicitud de cotización.">
                  <Button variant="primary" onClick={onRequestQuote}>
                    Solicitar cotización
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
              <Card.Title>{corporate ? "Hablar con un asesor" : "Continuar con la compra"}</Card.Title>
              <Card.Text>
                {corporate
                  ? "Por tu perfil, te recomendamos recibir orientación para encontrar la solución empresarial adecuada."
                  : "Continúa al formulario de datos, declaración de salud y validación de identidad."}
              </Card.Text>
              {corporate && (
                <Alert variant="secondary">
                  En un entorno real, esta acción puede abrir un canal de asesoría o solicitar una cita.
                </Alert>
              )}
              <ActionTooltip text="Guarda el avance y continúa al diligenciamiento de datos, declaración de salud y verificación OTP.">
                <Button variant="primary" onClick={onPurchase}>
                  Continuar con la compra →
                </Button>
              </ActionTooltip>
              <p className="small-muted mt-2">La contratación y los pagos de este prototipo son demostrativos.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

function StepFour({ data, updateData }) {
  return (
    <>
      <p className="section-intro">Completa los datos del tomador y revisa la declaración antes de avanzar.</p>
      <Row className="g-3">
        <Col md={6}>
          <Form.Group controlId="fullName">
            <Form.Label>Nombre completo <span className="required">*</span></Form.Label>
            <Form.Control value={data.name} onChange={(e) => updateData("name", e.target.value)} autoComplete="name" required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="document">
            <Form.Label>Tipo y número de documento <span className="required">*</span></Form.Label>
            <Form.Control value={data.document} onChange={(e) => updateData("document", e.target.value)} placeholder="Tipo y número" autoComplete="off" required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="email">
            <Form.Label>Correo electrónico <span className="required">*</span></Form.Label>
            <Form.Control type="email" value={data.email} onChange={(e) => updateData("email", e.target.value)} autoComplete="email" required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="phone">
            <Form.Label>Teléfono móvil <span className="required">*</span></Form.Label>
            <Form.Control type="tel" value={data.phone} onChange={(e) => updateData("phone", e.target.value)} autoComplete="tel" required />
          </Form.Group>
        </Col>
      </Row>
      <hr className="my-4" />
      <Form.Check
        id="healthDeclaration"
        className="mb-3"
        checked={data.healthDeclaration}
        onChange={(e) => updateData("healthDeclaration", e.target.checked)}
        label="Declaro que he leído y respondido de forma veraz la información solicitada en la declaración de salud."
      />
      <Form.Check
        id="privacyConsent"
        className="mb-3"
        checked={data.privacyConsent}
        onChange={(e) => updateData("privacyConsent", e.target.checked)}
        label="He leído el aviso de privacidad y autorizo el tratamiento de mis datos conforme a sus términos."
      />
      <Alert variant="warning">
        <strong>Validación OTP (demo):</strong> ingresa un código de 6 dígitos numéricos para simular la verificación.
      </Alert>
      <Form.Group controlId="otp">
        <Form.Label>Código de verificación OTP <span className="required">*</span></Form.Label>
        <Form.Control
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={data.otp}
          onChange={(e) => updateData("otp", e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="Ingresa el código de 6 dígitos"
          aria-describedby="otpHelp"
        />
        <Form.Text id="otpHelp">Ejemplo demo: escribe 123456.</Form.Text>
      </Form.Group>
    </>
  );
}

function StepFive({ data, updateData }) {
  return (
    <>
      <p className="section-intro">Ingresa los datos necesarios para preparar el pago. En esta demo no se procesan transacciones reales.</p>
      <Alert variant="info">
        Por seguridad, en producción utiliza los campos alojados o tokenizados de la pasarela.
      </Alert>
      <Row className="g-3">
        <Col md={6}>
          <Form.Group controlId="payerName">
            <Form.Label>Nombre del titular <span className="required">*</span></Form.Label>
            <Form.Control value={data.payerName} onChange={(e) => updateData("payerName", e.target.value)} autoComplete="cc-name" required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="paymentMethod">
            <Form.Label>Medio de pago <span className="required">*</span></Form.Label>
            <Form.Select value={data.paymentMethod} onChange={(e) => updateData("paymentMethod", e.target.value)} required>
              <option value="">Selecciona una opción</option>
              <option value="payu">PayU</option>
              <option value="paypal">PayPal</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="billingEmail">
            <Form.Label>Correo para el comprobante <span className="required">*</span></Form.Label>
            <Form.Control type="email" value={data.email} onChange={(e) => updateData("email", e.target.value)} autoComplete="email" required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="billingAddress">
            <Form.Label>Dirección de facturación <span className="required">*</span></Form.Label>
            <Form.Control value={data.billingAddress} onChange={(e) => updateData("billingAddress", e.target.value)} autoComplete="street-address" required />
          </Form.Group>
        </Col>
      </Row>
    </>
  );
}

function StepSix({ data, updateData }) {
  return (
    <>
      <div className="success-mark text-center mb-3" aria-hidden="true" style={{ fontSize: "2rem", color: "green" }}>✓</div>
      <h2 className="h4 text-center">Revisión final de tu solicitud</h2>
      <p className="section-intro text-center">Confirma el resumen de tu cotización.</p>
      <Card className="summary-card mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col sm={6}><span className="summary-label d-block text-muted">Tipo de cliente</span><strong>{data.userKind === "empresa" ? "Empresa / persona jurídica" : "Persona o familia"}</strong></Col>
            <Col sm={6}><span className="summary-label d-block text-muted">Categoría</span><strong>{CATEGORIES.find((item) => item.id === data.category)?.title || "Sin seleccionar"}</strong></Col>
            <Col sm={6}><span className="summary-label d-block text-muted">Plan</span><strong>{data.planType || "Sin seleccionar"}</strong></Col>
            <Col sm={6}><span className="summary-label d-block text-muted">Pasarela elegida</span><strong>{data.paymentMethod ? data.paymentMethod.toUpperCase() : "Sin seleccionar"}</strong></Col>
            <Col sm={12}><span className="summary-label d-block text-muted">Correo de contacto</span><strong>{data.email || "Sin registrar"}</strong></Col>
          </Row>
        </Card.Body>
      </Card>
      <fieldset>
        <legend className="form-label">¿Cómo calificarías esta experiencia?</legend>
        <div className="rating-options d-flex gap-2 mb-2" role="group" aria-label="Califica la experiencia de 1 a 5">
          {[1, 2, 3, 4, 5].map((score) => (
            <Button
              key={score}
              variant={data.rating === score ? "primary" : "outline-secondary"}
              aria-pressed={data.rating === score}
              onClick={() => updateData("rating", score)}
            >
              {score}
            </Button>
          ))}
        </div>
        <Form.Text>1 = Muy difícil · 5 = Muy fácil</Form.Text>
      </fieldset>
      <Form.Group controlId="feedback" className="mt-3">
        <Form.Label>Comentario opcional</Form.Label>
        <Form.Control as="textarea" rows={3} value={data.feedback} onChange={(e) => updateData("feedback", e.target.value)} placeholder="¿Qué podríamos mejorar?" />
      </Form.Group>
    </>
  );
}
function WelcomeScreen({ onStart }) {
  return (
    <section 
      className="welcome-screen  min-vh-100 " 
      aria-labelledby="welcome-title"
    >
      <div 
        className="welcome-content d-flex flex-column align-items-center justify-content-center py-5 px-3 w-100 mx-auto text-center" 
        style={{ maxWidth: "750px" }}
      >
        {/* Subtítulo superior centrado */}
        <div className="w-100 text-center mb-2">
          <span className="welcome-eyebrow text-uppercase fw-bold tracking-wider ">
            AURORA SEGUROS
          </span>
        </div>

        {/* Título Principal centrado */}
        <div className="w-100 text-center mb-4">
          <h1 id="welcome-title" className="display-4 fw-bold text-white text-center m-0">
            Tu tranquilidad comienza aquí
          </h1>
        </div>

        {/* Recuadro de instrucción centrado con ancho controlado */}
        <div className="w-100 d-flex justify-content-center mb-4">
          <div 
            className="instruction-box p-3 p-md-4 rounded-4 shadow-lg border text-center"
            style={{ 
              backgroundColor: "rgba(15, 23, 42, 0.75)", 
              borderColor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(8px)",
              maxWidth: "600px",
              width: "100%"
            }}
          >
            <p className="welcome-description text-white fs-5 mb-0 fw-medium text-center">
          <strong className="text-warning">Instrucción:</strong> Explora tus opciones y cotiza a tu ritmo. Puedes avanzar o regresar en cualquier momento sin perder los datos ingresados.
            </p>
          </div>
        </div>

        {/* Botón y nota al pie perfectamente centrados */}
        <div className="w-100 d-flex flex-column align-items-center justify-content-center text-center">
     <Button
            type="button"
            className="welcome-button px-5 py-3 fw-bold shadow mb-3 btn btn-success btn-lg"
            onClick={onStart}
            style={{ 
              backgroundColor: "rgb(0, 135, 90)", 
              borderColor: "rgb(0, 135, 90)",
              transition: "all 0.2s ease-in-out" 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgb(0, 110, 73)"; // Un verde un poco más oscuro para el hover
              e.currentTarget.style.borderColor = "rgb(0, 110, 73)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgb(0, 135, 90)"; // Vuelve al color original al salir el mouse
              e.currentTarget.style.borderColor = "rgb(0, 135, 90)";
            }}
          >
            Iniciar cotización 
          </Button>
          
          <p className="welcome-note small m-0 text-center">
          Proceso 100% confidencial. Te tomará solo unos minutos.
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
  const [toast, setToast] = useState({
    show: false,
    title: "",
    message: "",
    variant: "success",
  });

  const updateData = (field, value) => setData((previous) => ({ ...previous, [field]: value }));
  const notify = (title, message, variant = "success") => setToast({ show: true, title, message, variant });

  const validateStep = (step) => {
    if (step === 1) {
      if (!data.userKind || !data.ages.trim() || !data.planType) {
        notify("Completa los datos", "Selecciona para quién es el seguro, ingresa las edades y elige un tipo de plan.", "warning");
        return false;
      }
      if (!/^\s*\d{1,3}(\s*,\s*\d{1,3})*\s*$/.test(data.ages)) {
        notify("Revisa las edades", "Escribe las edades como números separados por comas. Ejemplo: 35, 32, 8.", "warning");
        return false;
      }
    }
    if (step === 2 && (!data.category || !data.profile)) {
      notify("Selecciona tus preferencias", "Elige una categoría de servicio y el perfil que mejor describe tu forma de decidir.", "warning");
      return false;
    }

    if (step === 4) {
      if (!data.name.trim() || !data.document.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || !data.phone.trim()) {
        notify("Revisa tus datos", "Completa nombre, documento, correo válido y teléfono.", "warning");
        return false;
      }
      if (!data.healthDeclaration || !data.privacyConsent || !/^\d{6}$/.test(data.otp)) {
        notify("Validación pendiente", "Acepta la declaración y el aviso de privacidad, e ingresa un OTP de 6 dígitos.", "warning");
        return false;
      }
    }
    if (step === 5 && (!data.payerName.trim() || !data.paymentMethod || !data.email.trim() || !data.billingAddress.trim())) {
      notify("Completa los datos de pago", "Indica el titular, la pasarela, el correo y la dirección de facturación.", "warning");
      return false;
    }
    return true;
  };

  const next = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep === 3 && (data.userKind === "empresa" || data.profile === "corporativo")) {
      notify("Te recomendamos asesoría", "Por el tipo de cliente seleccionado, considera conectar esta acción con el canal comercial de Aurora Seguros.", "info");
    }
    if (currentStep < 6) {
      setCurrentStep((step) => step + 1);
      notify(`Paso ${currentStep + 1}`, STEPS[currentStep]?.subtitle || "Continúa con el proceso.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1);
      notify("Volviste al paso anterior", "Tus datos se conservan para que puedas modificarlos.", "info");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const requestQuote = () => {
    if (!data.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || !data.consent) {
      notify("No se pudo solicitar", "Completa nombre, correo válido y autorización de tratamiento de datos.", "warning");
      return;
    }
    notify("Solicitud preparada", "Confirmación enviada con éxito.");
  };

  const finish = () => {
    notify("Proceso finalizado", "Gracias por completarlo.");
  };

  return (
    <main className="app-shell ">
      <header className="site-header d-flex justify-content-between align-items-center mb-4">
        <button className="brand-lockup border-0 bg-transparent" type="button" onClick={() => setStarted(false)}>
          <img
            src={logoAurora}
            alt="Aurora Seguros"
            className="logo-aurora"
            style={{ maxHeight: "40px" }}
          />
        </button>
        <OverlayTrigger
          placement="bottom"
          trigger={["hover", "focus"]}
          overlay={
            <Tooltip id="tooltip-asesoria">
              Recibe ayuda y orientación durante tu proceso de cotización.
            </Tooltip>
          }
        >
          <span
            className="prototype-label badge bg-light text-dark border p-2"
            tabIndex={0}
            aria-label="Asesoría en línea"
            style={{ cursor: "pointer" }}
          >
            Asesoría en línea
          </span>
        </OverlayTrigger>
      </header>

      {!started ? (
        <WelcomeScreen onStart={() => setStarted(true)} />
      ) : (
        <section className="wizard-wrap" aria-labelledby="page-title">
          <div className="page-heading mb-3">
            <p className="eyebrow text-uppercase  small fw-bold mb-1 text-white">COTIZA A TU RITMO</p>
            <h1 id="page-title" className="h3">Encuentra el seguro adecuado para ti</h1>
            <p className=" text-white">Avanza paso a paso, compara tus opciones y vuelve atrás cuando necesites ajustar tus respuestas.</p>
          </div>

          <Card className="wizard-card shadow-sm">
            <Card.Body>
              <div className="progress-meta d-flex justify-content-between mb-1 small text-muted">
                <span>Paso {currentStep} de 6</span>
                <strong>{Math.round((currentStep / 6) * 100)}% completado</strong>
              </div>
              <ProgressBar now={(currentStep / 6) * 100} aria-label={`Progreso: ${currentStep} de 6 pasos`} className="wizard-progress mb-4" />
              <StepIndicator currentStep={currentStep} onStepClick={(step) => setCurrentStep(step)} />

              <div className="step-heading d-flex justify-content-between align-items-center mb-3">
                <div>
                  <p className="eyebrow text-uppercase text-primary small fw-bold mb-0">PASO {currentStep}</p>
                  <h2 className="h4 mb-0">{STEPS[currentStep - 1].title}: {STEPS[currentStep - 1].subtitle}</h2>
                </div>
                <Badge bg="light" text="dark" className="border">
                  {currentStep === 6 ? "Último paso" : `${6 - currentStep} pasos restantes`}
                </Badge>
              </div>

              <Form onSubmit={(event) => { event.preventDefault(); next(); }} noValidate>
                {currentStep === 1 && <StepOne data={data} updateData={updateData} />}
                {currentStep === 2 && <StepTwo data={data} updateData={updateData} />}
                {currentStep === 3 && (
                  <StepThree
                    data={data}
                    updateData={updateData}
                    onRequestQuote={requestQuote}
                    onPurchase={() => {
                      setCurrentStep(4);
                      notify("Continuemos con la compra", "Tus respuestas se conservan. Completa los datos requeridos.");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                )}
                {currentStep === 4 && <StepFour data={data} updateData={updateData} />}
                {currentStep === 5 && <StepFive data={data} updateData={updateData} />}
                {currentStep === 6 && <StepSix data={data} updateData={updateData} />}

                <div className="wizard-actions d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                  <ActionTooltip text="Regresa al paso anterior sin perder la información que ya ingresaste.">
                    <Button variant="outline-secondary" onClick={goBack} disabled={currentStep === 1} type="button">
                      ← Anterior
                    </Button>
                  </ActionTooltip>
                  <div className="action-right">
                    {currentStep < 6 ? (
                      <ActionTooltip text="Valida la información requerida y avanza al siguiente paso.">
                        <Button variant="primary" type="submit">
                          {currentStep === 5 ? "Revisar y confirmar" : "Continuar"} →
                        </Button>
                      </ActionTooltip>
                    ) : (
                      <ActionTooltip text="Confirma el cierre de la demo y la respuesta de la encuesta.">
                        <Button variant="primary" type="button" onClick={finish}>
                          Enviar evaluación
                        </Button>
                      </ActionTooltip>
                    )}
                  </div>
                </div>
              </Form>
              <p className="privacy-note small text-muted text-center mt-3 mb-0">
                <span aria-hidden="true">🔒</span> Prototipo de experiencia. No introduzcas datos personales reales.
              </p>
            </Card.Body>
          </Card>
        </section>
      )}

      <ToastContainer position="bottom-end" className="p-3 toast-layer" aria-live="polite" aria-atomic="true">
        <Toast
          show={toast.show}
          onClose={() => setToast((previous) => ({ ...previous, show: false }))}
          delay={5000}
          autohide
          bg={toast.variant === "success" ? "success" : toast.variant === "warning" ? "warning" : toast.variant === "info" ? "info" : "secondary"}
        >
          <Toast.Header>
            <strong className="me-auto">{toast.title}</strong>
            <small>Ahora</small>
          </Toast.Header>
          <Toast.Body className={["warning", "info"].includes(toast.variant) ? "text-dark" : "text-white"}>
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <footer className="site-footer text-center mt-4 text-muted small">
        <span>© Aurora Seguros </span>
      </footer>
    </main>
  );
}