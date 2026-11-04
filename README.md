# Blackjack

Juego de blackjack en el navegador. Juega contra la computadora en una mesa de práctica y trata de acercarte a 21 puntos sin pasarte.

## Cómo jugar

Necesitas un navegador y conexión a Internet para cargar Underscore, la biblioteca que baraja las cartas.

```bash
git clone https://github.com/criveradev/blackjack.git
cd blackjack
```

1. Abre `index.html` en el navegador y pulsa **Nuevo juego**. Recibes dos cartas boca arriba. La banca recibe una boca arriba y otra boca abajo.
2. Pulsa **Pedir carta** para sumar una carta a tu mano o **Detener** para plantarte. Si superas 21, pierdes la ronda.
3. Al terminar tu turno, la banca revela su carta y pide hasta alcanzar 17 puntos o más. Gana la mano más cercana a 21 sin pasarse. Si la banca se pasa, ganas la ronda. Si ambas manos válidas tienen el mismo puntaje, empatan.

Las figuras valen 10. El as vale 11 y baja a 1 si hace falta para evitar pasarse de 21. Un as y una carta de valor 10 en el reparto inicial forman un blackjack y resuelven la ronda de inmediato. Si las dos manos tienen blackjack, empatan.

El contador acumula las victorias hasta que recargas la página.

## Estructura

| Ruta | Contenido |
| --- | --- |
| `index.html` | Mesa, marcadores y controles |
| `assets/css/styles.css` | Estilos y diseño adaptable |
| `assets/js/app.js` | Mazo, puntuación y turnos |
| `assets/cartas/` | Imágenes de las cartas y sus dorsos |

## Comprobación local

Con Node.js puedes verificar la sintaxis de JavaScript.

```bash
node --check assets/js/app.js
```

Para probar una ronda, inicia un juego, pide una carta y, si la ronda sigue activa, pulsa **Detener**. Comprueba que se revela la mano de la banca y se muestra el resultado.

### 👨🏻‍💻 Developed by

<p align="center">
  <a href="https://criveradev.com" aria-label="Visitar el portafolio de criveradev">
    <picture>
      <source
        media="(prefers-color-scheme: dark)"
        srcset="https://res.cloudinary.com/docscluster/image/upload/v1782698757/logo-dark_qddsa3.svg">
      <source
        media="(prefers-color-scheme: light)"
        srcset="https://res.cloudinary.com/docscluster/image/upload/v1782698757/logo-light_wilpp4.svg">
      <img
        alt="criveradev"
        src="https://res.cloudinary.com/docscluster/image/upload/v1782698757/logo-light_wilpp4.svg"
        width="200">
    </picture>
  </a>
</p>
