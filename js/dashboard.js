const SESSION_KEY = "classiq_session";
const session = JSON.parse(localStorage.getItem(SESSION_KEY));

if (!session) {
  window.location.replace("login.html");
}

const ENROLLED_KEY = "classiq_enrolled_" + (session ? session.email : "");

const IMG_MATH = "../assets/images/courses/course-math.jpg";
const IMG_SCIENCE = "../assets/images/courses/course-science.jpg";

const courses = [
  { id: 1, title: "Foundation Mathematics", category: "Science", image: IMG_MATH, lessons: 24, hours: 12, rating: 4.8, level: "Beginner" },
  { id: 2, title: "Life Science Essentials", category: "Science", image: IMG_SCIENCE, lessons: 18, hours: 9, rating: 4.7, level: "Beginner" },
  { id: 3, title: "Web Development Bootcamp", category: "Development", image: IMG_SCIENCE, lessons: 42, hours: 30, rating: 4.9, level: "Intermediate" },
  { id: 4, title: "Data Science with Python", category: "Data", image: IMG_MATH, lessons: 36, hours: 25, rating: 4.8, level: "Intermediate" },
  { id: 5, title: "App Development Basics", category: "Development", image: IMG_MATH, lessons: 28, hours: 18, rating: 4.6, level: "Beginner" },
  { id: 6, title: "UI/UX Design Masterclass", category: "Design", image: IMG_SCIENCE, lessons: 20, hours: 14, rating: 4.9, level: "Advanced" },
];

let activeCategory = "All";

function getEnrolled() {
  return JSON.parse(localStorage.getItem(ENROLLED_KEY)) || [];
}

function saveEnrolled(list) {
  localStorage.setItem(ENROLLED_KEY, JSON.stringify(list));
}

function showUser() {
  document.getElementById("userName").textContent = session.username;
  document.getElementById("userNameNav").textContent = session.username;
  document.getElementById("userInitial").textContent = session.username.charAt(0).toUpperCase();

  document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "login.html";
  });
}

function updateStats() {
  const enrolled = getEnrolled();
  const hours = courses
    .filter(function (c) { return enrolled.includes(c.id); })
    .reduce(function (sum, c) { return sum + c.hours; }, 0);

  document.getElementById("statTotal").textContent = courses.length;
  document.getElementById("statEnrolled").textContent = enrolled.length;
  document.getElementById("statHours").textContent = hours + "h";
}

function renderCourses() {
  const enrolled = getEnrolled();
  const list = courses.filter(function (c) {
    return activeCategory === "All" || c.category === activeCategory;
  });

  document.getElementById("courseList").innerHTML = list.map(function (course) {
    const isEnrolled = enrolled.includes(course.id);
    return `
      <div class="col-12 col-sm-6 col-lg-4">
        <article class="course-card">
          <div class="course-card-media">
            <img src="${course.image}" alt="${course.title} class" loading="lazy">
            <span class="course-badge">${course.category}</span>
          </div>
          <div class="course-card-body">
            <div class="course-meta">
              <span><i class="bi bi-journal-text" aria-hidden="true"></i> ${course.lessons} Lessons</span>
              <span><i class="bi bi-clock" aria-hidden="true"></i> ${course.hours}h</span>
            </div>
            <h3 class="course-title">${course.title}</h3>
            <div class="course-footer">
              <span class="course-level">${course.level}</span>
              <span class="course-rating"><i class="bi bi-star-fill" aria-hidden="true"></i> ${course.rating}</span>
            </div>
            <button type="button" class="enroll-btn ${isEnrolled ? "enrolled" : ""}" data-id="${course.id}">
              ${isEnrolled ? '<i class="bi bi-check-circle-fill" aria-hidden="true"></i> Enrolled' : "Enroll Now"}
            </button>
          </div>
        </article>
      </div>`;
  }).join("");
}

document.getElementById("courseList").addEventListener("click", function (event) {
  const button = event.target.closest(".enroll-btn");
  if (!button) return;

  const id = Number(button.dataset.id);
  let enrolled = getEnrolled();

  if (enrolled.includes(id)) {
    enrolled = enrolled.filter(function (x) { return x !== id; });
  } else {
    enrolled.push(id);
  }

  saveEnrolled(enrolled);
  renderCourses();
  updateStats();
});

document.getElementById("filterChips").addEventListener("click", function (event) {
  const chip = event.target.closest(".chip");
  if (!chip) return;

  document.querySelectorAll(".chip").forEach(function (c) {
    c.classList.remove("active");
    c.setAttribute("aria-pressed", "false");
  });
  chip.classList.add("active");
  chip.setAttribute("aria-pressed", "true");

  activeCategory = chip.dataset.category;
  renderCourses();
});

if (session) {
  showUser();
  updateStats();
  renderCourses();
}
