const session = JSON.parse(localStorage.getItem("classiq_session"));

if (session) {
  document.getElementById("userNameNav").textContent = session.username;
  document.getElementById("userInitial").textContent = session.username.charAt(0).toUpperCase();

  document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("classiq_session");
    document.documentElement.classList.remove("logged-in");
  });
}
