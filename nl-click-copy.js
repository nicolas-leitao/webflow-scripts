document.addEventListener("click", function (e) {
  const trigger = e.target.closest('[nl-click-copy="trigger"]');
  if (!trigger) return;

  const targetId = trigger.getAttribute("nl-click-copy-id");
  const successMsgValue = trigger.getAttribute("nl-click-copy-msg");
  let textToCopy = "";

  // 1. RECUPERATION DU TEXTE
  if (targetId) {
    // Bouton : (meme id no trigger)
    const targetElement = document.querySelector(`[nl-click-copy-id="${targetId}"]:not([nl-click-copy="trigger"])`);
    textToCopy = targetElement ? targetElement.innerText : trigger.innerText;
  } else {
    // Texte bloc : copie le texte de l'element
    textToCopy = trigger.innerText;
  }

  // 2. ACTION DE COPIE ET FEEDBACK
  navigator.clipboard.writeText(textToCopy).then(() => {
    
    if (targetId && successMsgValue) {
      // Feedback Bouton : Remplacement par la valeur de l'attribut nl-click-copy-msg
      const originalHTML = trigger.innerHTML;
      trigger.innerText = successMsgValue;
      setTimeout(() => { trigger.innerHTML = originalHTML; }, 1500);
      
    } else {
      // Feedback Texte : cherche la bulle (div) SIBLING
      const feedbackDiv = trigger.parentElement.querySelector('[nl-click-copy-msg="tooltip"]');
      if (feedbackDiv) {
        feedbackDiv.style.display = "block";
        setTimeout(() => { feedbackDiv.style.display = "none"; }, 1500);
      }
    }
  });
});
