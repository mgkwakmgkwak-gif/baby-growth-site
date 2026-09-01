/*
 * 예방접종 시기 계산기
 * 질병관리청 표준예방접종일정(국가필수예방접종)을 참고하여
 * 출생일 기준으로 각 접종의 권장 접종일을 계산합니다.
 * 실제 접종 시기는 아이의 건강 상태에 따라 의료진과 상담 후 조정될 수 있습니다.
 */

// days: 출생일로부터 권장 접종까지의 일수(대략값). ageLabel: 화면 표시용 나이 표기
var VACCINE_SCHEDULE = [
  { vaccine: "B형간염", dose: "1차", days: 0, ageLabel: "출생 직후" },
  { vaccine: "BCG(결핵)", dose: "", days: 21, ageLabel: "생후 4주 이내" },
  { vaccine: "B형간염", dose: "2차", days: 30, ageLabel: "생후 1개월" },
  { vaccine: "DTaP(디프테리아·파상풍·백일해)", dose: "1차", days: 60, ageLabel: "생후 2개월" },
  { vaccine: "IPV(폴리오)", dose: "1차", days: 60, ageLabel: "생후 2개월" },
  { vaccine: "Hib(뇌수막염)", dose: "1차", days: 60, ageLabel: "생후 2개월" },
  { vaccine: "폐렴구균(PCV)", dose: "1차", days: 60, ageLabel: "생후 2개월" },
  { vaccine: "로타바이러스", dose: "1차", days: 60, ageLabel: "생후 2개월" },
  { vaccine: "DTaP", dose: "2차", days: 120, ageLabel: "생후 4개월" },
  { vaccine: "IPV(폴리오)", dose: "2차", days: 120, ageLabel: "생후 4개월" },
  { vaccine: "Hib", dose: "2차", days: 120, ageLabel: "생후 4개월" },
  { vaccine: "폐렴구균(PCV)", dose: "2차", days: 120, ageLabel: "생후 4개월" },
  { vaccine: "로타바이러스", dose: "2차", days: 120, ageLabel: "생후 4개월" },
  { vaccine: "B형간염", dose: "3차", days: 180, ageLabel: "생후 6개월" },
  { vaccine: "DTaP", dose: "3차", days: 180, ageLabel: "생후 6개월" },
  { vaccine: "Hib", dose: "3차", days: 180, ageLabel: "생후 6개월" },
  { vaccine: "폐렴구균(PCV)", dose: "3차", days: 180, ageLabel: "생후 6개월" },
  { vaccine: "IPV(폴리오)", dose: "3차", days: 210, ageLabel: "생후 6~18개월" },
  { vaccine: "일본뇌염(사백신)", dose: "1차", days: 365, ageLabel: "생후 12개월" },
  { vaccine: "일본뇌염(사백신)", dose: "2차", days: 395, ageLabel: "1차 접종 1개월 후" },
  { vaccine: "Hib", dose: "4차", days: 365, ageLabel: "생후 12~15개월" },
  { vaccine: "폐렴구균(PCV)", dose: "4차", days: 365, ageLabel: "생후 12~15개월" },
  { vaccine: "MMR(홍역·유행성이하선염·풍진)", dose: "1차", days: 365, ageLabel: "생후 12~15개월" },
  { vaccine: "수두", dose: "", days: 365, ageLabel: "생후 12~15개월" },
  { vaccine: "A형간염", dose: "1차", days: 365, ageLabel: "생후 12~23개월" },
  { vaccine: "DTaP", dose: "4차", days: 450, ageLabel: "생후 15~18개월" },
  { vaccine: "A형간염", dose: "2차", days: 545, ageLabel: "1차 접종 6개월 후" },
  { vaccine: "일본뇌염(사백신)", dose: "3차", days: 730, ageLabel: "생후 24~35개월" },
  { vaccine: "DTaP", dose: "5차", days: 1460, ageLabel: "만 4~6세" },
  { vaccine: "IPV(폴리오)", dose: "4차", days: 1460, ageLabel: "만 4~6세" },
  { vaccine: "MMR", dose: "2차", days: 1460, ageLabel: "만 4~6세" },
  { vaccine: "일본뇌염(사백신)", dose: "4차", days: 2190, ageLabel: "만 6세" }
];

function addDays(date, days) {
  var d = new Date(date.getTime());
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(d) {
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return y + "." + m + "." + day;
}

function diffDays(a, b) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("vaccine-form");
  if (!form) return;

  var resultBox = document.getElementById("vaccine-result");
  var listEl = document.getElementById("vaccine-list");
  var nextEl = document.getElementById("vaccine-next");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var birthInput = document.getElementById("birthdate").value;
    if (!birthInput) {
      alert("출생일을 입력해주세요.");
      return;
    }

    var birthDate = new Date(birthInput + "T00:00:00");
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    if (birthDate > today) {
      alert("출생일은 오늘 이전 날짜여야 해요.");
      return;
    }

    var items = VACCINE_SCHEDULE.map(function (v) {
      var dueDate = addDays(birthDate, v.days);
      var dday = diffDays(today, dueDate);
      var status;
      if (dday < 0) status = "overdue";
      else if (dday <= 30) status = "soon";
      else status = "upcoming";
      return {
        vaccine: v.vaccine,
        dose: v.dose,
        ageLabel: v.ageLabel,
        dueDate: dueDate,
        dday: dday,
        status: status
      };
    });

    items.sort(function (a, b) {
      return a.dueDate - b.dueDate;
    });

    // 다음 접종(지난 접종 중 가장 최근 것 또는 예정 중 가장 빠른 것)
    var overdueItems = items.filter(function (i) { return i.status === "overdue"; });
    var futureItems = items.filter(function (i) { return i.status !== "overdue"; });

    listEl.innerHTML = "";

    if (futureItems.length === 0) {
      nextEl.innerHTML = "국가필수예방접종 표준 일정을 모두 완료했어요! 청소년기 추가 접종(Td/Tdap 등)은 학교 및 보건소 안내를 확인하세요.";
    } else {
      var next = futureItems[0];
      nextEl.innerHTML =
        "<strong>" + next.vaccine + (next.dose ? " " + next.dose : "") + "</strong> · " +
        formatDate(next.dueDate) + " (" + (next.dday === 0 ? "오늘" : next.dday + "일 후") + ")";
    }

    if (overdueItems.length > 0) {
      var overdueNotice = document.createElement("div");
      overdueNotice.className = "callout warn";
      overdueNotice.innerHTML =
        "⚠️ 접종 시기가 지난 항목이 " + overdueItems.length + "개 있어요. 병원에 방문해 빠른 시일 내 접종 일정을 상담하세요.";
      listEl.appendChild(overdueNotice);
    }

    items.forEach(function (item) {
      var div = document.createElement("div");
      div.className = "vaccine-item " + item.status;

      var statusText = item.status === "overdue" ? "접종 시기 지남" : item.status === "soon" ? "곧 접종" : "예정";

      div.innerHTML =
        '<div>' +
          '<div class="v-name">' + item.vaccine + (item.dose ? " · " + item.dose : "") + '</div>' +
          '<div class="v-age">권장 시기: ' + item.ageLabel + '</div>' +
        '</div>' +
        '<div style="text-align:right">' +
          '<div class="v-date">' + formatDate(item.dueDate) + '</div>' +
          '<span class="status-pill ' + item.status + '">' + statusText + '</span>' +
        '</div>';
      listEl.appendChild(div);
    });

    resultBox.classList.add("show");
    resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});
