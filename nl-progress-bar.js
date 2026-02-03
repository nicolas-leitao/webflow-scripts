document.addEventListener("DOMContentLoaded", () => {
  
  // --- 1. OUTIL DE CONVERSION (Px, Rem, Vh, Vw) ---
  const toPx = (value) => {
    if (!value) return 0;
    const v = value.toString().trim();
    if (!isNaN(v)) return parseFloat(v);
    if (v.endsWith('vh')) return (parseFloat(v) * window.innerHeight) / 100;
    if (v.endsWith('vw')) return (parseFloat(v) * window.innerWidth) / 100;
    if (v.endsWith('rem')) {
      const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      return parseFloat(v) * rootSize;
    }
    if (v.endsWith('px')) return parseFloat(v);
    return parseFloat(v) || 0;
  };

  // --- 2. GESTION DU RESPONSIVE ---
  const getResponsiveRawValue = (attrValue) => {
    if (!attrValue) return null;
    const values = attrValue.split(',');
    const w = window.innerWidth;
    if (values.length === 1) return values[0]; 
    if (w > 991) return values[0]; 
    if (w > 479) return values[1] !== undefined ? values[1] : values[0]; 
    return values[2] !== undefined ? values[2] : (values[1] !== undefined ? values[1] : values[0]); 
  };

  // --- 3. COEUR DU SYSTEME ---
  const updateProgress = () => {
    // A. Trouver la source
    const definedSource = document.querySelector('[nl-progress-bar-src="is-source"]');
    const sourceEl = definedSource || document.body;

    if (!sourceEl) return;

    const rect = sourceEl.getBoundingClientRect(); 
    const viewportHeight = window.innerHeight;
    const elementHeight = sourceEl.offsetHeight;

    // B. Boucle sur les barres
    const bars = document.querySelectorAll('[nl-progress-bar]');

    bars.forEach(bar => {
      // 1. Offsets
      const rawOffsetTop = getResponsiveRawValue(bar.getAttribute('nl-progress-bar-offset-top'));
      const rawOffsetBottom = getResponsiveRawValue(bar.getAttribute('nl-progress-bar-offset-bottom'));

      const offsetTop = toPx(rawOffsetTop);
      const offsetBottom = toPx(rawOffsetBottom);

      // --- CORRECTION MATHÉMATIQUE ---
      
      // Distance parcourue, nombre de pixels du haut de l'article qui ont passé la ligne "Offset Top"
      // rect.top diminue quand on scrolle. Si rect.top = offsetTop, alors traveled = 0.
      const traveled = offsetTop - rect.top;

      // Distance Totale à parcourir : 
      // hauteur de l'article - hauteur de la fenêtre + ajustement
      const totalToTravel = elementHeight - viewportHeight + offsetTop + offsetBottom;

      // Calcul du pourcentage
      let percentage = (traveled / totalToTravel) * 100;
      percentage = Math.max(0, Math.min(100, percentage));

      // 4. Rendu Visuel
      const type = bar.getAttribute('nl-progress-bar');

      if (type === 'horizontal') {
        bar.style.width = `${percentage}%`;
      }
      else if (type === 'vertical') {
        bar.style.height = `${percentage}%`;
      } 
      else if (type === 'circle') {
        const circles = bar.querySelectorAll('circle');
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

  window.addEventListener('scroll', updateProgress);
  window.addEventListener('resize', updateProgress);
  setTimeout(updateProgress, 100); 
});
