const progressLine = document.getElementById("progressLine");
const backTop = document.getElementById("backTop");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

window.addEventListener("scroll", () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressLine.style.width = pct + "%";
  backTop.classList.toggle("show", window.scrollY > 500);
});

backTop.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));

menuToggle.addEventListener("click", () => {
  mainNav.classList.toggle("open");
});

document.querySelectorAll("#mainNav a").forEach(a => {
  a.addEventListener("click", () => mainNav.classList.remove("open"));
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll("#mainNav a")];

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id));
  });
}, {rootMargin:"-35% 0px -55% 0px", threshold:0});

sections.forEach(section => activeObserver.observe(section));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {threshold:.08});

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalClose = document.getElementById("modalClose");

document.querySelectorAll(".gallery-item").forEach(item => {
  item.addEventListener("click", () => {
    modalImage.src = item.dataset.img;
    modalImage.alt = item.dataset.title;
    modalTitle.textContent = item.dataset.title;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
  });
});

function closeModal(){
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}
modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", e => { if(e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if(e.key === "Escape") closeModal(); });

document.querySelectorAll(".checklist input").forEach((box, index) => {
  const key = "networklab_check_" + index;
  box.checked = localStorage.getItem(key) === "true";
  box.addEventListener("change", () => localStorage.setItem(key, box.checked));
});


/* =========================================================
   V2 · INTUITIVE WEEK CONTROLLER
   ========================================================= */
(() => {
  const weekIds = ["semana1","semana2","semana3","semana4"];
  const dockLinks = [...document.querySelectorAll(".dock-week")];
  const weekCards = [...document.querySelectorAll("[data-week-card]")];
  const dockProgress = document.getElementById("dockProgress");

  function setWeek(id){
    dockLinks.forEach(link => link.classList.toggle("active", link.dataset.week === id));
    weekCards.forEach(card => card.classList.toggle("active", card.dataset.weekCard === id));
    const index = weekIds.indexOf(id);
    if (dockProgress) dockProgress.style.width = ((index + 1) / weekIds.length * 100) + "%";
  }

  const weekObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) setWeek(entry.target.id);
    });
  }, {rootMargin:"-30% 0px -55% 0px", threshold:0.01});

  weekIds.forEach(id => {
    const section = document.getElementById(id);
    if(section) weekObserver.observe(section);
  });

  [...dockLinks, ...weekCards].forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");
      if(href && href.startsWith("#semana")){
        e.preventDefault();
        const target = document.querySelector(href);
        if(target){
          target.scrollIntoView({behavior:"smooth", block:"start"});
          setWeek(href.slice(1));
        }
      }
    });
  });

  // Keyboard shortcuts: 1–4 jump directly to the four weeks.
  document.addEventListener("keydown", e => {
    if(["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)) return;
    if(["1","2","3","4"].includes(e.key)){
      const target = document.getElementById("semana" + e.key);
      if(target){
        target.scrollIntoView({behavior:"smooth", block:"start"});
        setWeek("semana" + e.key);
      }
    }
  });
})();
