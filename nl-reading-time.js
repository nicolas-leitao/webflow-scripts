document.addEventListener("DOMContentLoaded", function() {
  // 1. Selection des elements
  const sourceElement = document.querySelector('[nl-reading-time="source"]');
  const targetElement = document.querySelector('[nl-reading-time="display"]');

  // Securite : Si les elements ne sont pas trouver, fais rien
  if (!sourceElement || !targetElement) return;

  // 2. Recuperation des options depuis la target d'affichage
  const wpm = parseInt(targetElement.getAttribute('nl-reading-time-wpm')) || 200;
  const labelSingular = targetElement.getAttribute('nl-reading-time-singular') || "minute";
  const labelPlural = targetElement.getAttribute('nl-reading-time-plural') || "minutes";

  // 3. Calcul nombre de mots
  const text = sourceElement.innerText || sourceElement.textContent;
  const wordCount = text.trim().split(/\s+/).length;

  // 4. Calcul temps (arrondi au sup)
  const readingTime = Math.ceil(wordCount / wpm);

  // 5. Logique Singulier / Pluriel
  let labelToUse = labelPlural;
  
  if (readingTime <= 1) {
      labelToUse = labelSingular;
  }

  // 6. Injection text final
  targetElement.innerText = `${readingTime} ${labelToUse}`;
});
