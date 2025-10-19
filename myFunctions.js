function loadApps() {
  const data = localStorage.getItem("apps");
  return data ? JSON.parse(data) : [];
}

function saveApps(apps) {
  localStorage.setItem("apps", JSON.stringify(apps));
}

// create default apps
function initDefaultApps() {
  const existing = loadApps();
  if (existing.length === 0) {
    const defaults = [
      {
        name: "ChatGPT",
        company: "OpenAI",
        url: "https://chat.openai.com",
        free: true,
        usage: "AI-Tools",
        description:
          "مساعد ذكي يعتمد على الذكاء الاصطناعي للتحدث والإجابة على الأسئلة وكتابة النصوص.",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
        media: "",
      },
      {
        name: "Midjourney",
        company: "Midjourney Inc",
        url: "https://www.midjourney.com",
        free: false,
        usage: "AI-Tools",
        description:
          "مولد صور يعتمد على الذكاء الاصطناعي لتحويل النصوص إلى لوحات فنية واقعية.",
        logo: "https://cdn.midjourney.com/app-icon.png",
        media: "",
      },
      {
        name: "RunwayML",
        company: "Runway",
        url: "https://runwayml.com",
        free: false,
        usage: "AI-Tools",
        description:
          "أداة تحرير فيديوهات ذكية تستخدم الذكاء الاصطناعي لتعديل المقاطع وإضافة تأثيرات احترافية.",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Runway_logo.svg",
        media: "",
      },
      {
        name: "D-ID",
        company: "D-ID",
        url: "https://www.d-id.com",
        free: false,
        usage: "AI-Tools",
        description:
          "تطبيق لتحريك الصور الثابتة وجعلها تتحدث باستخدام الذكاء الاصطناعي.",
        logo: "https://www.d-id.com/wp-content/uploads/2021/02/logo.svg",
        media: "",
      },
      {
        name: "Synthesia",
        company: "Synthesia Ltd",
        url: "https://www.synthesia.io",
        free: false,
        usage: "AI-Tools",
        description:
          "أداة لإنشاء مقاطع فيديو من النصوص باستخدام مقدمين افتراضيين بتقنيات الذكاء الاصطناعي.",
        logo: "https://www.synthesia.io/static/images/synthesia-logo.svg",
        media: "",
      },
    ];
    saveApps(defaults);
  }
}

//  Validation Inputs ::
function validateAndAddApp(app) {
  const errors = {};

  if (!/^[A-Za-z]+$/.test(app.name)) {
    errors.name =
      "❌ اسم التطبيق يجب أن يتكوّن من أحرف إنجليزية فقط بدون فراغات.";
  }

  if (!/^[A-Za-z\s]+$/.test(app.company)) {
    errors.company = "❌ اسم الشركة يجب أن يتكوّن من أحرف إنجليزية فقط.";
  }

  if (app.url && !/^https?:\/\/.+\..+/.test(app.url)) {
    errors.url = "❌ أدخل رابط موقع صحيح يبدأ بـ http أو https.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const apps = loadApps();
  apps.push(app);
  saveApps(apps);

  return { success: true };
}

function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/[&<>"']/g, function (c) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c];
  });
}
function escapeAttr(text) {
  return escapeHtml(text);
}

// when loading do ::
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const page = path.split("/").pop();

  initDefaultApps();

  if (page === "apps.html") {
    const apps = loadApps();
    const tbody = document.getElementById("appsBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    apps.forEach((app, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(app.name)}</td>
        <td>${escapeHtml(app.company)}</td>
        <td>${escapeHtml(app.usage)}</td>
        <td><input type="checkbox" disabled ${app.free ? "checked" : ""}></td>
        <td class="center">
          <input type="checkbox" class="details-toggle" id="toggle-${idx}" data-index="${idx}">
        </td>`;
      tbody.appendChild(tr);
      const detailsRow = document.createElement("tr");
      detailsRow.classList.add("details-row");
      detailsRow.dataset.index = idx;
      detailsRow.innerHTML = `
        <td colspan="5">
          <div  class="details-box" style="display:none;">
          <div><strong>الموقع:</strong> ${
            app.url
              ? `<a href="${escapeAttr(
                  app.url
                )}" target="_blank" rel="noopener">${escapeHtml(app.url)}</a> `
              : "—"
          }</div>
            <div><strong>وصف مختصر:</strong> ${escapeHtml(
              app.description || "—"
            )}</div>
          <div class="flex">
              <div><strong>الشعار:</strong> ${
                app.logo
                  ? ` <img src="${escapeAttr(
                      app.logo
                    )}" alt="logo" class="logo-small"> `
                  : "—"
              }</div>
              <div><strong>ملف وسائط:</strong> ${
                app.media
                  ? ` <a href="${escapeAttr(
                      app.media
                    )}" target="_blank" rel="noopener">افتح</a>`
                  : "—"
              }</div>
            </div>
          </div>
        </td>`;
      tbody.appendChild(detailsRow);
    });

    tbody.addEventListener("change", (e) => {
      if (e.target.classList.contains("details-toggle")) {
        const idx = e.target.dataset.index;
        const detailsBox = document.querySelector(
          `.details-row[data-index="${idx}"] .details-box`
        );
        if (!detailsBox) return;
        detailsBox.style.display = e.target.checked ? "flex" : "none";
      }
    });
  }

  // Add app page part ::
  if (page === "add_app.html") {
    const form = document.getElementById("addAppForm");
    const resetBtn = document.getElementById("resetBtn");

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        document.querySelectorAll(".hint").forEach((s) => (s.textContent = ""));

        const app = {
          name: document.getElementById("appName").value.trim(),
          company: document.getElementById("company").value.trim(),
          url: document.getElementById("url").value.trim(),
          free: document.getElementById("isFree").checked,
          usage: document.getElementById("usage").value,
          description: document.getElementById("description").value.trim(),
          logo: document.getElementById("logo").value.trim(),
          media: document.getElementById("media").value.trim(),
        };

        const result = validateAndAddApp(app);
        if (result.success) {
          window.location.href = "apps.html";
        } else {
          const errs = result.errors || {};
          document.getElementById("errName").textContent = errs.name || "";
          document.getElementById("errCompany").textContent =
            errs.company || "";
          document.getElementById("errUrl").textContent = errs.url || "";
        }
      });

      resetBtn.addEventListener("click", () => {
        form.reset();
        document.querySelectorAll(".hint").forEach((s) => (s.textContent = ""));
      });
    }
  }
});


let BtnAdd = document.querySelector(".btn");
if (BtnAdd) {
  BtnAdd.addEventListener("click", () => {
    window.location.href = "add_app.html";
  });
}
