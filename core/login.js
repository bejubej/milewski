export function initLogin(onSuccess) {


  const PASSWORD = "luna";

  const loginScreen = document.getElementById("loginScreen");
  const desktop = document.getElementById("desktop");
  const biosText = document.getElementById("biosText");
  const input = document.getElementById("loginInput");
  const error = document.getElementById("loginError");

  const bootLines = [
    "PhoenixBIOS 4.0 Release 6.0",
    "Copyright 1985-1998 Phoenix Technologies Ltd.",
    "",
    "Detecting IDE drives ... OK",
    "Checking memory ............ 65536 KB",
    "",
    "Booting from C:",
    "",
    "Enter password to continue"
  ];

  let i = 0;

  function printNextLine() {
    if (i < bootLines.length) {
      biosText.textContent += bootLines[i] + "\n";
      i++;
      setTimeout(printNextLine, 300);
    } else {
      input.focus();
    }
  }

  printNextLine();

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") tryLogin();
  });

  function tryLogin() {
    if (input.value === PASSWORD) {
      biosText.textContent += "\nAccess granted.\n";
      setTimeout(() => {
        loginScreen.remove();
        desktop.hidden = false;
        onSuccess();
      }, 500);
    } else {
      biosText.textContent += "\nAccess denied.\n";
      input.value = "";
    }
  }
}