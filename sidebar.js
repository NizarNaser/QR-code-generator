
  window.addEventListener("DOMContentLoaded", () => {
    // تحميل الهيدر، الشريط الجانبي، والفوتر
    Promise.all([
      fetch("header.html").then(res => res.text()),
      fetch("sidebar.html").then(res => res.text()),
      fetch("footer.html").then(res => res.text())
    ]).then(([header, sidebar, footer]) => {
      document.getElementById("header").innerHTML = header;
      document.getElementById("sidebar").innerHTML = sidebar;
      document.getElementById("footer").innerHTML = footer;

      // بعد تحميل السايدبار، شغل عرض المقالات المميزة
      fetch("articles.json")
        .then(res => res.json())
        .then(articles => {
          const topArticles = articles.filter(a => a.top).slice(0, 10);
          const list = document.getElementById("top-articles-list");

          if (list && topArticles.length) {
            list.innerHTML = "";
            topArticles.forEach(article => {
              const li = document.createElement("li");
              li.innerHTML = `
              <img src="${article.image}" alt="${article.title}" />
              <a href="article.html?id=${article.id}">${article.title}</a>`;
              list.appendChild(li);
            });
          }
        })
        .catch(err => console.error("فشل في تحميل المقالات:", err));
    });
  });

