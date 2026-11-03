# Flechazo

Experiencia de terror interactiva que simula una app de citas. Es una página estática, sin dependencias ni servidor.

## Estructura

- `index.html`: marcado de las pantallas y carga de estilos y scripts.
- `css/style.css`: todos los estilos.
- `js/`: scripts clásicos que comparten ámbito global y se cargan en este orden:
  - `images.js`: fotos de los perfiles (data URIs).
  - `helpers.js`: utilidades, estado y constantes.
  - `audio.js`: sonido generado con Web Audio.
  - `content.js`: textos, personas y frases.
  - `fx.js`: toasts, notificaciones, alertas y efectos visuales.
  - `deck.js`: tarjetas, swipes y matches.
  - `chat.js`: chat con Mauricio.
  - `finale.js`: final de la experiencia.
  - `main.js`: arranque, configuración inicial y listeners de escape.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube el contenido de esta carpeta a la raíz del repositorio: `index.html`, `css/`, `js/`, `.nojekyll` y `README.md`.
3. En el repositorio ve a **Settings → Pages**.
4. En **Build and deployment** elige **Deploy from a branch**, rama `main` y carpeta `/ (root)`. Guarda.
5. En uno o dos minutos la página estará en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

## Notas

- Funciona mejor en el móvil, con sonido y a pantalla completa.
- Contiene sustos, luces parpadeantes y sonido fuerte.
- Salida de emergencia: tocar 3 veces seguidas el centro del borde superior de la pantalla, o pulsar Esc 3 veces.
- Contiene fotos de personas reales. Publícala solo si tienes permiso de todas ellas, porque en GitHub Pages el repositorio público la hace visible para cualquiera.
