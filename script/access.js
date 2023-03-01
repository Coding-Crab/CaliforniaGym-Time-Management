function getInputValue() {
  // Selecting the input element and get its value 
  let inputVal = document.getElementById("inputId").value;
  var codeEntred = '1919';
  // Displaying the value
  if(inputVal == codeEntred){
      window.location.href = "./build/Beat_I/index.html";
  }else if(inputVal != codeEntred){
      alert("OOps, Wrong Password Try Again");
  }
}
