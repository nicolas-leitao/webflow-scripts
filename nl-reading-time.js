document.addEventListener("DOMContentLoaded", function() {
  // 1. Sélection des éléments avec vos nouveaux attributs
  const sourceElement = document.querySelector('[nl-reading-time="source"]');
  const targetElement = document.querySelector('[nl-reading-time="display"]');

  // Sécurité : Si les éléments ne sont pas trouvés, on ne fait rien
  if (!sourceElement || !targetElement) return;

  // 2. Récupération des options depuis l'élément d'affichage (target)
  const wpm = parseInt(targetElement.getAttribute('nl-reading-time-wpm')) || 200;
  const labelSingular = targetElement.getAttribute('nl-reading-time-singular') || "minute";
  const labelPlural = targetElement.getAttribute('nl-reading-time-plural') || "minutes";

  // 3. Calcul du nombre de mots
  const text = sourceElement.innerText || sourceElement.textContent;
  const wordCount = text.trim().split(/\s+/).length;

  // 4. Calcul du temps (arrondi à l'entier supérieur)
  const readingTime = Math.ceil(wordCount / wpm);

  // 5. Logique Singulier / Pluriel
  let labelToUse = labelPlural;
  
  if (readingTime <= 1) {
      labelToUse = labelSingular;
  }

  // 6. Injection du texte final
  targetElement.innerText = `${readingTime} ${labelToUse}`;
});