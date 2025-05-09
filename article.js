// article.js
window.addEventListener("DOMContentLoaded", () => {
    // تحميل عناصر الصفحة
    Promise.all([
      fetch("header.html").then(res => res.text()),
      fetch("sidebar.html").then(res => res.text()),
      fetch("footer.html").then(res => res.text())
    ]).then(([header, sidebar, footer]) => {
      document.getElementById("header").innerHTML = header;
      document.getElementById("sidebar").innerHTML = sidebar;
      document.getElementById("footer").innerHTML = footer;
    });
  
    // استخراج ID من رابط الصفحة
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
  
        document.getElementById("article-container").innerHTML = `
          <article class="article-full">
            <h1>${article.title}</h1>
            <img src="${article.image}" alt="${article.title}" />
            <p>${article.content || article.description}</p>
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
  