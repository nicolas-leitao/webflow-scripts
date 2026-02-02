document.addEventListener("DOMContentLoaded", function() {
  // 1. ciblage des parents par l'attribut de langue
  const dateContainers = document.querySelectorAll('[nl-tr-date-lang]');

  const monthMap = {
    'jan': 0, 'january': 0, 'feb': 1, 'february': 1, 'mar': 2, 'march': 2,
    'apr': 3, 'april': 3, 'may': 4, 'jun': 5, 'june': 5, 'jul': 6, 'july': 6,
    'aug': 7, 'august': 7, 'sep': 8, 'september': 8, 'oct': 9, 'october': 9,
    'nov': 10, 'november': 10, 'dec': 11, 'december': 11
  };

  dateContainers.forEach(container => {
    const locale = container.getAttribute('nl-tr-date-lang');

    // 2. Selection par l'attribut data
    const dayNameEl = container.querySelector('[nl-tr-date-data="day"]');
    const monthNameEl = container.querySelector('[nl-tr-date-data="month"]');
    const dayDigitEl = container.querySelector('[nl-tr-date-data="digit"]');
    const yearEl = container.querySelector('[nl-tr-date-data="year"]');

    // Besoin du chiffre + mois + l'annee pour que le calcul soit ok
    if (!monthNameEl || !dayDigitEl || !yearEl) return;

    const rawMonth = monthNameEl.textContent.trim().toLowerCase();
    const dayDigit = parseInt(dayDigitEl.textContent.trim());
    const year = parseInt(yearEl.textContent.trim());
    const monthIndex = monthMap[rawMonth];

    if (monthIndex !== undefined && !isNaN(dayDigit) && !isNaN(year)) {
      const dateObj = new Date(year, monthIndex, dayDigit);
      
      const formatFinal = (str) => {
        const clean = str.replace('.', '');
        return clean.charAt(0).toUpperCase() + clean.slice(1);
      };

      // Traduction du jour (si present dans le HTML)
      if (dayNameEl) {
        const dayFormat = dayNameEl.textContent.trim().length <= 3 ? 'short' : 'long';
        let trDay = new Intl.DateTimeFormat(locale, { weekday: dayFormat }).format(dateObj);
        dayNameEl.textContent = formatFinal(trDay);
      }

      // Traduction du mois
      const monthFormat = monthNameEl.textContent.trim().length <= 3 ? 'short' : 'long';
      let trMonth = new Intl.DateTimeFormat(locale, { month: monthFormat }).format(dateObj);
      monthNameEl.textContent = formatFinal(trMonth);
    }
  });
});