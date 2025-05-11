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
let articles = [];
let currentPage = 1;
const articlesPerPage = 3; // عدد المقالات في كل صفحة
window.addEventListener('DOMContentLoaded', () => {
  // تحميل الهيدر، الشريط الجانبي والفوتر بشكل غير مرئي
  Promise.all([
    fetch('header.html').then(res => res.text()),
    fetch('sidebar.html').then(res => res.text()),
    fetch('footer.html').then(res => res.text())
  ]).then(([headerData, sidebarData, footerData]) => {
    // إدراج المحتوى في الهيدر، الشريط الجانبي، والفوتر
    document.getElementById('header').innerHTML = headerData;
    document.getElementById('sidebar').innerHTML = sidebarData;
    document.getElementById('footer').innerHTML = footerData;

    // إضافة فئة "visible" للهيدر، الشريط الجانبي والفوتر بعد تحميلهم
    document.getElementById('header').classList.add('visible');
    document.getElementById('sidebar').classList.add('visible');
    document.getElementById('footer').classList.add('visible');

    // إضافة فئة "loaded" للجسم بعد تحميل جميع العناصر
    document.body.classList.add('loaded');
    fetch('articles.json')
  .then(response => response.json())
  .then(data => {
    articles = data;
    displayArticles();
    displayTopArticles();
  })
  .catch(error => console.error("فشل في تحميل بيانات المقالات:", error));
  }).catch(error => console.error('Error loading external content:', error));
});


// استخراج ID من رابط الصفحة
window.addEventListener("DOMContentLoaded", () => {
const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get("id");

if (!articleId) return;

fetch("articles.json")
  .then(response => response.json())
  .then(data => {
    const article = data.find(a => a.id == articleId);
    if (!article) {
      document.getElementById("article-container").innerHTML = "<p>المقال غير موجود.</p>";
      return;
    }
 const desc = marked.parse(article.description);
    document.getElementById("article-container").innerHTML = `
    
      <article class="article-full">
        <h1>${article.title}</h1>
        <div class="article-img-desc">
        <img src="${article.image}" alt="${article.title}" />
           <div class="desc"><p >${article.content || desc}</p></div>
        </div>
        <footer>
          <p>By: ${article.author}</p>
          <p>Published on: ${article.date}</p>
        </footer>
      </article>
    `;
  })
  .catch(err => {
    console.error("فشل في تحميل المقال:", err);
  });
});


// عرض المقالات في الصفحة الحالية
function displayArticles() {
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  const articlesContainer = document.getElementById("articles-container");
  articlesContainer.innerHTML = ""; // تنظيف

  currentArticles.forEach(article => {
    const articleDiv = document.createElement("div");
    articleDiv.classList.add("article");

    articleDiv.innerHTML = `
      <h2>${article.title}</h2>
      <p>${article.description_min}</p>
      <img src="${article.image}" alt="${article.title}" />
      <footer>
        <p>By: ${article.author}</p>
        <p>Published on: ${article.date}</p>
        <a href="article.html?id=${article.id}">more &#10142;</a>
      </footer>
    `;

    articlesContainer.appendChild(articleDiv);
  });

  document.getElementById("page-number").textContent = `Page ${currentPage}`;
}

// تغيير الصفحة
function changePage(direction) {
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  currentPage += direction;
  if (currentPage < 1) currentPage = 1;
  else if (currentPage > totalPages) currentPage = totalPages;
  displayArticles();
}

// عرض المقالات المميزة
function displayTopArticles() {
  const topArticles = articles.filter(article => article.top);
  const list = document.getElementById("top-articles-list");

  if (list && topArticles.length) {
    list.innerHTML = "";
    topArticles.forEach(article => {
      const li = document.createElement("li");
      li.innerHTML = `
      <img  src="${article.image}" alt="${article.title}" />
      <a href="article.html?id=${article.id}">${article.title}</a>
      
      `;
      list.appendChild(li);
    });
  } else {
    console.warn("العنصر 'top-articles-list' غير موجود أو لا توجد مقالات مميزة.");
  }
}






