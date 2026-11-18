const USERS_KEY = "classiq_users";
const SESSION_KEY = "classiq_session";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function showError(input, message) {
  input.classList.add("is-invalid");
  input.nextElementSibling.textContent = message;
}

function clearErrors(form) {
  form.querySelectorAll(".is-invalid").forEach(function (input) {
    input.classList.remove("is-invalid");
  });
}

document.querySelectorAll(".auth-form .form-control").forEach(function (input) {
  input.addEventListener("input", function () {
    input.classList.remove("is-invalid");
  });
});

function showPopup(title, message, buttonText, nextPage, isWarning) {
  const icon = document.getElementById("popupIcon");
  icon.classList.toggle("warning", Boolean(isWarning));
  icon.innerHTML = isWarning
    ? '<i class="bi bi-person-exclamation"></i>'
    : '<i class="bi bi-check-lg"></i>';

  document.getElementById("popupTitle").textContent = title;
  document.getElementById("popupMessage").textContent = message;
  document.getElementById("popupCancel").hidden = !isWarning;

  const button = document.getElementById("popupButton");
  button.textContent = buttonText;
  button.onclick = function () {
    window.location.href = nextPage;
  };

  bootstrap.Modal.getOrCreateInstance(document.getElementById("popup")).show();
}

const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors(signupForm);

    const email = document.getElementById("signupEmail");
    const username = document.getElementById("signupUsername");
    const password = document.getElementById("signupPassword");
    let isValid = true;

    if (!EMAIL_PATTERN.test(email.value.trim())) {
      showError(email, "Please enter a valid email address.");
      isValid = false;
    } else if (getUsers().some(function (u) { return u.email === email.value.trim().toLowerCase(); })) {
      showError(email, "An account with this email already exists.");
      isValid = false;
    }

    if (username.value.trim().length < 3) {
      showError(username, "Username must be at least 3 characters.");
      isValid = false;
    }

    if (password.value.length < 6) {
      showError(password, "Password must be at least 6 characters.");
      isValid = false;
    }

    if (!isValid) return;

    const users = getUsers();
    users.push({
      email: email.value.trim().toLowerCase(),
      username: username.value.trim(),
      password: password.value,
    });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    showPopup(
      "Account Created!",
      "Welcome to ClassIQ, " + username.value.trim() + ". Please log in to continue.",
      "Go to Login",
      "login.html"
    );
  });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors(loginForm);

    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");

    if (!EMAIL_PATTERN.test(email.value.trim())) {
      showError(email, "Please enter a valid email address.");
      return;
    }

    if (password.value === "") {
      showError(password, "Please enter your password.");
      return;
    }

    const user = getUsers().find(function (u) {
      return u.email === email.value.trim().toLowerCase();
    });

    if (!user) {
      showPopup(
        "Account Not Found",
        "No account exists for this email. Please sign up first to continue.",
        "Go to SignUp",
        "signup.html",
        true
      );
      return;
    }

    if (user.password !== password.value) {
      showError(password, "Incorrect password. Please try again.");
      return;
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify({ username: user.username, email: user.email }));
    window.location.href = "courses.html";
  });
}
