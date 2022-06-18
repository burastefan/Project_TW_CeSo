function snackbar(documentCurrent, message) {
  console.log("am intrat in functia SNACKBAR");
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

//   <!-- Use a button to open the snackbar -->
// <button onclick="myFunction()">Show Snackbar</button>

// <!-- The actual snackbar -->
// <div id="snackbar">Some text some message..</div>

// var x = document.getElementById("snackbar");
