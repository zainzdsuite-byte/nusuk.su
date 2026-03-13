const NATIONALITIES = [
  "أفغانستان","ألبانيا","الجزائر","أندورا","أنغولا","الأرجنتين","أرمينيا","أستراليا","النمسا","أذربيجان",
  "البحرين","بنغلاديش","بيلاروسيا","بلجيكا","بليز","بنين","بوتان","بوليفيا","البوسنة والهرسك","بوتسوانا",
  "البرازيل","بلغاريا","بوركينا فاسو","بوروندي","كمبوديا","الكاميرون","كندا","تشاد","تشيلي","الصين",
  "كولومبيا","جزر القمر","الكونغو","الكونغو الديمقراطية","كوستاريكا","كرواتيا","كوبا","قبرص","التشيك","الدنمارك",
  "جيبوتي","مصر","السلفادور","إريتريا","إستونيا","إثيوبيا","فنلندا","فرنسا","غامبيا","جورجيا",
  "ألمانيا","غانا","اليونان","غواتيمالا","غينيا","هايتي","هندوراس","المجر","آيسلندا","الهند",
  "إندونيسيا","إيران","العراق","إيرلندا","إيطاليا","اليابان","الأردن","كازاخستان","كينيا","الكويت",
  "قيرغيزستان","لاوس","لاتفيا","لبنان","ليبيا","ليتوانيا","لوكسمبورغ","مدغشقر","ماليزيا","جزر المالديف",
  "مالي","مالطا","موريتانيا","موريشيوس","المكسيك","مولدوفا","منغوليا","المغرب","موزمبيق","ميانمار",
  "ناميبيا","نيبال","هولندا","نيوزيلندا","نيكاراغوا","النيجر","نيجيريا","النرويج","عُمان","باكستان",
  "فلسطين","بنما","باراغواي","بيرو","الفلبين","بولندا","البرتغال","قطر","رومانيا","روسيا",
  "رواندا","السعودية","السنغال","صربيا","سيشل","سيراليون","سنغافورة","سلوفاكيا","سلوفينيا","الصومال",
  "جنوب أفريقيا","كوريا الجنوبية","جنوب السودان","إسبانيا","سريلانكا","السودان","السويد","سويسرا","سوريا","تايوان",
  "طاجيكستان","تنزانيا","تايلاند","توغو","تونس","تركيا","تركمانستان","أوغندا","أوكرانيا","الإمارات",
  "المملكة المتحدة","الولايات المتحدة","أوروغواي","أوزبكستان","فنزويلا","فيتنام","اليمن","زامبيا","زيمبابوي"
];

function populateNationalities() {
  const select = document.getElementById("nationality");
  if (!select) return;

  NATIONALITIES.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

function generateReferenceNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(100000 + Math.random() * 900000);
  return `HJ-${y}${m}${d}-${random}`;
}

function getApplications() {
  return JSON.parse(localStorage.getItem("applications") || "[]");
}

function saveApplications(data) {
  localStorage.setItem("applications", JSON.stringify(data));
}

function setupApplicationForm() {
  const form = document.getElementById("applicationForm");
  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const referenceNumber = generateReferenceNumber();

    const application = {
      referenceNumber,
      fullNameAr: document.getElementById("fullNameAr").value.trim(),
      fullNameEn: document.getElementById("fullNameEn").value.trim(),
      nationality: document.getElementById("nationality").value,
      passportOrIqama: document.getElementById("passportOrIqama").value.trim(),
      countryCode: document.getElementById("countryCode").value,
      phoneNumber: document.getElementById("phoneNumber").value.trim(),
      companionsCount: document.getElementById("companionsCount").value.trim(),
      companionsNames: document.getElementById("companionsNames").value.trim(),
      hasUsPassport: document.getElementById("hasUsPassport").value,
      birthDate: document.getElementById("birthDate").value,
      gender: document.getElementById("gender").value,
      email: document.getElementById("email").value.trim(),
      currentResidence: document.getElementById("currentResidence").value.trim(),
      jobTitle: document.getElementById("jobTitle").value.trim(),
      employer: document.getElementById("employer").value.trim(),
      notes: document.getElementById("notes").value.trim(),
      status: "قيد المراجعة",
      createdAt: new Date().toISOString()
    };

    const applications = getApplications();
    applications.push(application);
    saveApplications(applications);

    localStorage.setItem("lastReference", referenceNumber);

    window.location.href = "success.html";
  });
}

function prefillReferenceFromUrl() {
  const input = document.getElementById("referenceInput");
  if (!input) return;

  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");

  if (ref) {
    input.value = ref;
    searchApplication();
  }
}

function searchApplication() {
  const input = document.getElementById("referenceInput");
  const result = document.getElementById("searchResult");

  if (!input || !result) return;

  const reference = input.value.trim();
  if (!reference) {
    alert("يرجى إدخال الرقم المرجعي");
    return;
  }

  const applications = getApplications();
  const app = applications.find(item => item.referenceNumber === reference);

  result.classList.remove("hidden");

  if (!app) {
    result.innerHTML = `
      <h3>نتيجة البحث</h3>
      <p>لم يتم العثور على طلب بهذا الرقم المرجعي.</p>
    `;
    return;
  }

  let statusClass = "";
  if (app.status === "موافق - قيد العمل عليه") statusClass = "status-approved";
  if (app.status === "مرفوض") statusClass = "status-rejected";

  result.innerHTML = `
    <h3>بيانات الطلب الأساسية</h3>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">الرقم المرجعي</div>
        <div>${app.referenceNumber}</div>
      </div>
      <div class="info-item">
        <div class="info-label">الاسم بالعربي</div>
        <div>${app.fullNameAr}</div>
      </div>
      <div class="info-item">
        <div class="info-label">الاسم بالإنجليزي</div>
        <div>${app.fullNameEn}</div>
      </div>
      <div class="info-item">
        <div class="info-label">الجنسية</div>
        <div>${app.nationality}</div>
      </div>
      <div class="info-item">
        <div class="info-label">رقم الجواز / الإقامة</div>
        <div>${app.passportOrIqama}</div>
      </div>
      <div class="info-item">
        <div class="info-label">رقم الهاتف</div>
        <div>${app.countryCode} ${app.phoneNumber}</div>
      </div>
      <div class="info-item">
        <div class="info-label">عدد المرافقين</div>
        <div>${app.companionsCount}</div>
      </div>
      <div class="info-item">
        <div class="info-label">الجواز الأمريكي</div>
        <div>${app.hasUsPassport}</div>
      </div>
      <div class="info-item">
        <div class="info-label">تاريخ الميلاد</div>
        <div>${app.birthDate || "-"}</div>
      </div>
      <div class="info-item">
        <div class="info-label">البريد الإلكتروني</div>
        <div>${app.email || "-"}</div>
      </div>
      <div class="info-item">
        <div class="info-label">حالة الطلب</div>
        <div><span class="status-badge ${statusClass}">${app.status}</span></div>
      </div>
    </div>

    <div class="actions-row" style="margin-top:20px;">
      <button onclick="approveApplication('${app.referenceNumber}')">موافقة</button>
      <button class="secondary-btn" onclick="rejectApplication('${app.referenceNumber}')">رفض</button>
    </div>
  `;
}

function approveApplication(referenceNumber) {
  const applications = getApplications();
  const index = applications.findIndex(item => item.referenceNumber === referenceNumber);

  if (index === -1) {
    alert("الطلب غير موجود");
    return;
  }

  applications[index].status = "موافق - قيد العمل عليه";
  saveApplications(applications);

  document.getElementById("referenceInput").value = referenceNumber;
  searchApplication();
}

function rejectApplication(referenceNumber) {
  const applications = getApplications();
  const index = applications.findIndex(item => item.referenceNumber === referenceNumber);

  if (index === -1) {
    alert("الطلب غير موجود");
    return;
  }

  applications[index].status = "مرفوض";
  saveApplications(applications);

  document.getElementById("referenceInput").value = referenceNumber;
  searchApplication();
}