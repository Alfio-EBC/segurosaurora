#  Aurora Seguros - Cotizador UX/UI Interactivo

Prototipo de aplicación web desarrollado en **React** y **Vite**, diseñado bajo los principios heurísticos de usabilidad de Jakob Nielsen. Su objetivo principal es optimizar la experiencia de usuario en el embudo de conversión inicial de una aseguradora, reduciendo la fricción, el abandono y mejorando la claridad en el proceso de contratación.

---

##  Características Principales

* **Pantalla de Bienvenida Minimalista:** Interfaz de inicio inmersiva con centrado dinámico, instrucciones claras y alta accesibilidad visual.
* **Navegación "Linear-Flexible":** Permite al usuario avanzar, retroceder y modificar sus respuestas en cualquier momento sin perder la información previamente ingresada.
* **Indicador de Progreso en Vivo:** Barra de avance porcentual y un *stepper* interactivo de 6 pasos claros:
  1. *Filtrar* (Datos iniciales y tipo de plan).
  2. *Explorar* (Categorías y perfiles de decisión).
  3. *Elegir* (Descarga de cotización o continuidad de compra).
  4. *Validar* (Datos del tomador, declaración de salud y autenticación OTP).
  5. *Pagar* (Simulación de pasarela de pago segura).
  6. *Confirmar* (Resumen final y modal interactiva de evaluación de experiencia).
* **Diseño Responsivo y Accesible:** Estilizado con **React-Bootstrap** y componentes personalizados adaptados para dispositivos móviles y de escritorio.

---

##  Tecnologías Utilizadas

* **React** (v18+) - Biblioteca principal para la construcción de la interfaz.
* **Vite** - Herramienta de empaquetado rápido y entorno de desarrollo.
* **React-Bootstrap & Bootstrap** - Sistema de componentes UI y rejilla responsiva.
* **Oxlint** - Reglas de análisis de código para mantener buenas prácticas.

---

##  Guía de Instalación y Ejecución Local

Sigue estos pasos para clonar y ejecutar el proyecto en tu máquina local:

1. **Clonar el repositorio:**
   ```bash
   git clone <url-de-tu-repositorio>
   cd <nombre-del-proyecto>