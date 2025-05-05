function generateCode() {
    const text = document.getElementById("barcode-input").value;
    const type = document.getElementById("barcode-type").value;
    const barcodeElement = document.getElementById("barcode");
    const qrCodeElement = document.getElementById("qrcode");
  
    // تنظيف العناصر
    barcodeElement.innerHTML = "";
    qrCodeElement.innerHTML = "";
  
    if (!text) {
      alert("يرجى إدخال نص أولاً");
      return;
    }
  
    if (type === "QR") {
      // توليد QR Code باستخدام المكتبة
      QRCode.toCanvas(
        document.createElement("canvas"),
        text,
        { width: 200 },
        function (error, canvas) {
          if (error) console.error(error);
          qrCodeElement.appendChild(canvas);
        }
      );
    } else {
      // توليد باركود باستخدام JsBarcode
      JsBarcode(barcodeElement, text, {
        format: type,
        lineColor: "#000",
        width: 2,
        height: 100,
        displayValue: true,
      });
    }
  }

  function downloadCode() {
    const type = document.getElementById("barcode-type").value;
  
    if (type === "QR") {
      // تحميل QR كصورة PNG
      const canvas = document.querySelector("#qrcode canvas");
      if (!canvas) {
        alert("يرجى توليد الكود أولاً");
        return;
      }
      const image = canvas.toDataURL("image/png");
      downloadImage(image, "qr-code.png");
    } else {
      // تحميل الباركود كصورة SVG
      const svg = document.getElementById("barcode");
      if (!svg || svg.childNodes.length === 0) {
        alert("يرجى توليد الباركود أولاً");
        return;
      }
  
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      downloadImage(url, "barcode.svg");
    }
  }
  
  function downloadImage(href, name) {
    const link = document.createElement("a");
    link.href = href;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  window.addEventListener('DOMContentLoaded', () => {
    // تحميل الهيدر
    fetch('header.html')
      .then(res => res.text())
      .then(data => {
        document.getElementById('header').innerHTML = data;
      });
  
    // تحميل الفوتر
    fetch('footer.html')
      .then(res => res.text())
      .then(data => {
        document.getElementById('footer').innerHTML = data;
      });

  });
  

  window.addEventListener('DOMContentLoaded', () => {
    // تحميل الهيدر والفوتر بشكل غير مرئي
    Promise.all([
      fetch('header.html').then(res => res.text()),
      fetch('footer.html').then(res => res.text())
    ]).then(([headerData, footerData]) => {
      // إدراج المحتوى في الهيدر والفوتر
      document.getElementById('header').innerHTML = headerData;
      document.getElementById('footer').innerHTML = footerData;
  
      // إضافة فئة "visible" للهيدر والفوتر
      document.querySelector('header').classList.add('visible');
      document.querySelector('footer').classList.add('visible');
  
      // إضافة فئة "loaded" للجسم بعد تحميل جميع العناصر
      document.body.classList.add('loaded');
    });
  });
  
  
  
  