document.addEventListener("DOMContentLoaded", async () => {

  let appData = { menu_categories: [], menu_items: [], testimonials: [] };
  let selectedCategory = "all";
  let isSoundEnabled = false;

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playAmbientChime() {
    if (!isSoundEnabled) return;
    try {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); 
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); 
      
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.warn("Audio Context blocked or not started");
    }
  }

  function playSoftClick() {
    if (!isSoundEnabled) return;
    try {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.08);
      
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.warn("Audio Context blocked or not started");
    }
  }

  try {
    const res = await fetch('data.json');
    appData = await res.json();
  } catch (error) {
    console.error("Data load issue, using fallback.", error);
  }

  setTimeout(() => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      gsap.to(preloader, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          preloader.style.display = "none";

          gsap.from(".hero-text", {
            y: 50,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: "power4.out"
          });
          gsap.from(".hero-visual", {
            scale: 0.95,
            opacity: 0,
            duration: 1.6,
            ease: "power3.out"
          });
        }
      });
    }
  }, 1600);

  renderMenuTabs();
  renderMenuItems();
  renderTestimonials();

  const menuToggle = document.getElementById("mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const menuIcon = document.getElementById("menu-icon");

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const isHidden = mobileNav.classList.contains("hidden");
      if (!isHidden) {
        gsap.to(mobileNav, {
          opacity: 0,
          y: -20,
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => {
            mobileNav.classList.add("hidden");
            if (menuIcon) {
              menuIcon.setAttribute("data-lucide", "menu");
              lucide.createIcons();
            }
          }
        });
      } else {
        mobileNav.classList.remove("hidden");
        gsap.fromTo(mobileNav, 
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
        );
        gsap.from("#mobile-nav a", {
          opacity: 0,
          y: 20,
          stagger: 0.08,
          duration: 0.4,
          ease: "power2.out"
        });
        if (menuIcon) {
          menuIcon.setAttribute("data-lucide", "x");
          lucide.createIcons();
        }
      }
      playSoftClick();
    });
  }

  document.querySelectorAll(".nav-link-item").forEach(link => {
    link.addEventListener("click", () => {
      if (mobileNav) {
        gsap.to(mobileNav, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          onComplete: () => {
            mobileNav.classList.add("hidden");
            if (menuIcon) {
              menuIcon.setAttribute("data-lucide", "menu");
              lucide.createIcons();
            }
          }
        });
      }
      playSoftClick();
    });
  });

  const soundToggle = document.getElementById("sound-toggle");
  if (soundToggle) {
    soundToggle.addEventListener("click", () => {
      isSoundEnabled = !isSoundEnabled;
      if (isSoundEnabled) {
        audioCtx.resume();
        soundToggle.innerHTML = `<i data-lucide="volume-2" class="w-5 h-5 text-caramel"></i>`;
        soundToggle.classList.add("sound-pulse");
        showToast("Golden Soundscapes Enabled");
        playAmbientChime();
      } else {
        soundToggle.innerHTML = `<i data-lucide="volume-x" class="w-5 h-5 text-cream/70"></i>`;
        soundToggle.classList.remove("sound-pulse");
        showToast("Audio Muted");
      }
      lucide.createIcons();
    });
  }

  function renderMenuTabs() {
    const tabsContainer = document.getElementById("menu-tabs");
    if (!tabsContainer || !appData.menu_categories) return;

    tabsContainer.innerHTML = appData.menu_categories.map(cat => `
      <button 
        data-cat="${cat.id}"
        class="tab-btn px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-300 whitespace-nowrap border ${
          selectedCategory === cat.id 
          ? 'bg-amber-100 text-[#0C0907] border-amber-100' 
          : 'bg-transparent text-neutral-400 border-neutral-800 hover:border-amber-100/30 hover:text-amber-100'
        }"
      >
        ${cat.label}
      </button>
    `).join("");

    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        selectedCategory = e.currentTarget.getAttribute("data-cat");
        playSoftClick();
        renderMenuTabs();
        renderMenuItems();
      });
    });
  }

  function renderMenuItems() {
    const gridContainer = document.getElementById("menu-grid");
    if (!gridContainer || !appData.menu_items) return;

    const filtered = selectedCategory === "all" 
      ? appData.menu_items 
      : appData.menu_items.filter(item => item.category === selectedCategory);

    gridContainer.innerHTML = filtered.map(item => `
      <div class="menu-card group relative overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950/40 p-4 hover:border-[#C68B59]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#C68B59]/5 flex flex-col justify-between">
        <div>
          <div class="relative h-48 w-full overflow-hidden rounded-xl mb-4 menu-image-container">
            <img 
              src="${item.image}" 
              alt="${item.name}" 
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <span class="absolute top-3 left-3 z-10 text-[10px] tracking-widest uppercase font-semibold text-neutral-950 bg-amber-100 px-2.5 py-1 rounded-full">
              ${item.tag}
            </span>
          </div>
          <div class="flex justify-between items-start mb-2 gap-2">
            <h3 class="text-base font-bold text-amber-50 group-hover:text-amber-100 transition-colors">${item.name}</h3>
            <span class="text-xs font-semibold text-amber-200/90 whitespace-nowrap bg-neutral-900/60 px-2.5 py-1 rounded-md border border-neutral-800">${item.price}</span>
          </div>
          <p class="text-xs text-neutral-400 leading-relaxed font-light mb-4">${item.description}</p>
        </div>
        
        <!-- Interactive Order Simulation -->
        <div class="pt-3 border-t border-neutral-900 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span class="text-[9px] text-amber-200/50 uppercase tracking-widest">Freshly Handcrafted</span>
          <button class="order-btn-simulation text-[10px] bg-amber-100 text-neutral-950 px-3 py-1.5 rounded-md font-bold uppercase tracking-wider hover:bg-white transition-colors">
            Reserve Bite
          </button>
        </div>
      </div>
    `).join("");

    gsap.fromTo(".menu-card", 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.05, duration: 0.6, ease: "power3.out" }
    );

    document.querySelectorAll(".order-btn-simulation").forEach(btn => {
      btn.addEventListener("click", () => {
        playAmbientChime();
        showToast("✨ Added to your Midnight Craving List!");
      });
    });
  }

  function renderTestimonials() {
    const listContainer = document.getElementById("testimonials-list");
    if (!listContainer || !appData.testimonials) return;

    listContainer.innerHTML = appData.testimonials.map(item => `
      <div class="glass-panel p-6 rounded-2xl relative border-neutral-900 hover:border-[#C68B59]/20 transition-all flex flex-col justify-between">
        <div>
          <div class="flex text-amber-100 gap-1 mb-3">
            ${Array(item.rating).fill('<i data-lucide="star" class="w-4 h-4 fill-amber-100"></i>').join("")}
          </div>
          <p class="text-sm italic text-neutral-300 font-light mb-6 leading-relaxed">"${item.text}"</p>
        </div>
        <div>
          <h4 class="text-sm font-semibold text-amber-50">${item.name}</h4>
          <span class="text-[10px] uppercase text-amber-200/40 tracking-wider font-semibold">${item.role}</span>
        </div>
      </div>
    `).join("");
    lucide.createIcons();
  }

  function showToast(message) {
    const toast = document.getElementById("toast-notification");
    const toastText = document.getElementById("toast-text");
    if (!toast || !toastText) return;

    toastText.innerText = message;
    toast.classList.remove("translate-y-20", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");

    setTimeout(() => {
      toast.classList.remove("translate-y-0", "opacity-100");
      toast.classList.add("translate-y-20", "opacity-0");
    }, 3000);
  }

  const submitReviewBtn = document.getElementById("submit-review-btn");
  if (submitReviewBtn) {
    submitReviewBtn.addEventListener("click", () => {
      const nameInp = document.getElementById("review-name");
      const textInp = document.getElementById("review-text");

      if (nameInp.value.trim() && textInp.value.trim()) {
        const newReview = {
          name: nameInp.value,
          role: "Local Citizen",
          rating: 5,
          text: textInp.value
        };

        appData.testimonials.unshift(newReview);
        renderTestimonials();
        
        nameInp.value = "";
        textInp.value = "";

        playAmbientChime();
        showToast("✨ Added your gorgeous words to the wall!");
      } else {
        showToast("Please fill in both fields first!");
      }
    });
  }

  lucide.createIcons();
});
