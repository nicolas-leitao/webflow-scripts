# 🛠 Webflow Scripts Library
Une collection de scripts personnalisés par Nicolas Leitao pour booster vos projets Webflow.

## 📚 Sommaire
1. [Barre de Progression](#barre-de-progression-pour-webflow)
2. [Script de traduction](#2-script-de-traduction)


## Barre de Progression pour webflow
*Un script léger 100% JS pour ajouter des barres de progression (horizontales ou circulaires) avec gestion des offset responsive par breakpoints (px, rem, vh, vw).*

- [Live demo](https://nicolas-leitao-live-demo.webflow.io/blog/article-de-test)
- [Full tutorial](https://TON-LIEN-DEMO)

### Avantages

- 🚀 0% de dépendance (Pas de GSAP, juste du Vanilla JS).
- 🎨 Design 100% Webflow (Vous gérez les couleurs et tailles dans le Designer).
- 📱 Responsive (Offsets réglables pour Mobile, Tablette et Desktop).
- ⚙️ Modulable : Fonctionne pour une barre horizontale classique ET/OU un cercle autour de votre menu burger.
- ✨ Configuration par custom attributes.

### Installation

Ajoutez ce script dans les paramètres de votre page ou projet (**Before </body> tag**) :

```html
<!--{ NL-Progress-Bar }-->
<script src="https://cdn.jsdelivr.net/gh/nicolas-leitao/webflow-scripts/nl-progress-bar.js" defer></script>
```

### Custom attributes list

- nl-progress-bar="is-source" | div à tracker, pas de source = body.
- nl-progress-bar=”horizontal” | pour la barre horizontale.
- nl-progress-bar="circle" | pour la barre circle.

#### Offsets logique : 
- nl-progress-bar-offset-top="desktop, tablet, mobile"
- nl-progress-bar-offset-bottom="desktop,tablet, mobile"

nl-progress-bar-offset-bottom="100px, 2rem, 56px"


### Progress bar horizontale
Il suffit d'appliquer le custom attribut | nl-progress-bar=”horizontal” | sur votre div et la régler à 0% widht.

### Progress bar circle 


Code embed : 
```html
<svg viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet" 
     style="width: 100%; height: 100%; pointer-events: none;">
     
    <circle r="28" cx="30" cy="30" 
            fill="transparent" 
            stroke="#FF0000" 
            opacity="0"
            stroke-width="2">
    </circle>
    
    <circle class="progress-circle" r="28" cx="30" cy="30" 
            fill="transparent" 
            stroke="currentcolor"
            stroke-width="2"
            stroke-dasharray="176 176"
            stroke-dashoffset="176">
    </circle>
</svg>

<style>
.progress-circle {
    transform-origin: center;
    transform: rotate(-90deg);
    transition: stroke-dashoffset 0.1s linear;
}
</style>
```
