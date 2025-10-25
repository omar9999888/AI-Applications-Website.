
document.addEventListener("DOMContentLoaded", () => {
    const addAppForm = document.querySelector("#add-app-form");
    if (addAppForm) {
        addAppForm.addEventListener("submit", e => {
            e.preventDefault();
            const appName = document.querySelector("#app-name").value.trim();
            const companyName = document.querySelector("#company-name").value.trim();
            const websiteUrl = document.querySelector("#website-url").value.trim();
            const isFree = document.querySelector("#is-free").value;
            const usageField = document.querySelector("#usage-field").value;
            const description = document.querySelector("#description").value.trim();
            const logoFile = document.querySelector("#logo").files[0];
            const mediaFile = document.querySelector("#media").files[0];

            if (!/^[A-Za-z]+$/.test(appName)) {
                alert("اسم التطبيق يجب أن يكون باللغة الإنجليزية بدون فراغات.");
                return;
            }

            if (!/^[A-Za-z0-9 ]+$/.test(companyName)) {
                alert("اسم الشركة يجب أن يكون باللغة الإنجليزية.");
                return;
            }

            if (!websiteUrl.startsWith("http://") && !websiteUrl.startsWith("https://")) {
                alert("يرجى إدخال رابط صحيح يبدأ بـ http:// أو https://");
                return;
            }

            if (!isFree || !usageField || !description) {
                alert("يرجى تعبئة جميع الحقول المطلوبة.");
                return;
            }

            const readerLogo = new FileReader();
            const readerMedia = new FileReader();

            readerLogo.onload = function () {
                const logoURL = logoFile ? readerLogo.result : "";
                readerMedia.onload = function () {
                    const mediaURL = mediaFile ? readerMedia.result : "";
                    const newApp = {
                        appName, companyName, websiteUrl, isFree, usageField, description, logoURL, mediaURL
                    };
                    let apps = JSON.parse(localStorage.getItem("apps")) || [];
                    apps.push(newApp);
                    localStorage.setItem("apps", JSON.stringify(apps));
                    alert("تمت إضافة التطبيق بنجاح!");
                    window.location.href = "apps.html";
                };
                if (mediaFile) {
                    readerMedia.readAsDataURL(mediaFile);
                } else {
                    readerMedia.onload();
                }
            };
            if (logoFile) {
                readerLogo.readAsDataURL(logoFile);
            } else {
                readerLogo.onload();
            }
        });
    }

    const appsTableBody = document.querySelector("#apps-table-body");
    if (appsTableBody) {
        let apps = JSON.parse(localStorage.getItem("apps")) || [];
        apps.forEach(app => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${app.appName}</td>
                <td>${app.companyName}</td>
                <td>${app.usageField}</td>
                <td>${app.isFree}</td>
                <td><a href="${app.websiteUrl}" target="_blank">زيارة</a></td>
                <td><button class="details-btn">عرض التفاصيل</button></td>
            `;
            appsTableBody.appendChild(row);

            const detailsRow = document.createElement("tr");
            detailsRow.classList.add("details-row", "hidden");
            detailsRow.innerHTML = `
                <td colspan="6">
                    <p><strong>عنوان الموقع:</strong> <a href="${app.websiteUrl}" target="_blank">${app.websiteUrl}</a></p>
                    <p><strong>شرح مختصر:</strong> ${app.description}</p>
                    ${app.logoURL ? `<img src="${app.logoURL}" alt="Logo" style="max-width:100px;">` : ""}
                    ${app.mediaURL ? `<video src="${app.mediaURL}" controls style="max-width:200px;"></video>` : ""}
                </td>
            `;
            appsTableBody.appendChild(detailsRow);
        });

        document.querySelectorAll(".details-btn").forEach(button => {
            button.addEventListener("click", () => {
                const detailsRow = button.closest("tr").nextElementSibling;
                detailsRow.classList.toggle("hidden");
                button.textContent = detailsRow.classList.contains("hidden") ? "عرض التفاصيل" : "إخفاء التفاصيل";
            });
        });
    }
});
