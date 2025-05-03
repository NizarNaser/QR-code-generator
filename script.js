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
  
  