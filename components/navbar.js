class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-indigo-100 navbar-header">
        <nav class="container mx-auto max-w-6xl px-4 relative navbar-container">
          <div class="flex items-center justify-between h-16 navbar-bar">
            
            <!-- Logo -->
            <a href="index.html" class="navbar-logo">
              <img src="Logo.png" alt="Logo">
            </a>

            <!-- Desktop Menu -->
            <div class="navbar-desktop">
              <a href="#features" class="nav-item flex items-center gap-2">
                <i data-feather="star" class="w-4 h-4 text-indigo-500"></i> Özellikler
              </a>
              <a href="#how" class="nav-item flex items-center gap-2">
                <i data-feather="play-circle" class="w-4 h-4 text-indigo-500"></i> Nasıl Çalışır?
              </a>
              <a href="#faq" class="nav-item flex items-center gap-2">
                <i data-feather="help-circle" class="w-4 h-4 text-indigo-500"></i> SSS
              </a>
              <a href="mailto:destek@ornek.com" class="nav-item flex items-center gap-2">
                <i data-feather="mail" class="w-4 h-4 text-indigo-500"></i> İletişim
              </a>
              <a href="#generator" id="nav-generate" class="nav-cta">
                <i data-feather="zap" class="w-4 h-4"></i> QR Oluştur
              </a>
            </div>

            <!-- Mobile Toggle -->
            <button id="mobileToggle"
                    class="navbar-toggle md:hidden inline-flex items-center justify-center p-2 rounded-lg border border-indigo-200 text-indigo-600"
                    aria-controls="mobileMenu" aria-expanded="false" aria-label="Mobil menüyü aç/kapat">
              <i data-feather="menu" class="w-5 h-5"></i>
            </button>

          </div>
        </nav>

        <!-- Mobile Menu -->
        <div id="mobileMenu" class="mobile-menu backdrop-blur">
          <a href="#features" class="mobile-link flex items-center gap-2">
            <i data-feather="star" class="w-4 h-4 text-indigo-500"></i> Özellikler
          </a>
          <a href="#how" class="mobile-link flex items-center gap-2">
            <i data-feather="play-circle" class="w-4 h-4 text-indigo-500"></i> Nasıl Çalışır?
          </a>
          <a href="#faq" class="mobile-link flex items-center gap-2">
            <i data-feather="help-circle" class="w-4 h-4 text-indigo-500"></i> SSS
          </a>
          <a href="mailto:destek@ornek.com" class="mobile-link flex items-center gap-2">
            <i data-feather="mail" class="w-4 h-4 text-indigo-500"></i> İletişim
          </a>
          <a href="#generator" class="mobile-link mobile-cta flex items-center gap-2">
            <i data-feather="zap" class="w-4 h-4 text-indigo-500"></i> QR Oluştur
          </a>
        </div>

      </header>
    `;

    const header = this.querySelector('.navbar-header');
    const menu = this.querySelector('#mobileMenu');
    const toggle = this.querySelector('#mobileToggle');

    // Feather icons
    if (window.feather) feather.replace();

    // Reposition menu on open + scroll
    const setMenuPosition = () => {
      const rect = header.getBoundingClientRect();
      menu.style.top = rect.bottom + "px";
    };

    // Open/Close Menu
    let isOpen = false;
    const setOpen = (open) => {
      isOpen = open;
      setMenuPosition();
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open);
    };

    toggle.addEventListener("click", () => setOpen(!isOpen));

    // Close when clicking a link
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setOpen(false)));

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!isOpen) return;
      if (!menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });

    // Keep positioned on scroll/resizing
    window.addEventListener("scroll", () => { if (isOpen) setMenuPosition(); }, { passive: true });
    window.addEventListener("resize", () => { if (isOpen) setMenuPosition(); });
  }
}
customElements.define("custom-navbar", CustomNavbar);
