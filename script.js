let articles = [];
let currentPage = 1;
const articlesPerPage = 3;

// تحميل عناصر الصفحة والمقالات دفعة واحدة
window.addEventListener("DOMContentLoaded", () => {
  Promise.all([
    fetch("header.html").then(res => res.text()),
    fetch("sidebar.html").then(res => res.text()),
    fetch("footer.html").then(res => res.text()),
  ])
    .then(([headerData, sidebarData, footerData]) => {
      document.getElementById("header").innerHTML = headerData;
      document.getElementById("sidebar").innerHTML = sidebarData;
      document.getElementById("footer").innerHTML = footerData;

      document.getElementById("header")?.classList.add("visible");
      document.getElementById("sidebar")?.classList.add("visible");
      document.getElementById("footer")?.classList.add("visible");
      document.body.classList.add("loaded");

      // تحميل المقالات
      fetch("articles.json")
        .then(response => response.json())
        .then(data => {
          articles = data;
          displayArticles();
          displayTopArticles();
          displayFullArticle(); // إن وُجد id
        })
        .catch(error =>
          console.error("فشل في تحميل بيانات المقالات:", error)
        );
    })
    .catch(error =>
      console.error("فشل في تحميل القوالب الخارجية:", error)
    );
});

// توليد الباركود أو QR
function generateCode() {
  const text = document.getElementById("barcode-input").value;
  const type = document.getElementById("barcode-type").value;
  const barcodeElement = document.getElementById("barcode");
  const qrCodeElement = document.getElementById("qrcode");

  barcodeElement.innerHTML = "";
  qrCodeElement.innerHTML = "";

  if (!text) {
    alert("يرجى إدخال نص أولاً");
    return;
  }

  if (type === "QR") {
    const canvas = document.createElement("canvas");
    QRCode.toCanvas(canvas, text, { width: 200 }, function (error) {
      if (error) {
        console.error(error);
        return;
      }
      qrCodeElement.appendChild(canvas);
    });
  } else {
    JsBarcode(barcodeElement, text, {
      format: type,
      lineColor: "#000",
      width: 2,
      height: 100,
      displayValue: true,
    });
  }
}

// تحميل الصورة
function downloadCode() {
  const type = document.getElementById("barcode-type").value;

  if (type === "QR") {
    const canvas = document.querySelector("#qrcode canvas");
    if (!canvas) {
      alert("يرجى توليد الكود أولاً");
      return;
    }
    const image = canvas.toDataURL("image/png");
    downloadImage(image, "qr-code.png");
  } else {
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

// عرض المقالات حسب الصفحة
function displayArticles() {
  const container = document.getElementById("articles-container");
  if (!container) return;

  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  container.innerHTML = "";

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
    container.appendChild(articleDiv);
  });

  document.getElementById("page-number").textContent = `Page ${currentPage}`;
}

// تغيير الصفحة
function changePage(direction) {
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  currentPage += direction;
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;
  displayArticles();
}

// عرض المقالات المميزة
function displayTopArticles() {
  const list = document.getElementById("top-articles-list");
  if (!list) return;

  const topArticles = articles.filter(article => article.top);
  list.innerHTML = "";

  topArticles.forEach(article => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${article.image}" alt="${article.title}" />
      <a href="article.html?id=${article.id}">${article.title}</a>
    `;
    list.appendChild(li);
  });
}

// عرض المقال الكامل إذا وُجد id
function displayFullArticle() {
  const articleContainer = document.getElementById("article-container");
  if (!articleContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("id");
  if (!articleId) return;

  const article = articles.find(a => a.id == articleId);
  if (!article) {
    articleContainer.innerHTML = "<p>المقال غير موجود.</p>";
    return;
  }

  const desc = marked.parse(article.description);
  articleContainer.innerHTML = `
    <article class="article-full">
      <h1>${article.title}</h1>
      <div class="article-img-desc">
        <img src="${article.image}" alt="${article.title}" />
        <div class="desc"><p>${article.content || desc}</p></div>
      </div>
      <footer>
        <p>By: ${article.author}</p>
        <p>Published on: ${article.date}</p>
      </footer>
    </article>
  `;
}
