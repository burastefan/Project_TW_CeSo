function snackbar(documentCurrent, message) {
  // Get the snackbar DIV
  const popUp = documentCurrent.getElementById("snackbar");
  
  // Add the "show" class to DIV
  popUp.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    popUp.className = popUp.className.replace("show", "");
  }, 3000);

  popUp.innerHTML = `<div>${message}</div>`;
}
