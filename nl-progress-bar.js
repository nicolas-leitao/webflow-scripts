document.addEventListener("DOMContentLoaded", () => {
  
  // --- 1. OUTIL DE CONVERSION (Px, Rem, Vh, Vw) ---
  const toPx = (value) => {
    if (!value) return 0;
    const v = value.toString().trim();
    
    // Si c'est juste un nombre, on considere que c'est des px
    if (!isNaN(v)) return parseFloat(v);

    // VH
    if (v.endsWith('vh')) {
      return (parseFloat(v) * window.innerHeight) / 100;
    }
    // VW
    if (v.endsWith('vw')) {
      return (parseFloat(v) * window.innerWidth) / 100;
    }
    // REM
    if (v.endsWith('rem')) {
      const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      return parseFloat(v) * rootSize;
    }
    // PX
    if (v.endsWith('px')) {
      return parseFloat(v);
    }
    
    return parseFloat(v) || 0;
  };

  // --- 2. GESTION DU RESPONSIVE ---
  const getResponsiveRawValue = (attrValue) => {
    if (!attrValue) return null;
    const values = attrValue.split(',');
    const w = window.innerWidth;

    if (values.length === 1) return values[0]; // all
    if (w > 991) return values[0]; // Desktop
    if (w > 479) return values[1] !== undefined ? values[1] : values[0]; // Tablette
    return values[2] !== undefined ? values[2] : (values[1] !== undefined ? values[1] : values[0]); // Mobile
  };

  // --- 3. COEUR DU SYSTEME ---
  const updateProgress = () => {
    const definedSource = document.querySelector('[nl-progress-bar="is-source"]');
    const sourceEl = definedSource || document.body;

    if (!sourceEl) return;

    const rect = sourceEl.getBoundingClientRect(); 
    const viewportHeight = window.innerHeight;
    const elementHeight = sourceEl.offsetHeight;

    // Sinon le script va essayer d'animer votre container principal !
    const bars = document.querySelectorAll('[nl-progress-bar]:not([nl-progress-bar="is-source"])');

    bars.forEach(bar => {
      // 1. On recupere la valeur brute
      const rawOffsetTop = getResponsiveRawValue(bar.getAttribute('nl-progress-bar-offset-top'));
      const rawOffsetBottom = getResponsiveRawValue(bar.getAttribute('nl-progress-bar-offset-bottom'));

      // 2. On convertit
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
  
  setTimeout(updateProgress, 100); 
});
