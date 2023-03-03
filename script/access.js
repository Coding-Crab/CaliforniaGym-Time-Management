function getInputValue() {
  let inputVal = document.getElementById("inputId").value;
  var codeEntered = '1919';
  if (inputVal == codeEntered) {
    window.location.href = "./build/Beat_I/index.html";
    const url = window.location.href;
    history.replaceState(null, null, url);
  }else {
    alert("Oops, Wrong Password. Try Again");
  
} 

}
 // Replace the current history state to prevent going back to the login page
  