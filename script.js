document.addEventListener('DOMContentLoaded', function () {
    const urlInput = document.getElementById('url-input');
    const generateBtn = document.getElementById('generate-btn');
    const qrCodeContainer = document.getElementById('qr-code-container');
    const downloadOptions = document.getElementById('download-options');
    const downloadPng = document.getElementById('download-png');
    const toastContainer = document.getElementById('toast-container');

    let pendingTimer = null;
    let jobSeq = 0;
    let generating = false;
    let currentQRCode = null;
    let libraryLoadAttempts = 0;
    const maxLoadAttempts = 3;

    function resetQRUI() {
        // içeriği tek hamlede temizle (canvas/img vs. hepsi)
        qrCodeContainer.replaceChildren();
        qrCodeContainer.classList.remove('generating');
        downloadOptions.classList.add('hidden');
        currentQRCode = null;
    }

    function lockGenerateBtn(lock) {
        generateBtn.disabled = !!lock;
        generateBtn.style.pointerEvents = lock ? 'none' : '';
        generateBtn.style.opacity = lock ? '0.6' : '';
        generateBtn.style.cursor = lock ? 'not-allowed' : '';
    }

    // Modern Toast Notification System
    function showToast(message, type = 'info', title = '', duration = 3000) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '!',
            info: 'i'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-content">
                ${title ? `<div class="toast-title">${title}</div>` : ''}
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
            <div class="toast-progress"></div>
        `;

        toastContainer.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.parentElement.removeChild(toast);
                }
            }, 400);
        }, duration);
    }

    // Enhanced QR Code library loading check
    function checkAndLoadQRCodeLibrary() {
        if (typeof QRCode !== 'undefined') {
            console.log('QRCode library is available');
            return true;
        }

        libraryLoadAttempts++;
        console.log(`QRCode library not loaded. Attempt ${libraryLoadAttempts}/${maxLoadAttempts}`);

        if (libraryLoadAttempts >= maxLoadAttempts) {
            showToast('QR Kod kütüphanesi yüklenemedi. Sayfa yenileniyor...', 'error', 'Kütüphane Hatası');
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            return false;
        }

        // Try to load fallback if main library failed
        if (libraryLoadAttempts === 1) {
            if (typeof loadQRCodeFallback === 'function') {
                loadQRCodeFallback();
                showToast('Ana kütüphane yüklenemedi, alternatif kütüphane deneniyor...', 'warning', 'Kütüphane Yükleniyor');
            }
        }

        return false;
    }

    // Generate QR code
    generateBtn.addEventListener('click', function () {
        // Kütüphane kontrolü
        if (!checkAndLoadQRCodeLibrary()) {
            showToast('QR Kod kütüphanesi hala yükleniyor. Lütfen biraz bekleyin...', 'warning', 'Kütüphane Yükleniyor');
            return;
        }
        const url = urlInput.value.trim();
        const color = document.querySelector('input[name="qr-color"]:checked')?.value || 'default';

        if (!url) {
            showToast('Lütfen geçerli bir URL giriniz', 'error', 'Hata');
            return;
        }
        try { new URL(url); } catch (_) {
            showToast('Lütfen geçerli bir URL giriniz (https:// veya http://)', 'error', 'Geçersiz URL');
            return;
        }

        // Önceki zamanlayıcı/işlem varsa iptal et → yalnızca son tıklama geçerli
        if (pendingTimer) { clearTimeout(pendingTimer); pendingTimer = null; }
        jobSeq++;
        const myJob = jobSeq;

        // UI sıfırla ve "oluşturuluyor" durumuna geçir
        resetQRUI();
        qrCodeContainer.innerHTML = '<p class="text-indigo-500 animate-pulse">Oluşturuluyor...</p>';
        qrCodeContainer.classList.add('generating');
        lockGenerateBtn(true);
        generating = true;

        pendingTimer = setTimeout(() => {
            // Eğer bu arada başka bir tıklama geldiyse, vazgeç
            if (myJob !== jobSeq) return;

            // Başlangıç katı renk (gradient sonradan boyanacak)
            const darkColor =
                color === 'indigo' ? '#5da8ff' :
                    color === 'purple' ? '#605dff' :
                        color === 'maroon' ? '#7b1e3a' : '#000000';

            // Konteyneri bir kez daha temizle (placeholder'ı kaldırmak için)
            qrCodeContainer.replaceChildren();

            // Yeni QR oluştur
            const qr = new QRCode(qrCodeContainer, {
                text: url,
                width: 200,
                height: 200,
                colorDark: darkColor,
                colorLight: '#ffffff00',
                correctLevel: QRCode.CorrectLevel.H
            });

            // Son iş değilse vazgeç
            if (myJob !== jobSeq) return;

            qrCodeContainer.classList.remove('generating');

            // Canvas'ı bul ve gradient uygula (varsa)
            const canvas = qrCodeContainer.querySelector('canvas');
            if (canvas) {
                currentQRCode = canvas;

                if (color === 'indigo' || color === 'purple' || color === 'maroon') {
                    const ctx = canvas.getContext('2d');
                    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                    if (color === 'indigo') { grad.addColorStop(0, '#5da8ff'); grad.addColorStop(1, '#605dff'); }
                    if (color === 'purple') { grad.addColorStop(0, '#605dff'); grad.addColorStop(1, '#ad63f6'); }
                    if (color === 'maroon') { grad.addColorStop(0, '#b42e55'); grad.addColorStop(1, '#7b1e3a'); }
                    const prev = ctx.globalCompositeOperation;
                    ctx.globalCompositeOperation = 'source-in';
                    ctx.fillStyle = grad;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.globalCompositeOperation = prev;
                }

                // İndirme
                downloadPng.onclick = () => {
                    const finalSize = 256, qrSize = 200, padding = (finalSize - qrSize) / 2;
                    const pngCanvas = document.createElement('canvas');
                    pngCanvas.width = finalSize; pngCanvas.height = finalSize;
                    const pngCtx = pngCanvas.getContext('2d');
                    pngCtx.clearRect(0, 0, finalSize, finalSize);
                    pngCtx.drawImage(canvas, padding, padding, qrSize, qrSize);
                    const link = document.createElement('a');
                    link.download = 'qr-kod.png';
                    link.href = pngCanvas.toDataURL('image/png');
                    link.click();
                    showToast('PNG formatında QR kod indirildi', 'success', 'Başarılı');
                };

                downloadOptions.classList.remove('hidden');
                showToast('QR kod başarıyla oluşturuldu!', 'success', 'Başarılı');
            } else {
                showToast('QR kod oluşturulurken hata oluştu', 'error', 'Hata');
            }

            // Temizlik ve butonu aç
            generating = false;
            lockGenerateBtn(false);
            pendingTimer = null;

        }, 200);
    });

    function clearQRCode() {
        // Konteyneri tek hamlede temizle
        qrCodeContainer.innerHTML = '';
        qrCodeContainer.classList.remove('generating');
        currentQRCode = null;
    }

    // Initialize QRCode library check
    setInterval(() => {
        if (typeof QRCode !== 'undefined') {
            console.log('QRCode library loaded successfully');
            // Clear the loading message from QR container
            const loadingElement = qrCodeContainer.querySelector('p');
            if (loadingElement && loadingElement.textContent.includes('Oluşturuluyor')) {
                qrCodeContainer.innerHTML = '';
                qrCodeContainer.classList.remove('generating');
            }
        }
    }, 500);

    // Final check after 5 seconds
    setTimeout(() => {
        if (typeof QRCode === 'undefined') {
            console.error('QRCode library failed to load after timeout');
            showToast('QR Kod kütüphanesi yüklenemedi. Lütfen internet bağlantınızı kontrol edin.', 'error', 'Bağlantı Hatası');
        }
    }, 5000);
});