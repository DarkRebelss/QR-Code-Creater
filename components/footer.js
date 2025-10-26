class CustomFooter extends HTMLElement {
  connectedCallback() {
    const year = new Date().getFullYear();
    this.innerHTML = `
      <footer class="mt-16 border-t border-indigo-100 bg-white/80">
        <!-- Üst gradient çizgi -->
        <div class="h-1 w-full"
             style="background: linear-gradient(90deg, #5da8ff, #605dff 50%, #ad63f6);"></div>

        <div class="container mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Sol -->
          <div>
            <div class="flex items-center space-x-2 mb-3">
              <img src="Logo.png" alt="Logo" style="width: 265px; height: auto;">
            </div>
            <p class="text-sm text-slate-600 leading-relaxed">
              URL’lerinizi saniyeler içinde şık QR Kodlarına dönüştürün. Tüm işlemler tarayıcınızda — veri gizliliğiniz bizde öncelik.
            </p>
          </div>

          <!-- Orta -->
          <div class="md:mx-auto">
            <h4 class="font-bold mb-3 text-slate-900">Hızlı Bağlantılar</h4>
            <ul class="space-y-2 text-sm">
              <li class="flex items-center gap-2">
              <i data-feather="mail" class="w-4 h-4 text-indigo-500"></i>
              <a href="mailto:destek@ornek.com" class="text-slate-600 hover:text-indigo-600">
                İletişim
              </a></li>
              <li class="flex items-center gap-2">
              <i data-feather="star" class="w-4 h-4 text-indigo-500"></i>
              <a href="#features" class="text-slate-600 hover:text-indigo-600">
                Özellikler
              </a></li>
              <li class="flex items-center gap-2">
              <i data-feather="play-circle" class="w-4 h-4 text-indigo-500"></i>
              <a href="#how" class="text-slate-600 hover:text-indigo-600">
                Nasıl Çalışır?
              </a></li>
              <li class="flex items-center gap-2">
              <i data-feather="help-circle" class="w-4 h-4 text-indigo-500"></i>
              <a href="#faq" class="text-slate-600 hover:text-indigo-600">
                SSS
              </a></li>
            </ul>
          </div>

          <!-- Sağ -->
          <div>
            <h4 class="font-bold mb-3 text-slate-900">Bize Ulaşın</h4>
            <ul class="space-y-2 text-sm">
              <li class="flex items-center gap-2">
                <i data-feather="mail" class="w-4 h-4 text-indigo-500"></i>
                <a href="mailto:destek@ornek.com" class="text-slate-600 hover:text-indigo-600">destek@ornek.com</a>
              </li>
              <li class="flex items-center gap-2">
                <i data-feather="twitter" class="w-4 h-4 text-indigo-500"></i>
                <a href="https://x.com/ornek" target="_blank" rel="noopener" class="text-slate-600 hover:text-indigo-600">X (Twitter)</a>
              </li>
              <li class="flex items-center gap-2">
                <i data-feather="github" class="w-4 h-4 text-indigo-500"></i>
                <a href="https://github.com/ornek" target="_blank" rel="noopener" class="text-slate-600 hover:text-indigo-600">GitHub</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t text-slate-400">
          <div class="container mx-auto max-w-6xl px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <p class="text-xs text-slate-500">© ${year} QR Code Oluşturucu. Tüm hakları saklıdır.</p>
            <div class="flex items-center gap-4 text-xs">
              <a href="#kvkk" class="text-slate-500 hover:text-indigo-600 flex items-center gap-1">
                <i data-feather="shield" class="w-4 h-4 text-indigo-500"></i> KVKK
              </a>
              <span class="text-slate-400">•</span>
              <a href="#gizlilik" class="text-slate-500 hover:text-indigo-600 flex items-center gap-1">
                <i data-feather="lock" class="w-4 h-4 text-indigo-500"></i> Gizlilik
              </a>
              <span class="text-slate-400">•</span>
              <a href="#kullanim" class="text-slate-500 hover:text-indigo-600 flex items-center gap-1">
                <i data-feather="file-text" class="w-4 h-4 text-indigo-500"></i> Kullanım Şartları
              </a>
            </div>
          </div>
        </div>
      </footer>
    `;

    // Feather ikonlarını işle
    if (window.feather && typeof window.feather.replace === 'function') {
      window.feather.replace();
    }
  }
}
customElements.define('custom-footer', CustomFooter);