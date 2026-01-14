document.addEventListener("DOMContentLoaded", () => {
  
  // --- 1. OUTIL DE CONVERSION (Px, Rem, Vh, Vw) ---
  const toPx = (value) => {
    if (!value) return 0;
    const v = value.toString().trim();
    
    // Si c'est juste un nombre, on considere que c'est des px
    if (!isNaN(v)) return parseFloat(v);

    // Si c'est en VH
    if (v.endsWith('vh')) {
      return (parseFloat(v) * window.innerHeight) / 100;
    }
    // Si c'est en VW
    if (v.endsWith('vw')) {
      return (parseFloat(v) * window.innerWidth) / 100;
    }
    // Si c'est en REM
    if (v.endsWith('rem')) {
      const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      return parseFloat(v) * rootSize;
    }
    // Si c'est en en PX
    if (v.endsWith('px')) {
      return parseFloat(v);
    }
    
    return parseFloat(v) || 0;
  };

  // --- 2. GESTION DU RESPONSIVE ---
  // Cette fonction recupere la chaine brute (ex: "10rem") selon l'ecran
  const getResponsiveRawValue = (attrValue) => {
    if (!attrValue) return null;
    // On separe par virgule
    const values = attrValue.split(',');
    const w = window.innerWidth;

    // Logique Breakpoints
    if (values.length === 1) return values[0]; // Partout pareil
    if (w > 991) return values[0]; // Desktop
    if (w > 479) return values[1] !== undefined ? values[1] : values[0]; // Tablette
    return values[2] !== undefined ? values[2] : (values[1] !== undefined ? values[1] : values[0]); // Mobile
  };

  // --- 3. COEUR DU SYSTEME ---
  const updateProgress = () => {
    // A. Trouver la source (div specifique ou body)
    const definedSource = document.querySelector('[nl-progress-bar-source="is-source"]');
    const sourceEl = definedSource || document.body;

    if (!sourceEl) return;

    const rect = sourceEl.getBoundingClientRect(); 
    const viewportHeight = window.innerHeight;
    const elementHeight = sourceEl.offsetHeight;

    // B. Boucle sur les barres
    const bars = document.querySelectorAll('[nl-progress-bar]');

    bars.forEach(bar => {
      // 1. On recupere la valeur brute (ex: "10vh")
      const rawOffsetTop = getResponsiveRawValue(bar.getAttribute('nl-progress-offset-top'));
      const rawOffsetBottom = getResponsiveRawValue(bar.getAttribute('nl-progress-offset-bottom'));

      // 2. On convertit tout en pixels pour le calcul
      const offsetTop = toPx(rawOffsetTop);
      const offsetBottom = toPx(rawOffsetBottom);

      // 3. Calculs
      const effectiveHeight = elementHeight - offsetTop - offsetBottom;
      const distanceFromTop = viewportHeight - (rect.top + offsetTop);
      
      let percentage = (distanceFromTop / (effectiveHeight + viewportHeight)) * 100;
      percentage = Math.max(0, Math.min(100, percentage));

      // 4. Rendu Visuel
      const type = bar.getAttribute('nl-progress-bar');

      if (type === 'horizontal') {
        bar.style.width = `${percentage}%`;
      } 
      else if (type === 'circle') {
        const circles = bar.querySelectorAll('circle');
        // On prend le dernier cercle trouve dans le SVG (celui du dessus)
        const progressCircle = circles[circles.length - 1]; 

        if (progressCircle) {
          const radius = progressCircle.r.baseVal.value;
          const circumference = 2 * Math.PI * radius;

          progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
          const offset = circumference - (percentage / 100) * circumference;
          progressCircle.style.strokeDashoffset = offset;
        }
      }
    });
  };

  // --- 4. DECLENCHEURS ---
  window.addEventListener('scroll', updateProgress);
  window.addEventListener('resize', updateProgress);
  
  // delai au chargement pour etre sur que le CSS est charger
  setTimeout(updateProgress, 100); 
});