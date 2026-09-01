/*
 * 발달 단계 체크리스트
 * 개월수별 대표적인 발달 마일스톤을 체크박스로 확인하고 요약을 보여줍니다.
 * 선별용 참고 자료이며, 의학적 진단 도구가 아닙니다.
 */

var MILESTONES = {
  2: [
    { cat: "대근육", text: "엎드린 자세에서 고개를 잠깐 들어요" },
    { cat: "대근육", text: "손발을 활발하게 움직여요" },
    { cat: "소근육", text: "손을 입으로 자주 가져가요" },
    { cat: "언어", text: "\"아\", \"우\" 같은 소리를 내요" },
    { cat: "언어", text: "큰 소리에 놀라거나 반응해요" },
    { cat: "사회성", text: "사람 얼굴을 보고 미소를 지어요(사회적 미소)" },
    { cat: "사회성", text: "부모의 목소리에 반응해요" }
  ],
  4: [
    { cat: "대근육", text: "엎드린 자세에서 가슴까지 들어올려요" },
    { cat: "대근육", text: "목을 제법 잘 가눠요" },
    { cat: "소근육", text: "딸랑이 같은 물건을 손으로 잡아요" },
    { cat: "소근육", text: "양손을 모아 놀아요" },
    { cat: "언어", text: "옹알이(쿠잉)를 시작해요" },
    { cat: "언어", text: "소리 내어 웃어요" },
    { cat: "사회성", text: "낯익은 얼굴을 보면 반가워해요" },
    { cat: "사회성", text: "스스로 잘 웃어요" }
  ],
  6: [
    { cat: "대근육", text: "배밀이를 해요" },
    { cat: "대근육", text: "도움 없이 잠깐 앉아 있어요" },
    { cat: "대근육", text: "뒤집기를 해요" },
    { cat: "소근육", text: "물건을 한 손에서 다른 손으로 옮겨요" },
    { cat: "언어", text: "\"바바\", \"마마\" 등 다양한 옹알이를 해요" },
    { cat: "사회성", text: "낯가림이 시작돼요" },
    { cat: "사회성", text: "이름을 부르면 쳐다봐요" }
  ],
  9: [
    { cat: "대근육", text: "혼자 앉아있을 수 있어요" },
    { cat: "대근육", text: "가구를 붙잡고 일어서요" },
    { cat: "대근육", text: "기어다녀요" },
    { cat: "소근육", text: "엄지와 검지로 작은 물건을 집어요" },
    { cat: "언어", text: "\"엄마\", \"아빠\" 같은 옹알이를 반복해요" },
    { cat: "언어", text: "\"안돼\" 같은 간단한 말에 반응해요" },
    { cat: "사회성", text: "까꿍 놀이를 좋아해요" },
    { cat: "사회성", text: "분리불안이 뚜렷해요" }
  ],
  12: [
    { cat: "대근육", text: "가구를 붙잡고 걸어요" },
    { cat: "대근육", text: "혼자 몇 걸음 걸어요" },
    { cat: "소근육", text: "컵을 손으로 잡고 마시려 해요" },
    { cat: "언어", text: "의미 있는 첫 단어를 말해요(엄마, 맘마 등)" },
    { cat: "언어", text: "\"빠이빠이 해봐\" 같은 간단한 지시를 이해해요" },
    { cat: "사회성", text: "손을 흔들어 인사해요" },
    { cat: "사회성", text: "원하는 것을 손가락으로 가리켜요" }
  ],
  15: [
    { cat: "대근육", text: "혼자 잘 걸어요" },
    { cat: "대근육", text: "계단을 기어오르려 해요" },
    { cat: "소근육", text: "블록 2개를 쌓아요" },
    { cat: "소근육", text: "숟가락을 사용하려 해요" },
    { cat: "언어", text: "3~5개의 단어를 말해요" },
    { cat: "언어", text: "신체 부위를 하나 이상 가리켜요" },
    { cat: "사회성", text: "익숙한 어른에게 애정을 표현해요" }
  ],
  18: [
    { cat: "대근육", text: "뛰어다녀요" },
    { cat: "대근육", text: "손을 잡고 계단을 오르내려요" },
    { cat: "소근육", text: "블록 3~4개를 쌓아요" },
    { cat: "소근육", text: "크레용으로 끄적여요" },
    { cat: "언어", text: "10개 이상의 단어를 말해요" },
    { cat: "언어", text: "두 단어를 연결해서 말하기 시작해요" },
    { cat: "사회성", text: "그림책 속 그림을 손으로 가리켜요" },
    { cat: "사회성", text: "다른 아이들에게 관심을 보여요" }
  ],
  24: [
    { cat: "대근육", text: "두 발을 모아 제자리에서 점프해요" },
    { cat: "대근육", text: "공을 발로 차요" },
    { cat: "소근육", text: "문 손잡이를 돌려요" },
    { cat: "소근육", text: "책장을 한 장씩 넘겨요" },
    { cat: "언어", text: "2~3단어로 문장을 말해요" },
    { cat: "언어", text: "자신의 이름을 말해요" },
    { cat: "사회성", text: "간단한 역할놀이를 해요(인형 밥주기 등)" },
    { cat: "사회성", text: "\"내 거\"라는 소유 개념이 생겨요" }
  ]
};

document.addEventListener("DOMContentLoaded", function () {
  var select = document.getElementById("month-select");
  var container = document.getElementById("checklist-container");
  var summaryBox = document.getElementById("checklist-summary");

  if (!select || !container) return;

  function renderChecklist(month) {
    var items = MILESTONES[month];
    container.innerHTML = "";
    summaryBox.classList.remove("show");

    var byCat = {};
    items.forEach(function (item, idx) {
      if (!byCat[item.cat]) byCat[item.cat] = [];
      byCat[item.cat].push({ item: item, idx: idx });
    });

    Object.keys(byCat).forEach(function (cat) {
      var group = document.createElement("div");
      group.className = "checklist-group";
      var heading = document.createElement("h4");
      heading.textContent = cat;
      group.appendChild(heading);

      byCat[cat].forEach(function (entry) {
        var label = document.createElement("label");
        label.className = "check-item";
        label.innerHTML =
          '<input type="checkbox" class="milestone-check" />' +
          "<span>" + entry.item.text + "</span>";
        group.appendChild(label);
      });

      container.appendChild(group);
    });

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn mt-24";
    btn.textContent = "체크 결과 확인하기";
    btn.addEventListener("click", function () {
      var checks = container.querySelectorAll(".milestone-check");
      var total = checks.length;
      var checked = 0;
      checks.forEach(function (c) {
        if (c.checked) checked++;
      });
      var ratio = total === 0 ? 0 : checked / total;

      var msg;
      if (ratio >= 0.7) {
        msg = "또래 발달 지표와 비교적 잘 맞아요. 지금처럼 꾸준히 놀이와 상호작용을 이어가 주세요.";
      } else if (ratio >= 0.4) {
        msg = "일부 발달 지표가 아직 나타나지 않았어요. 조금 더 지켜보고, 다음 영유아 건강검진 때 상담해보세요.";
      } else {
        msg = "체크된 항목이 적은 편이에요. 소아청소년과 또는 보건소 영유아 발달선별검사(K-DST) 상담을 받아보는 것을 권장해요.";
      }

      summaryBox.innerHTML =
        '<div class="ratio">' + checked + " / " + total + "</div>" +
        "<p>" + msg + "</p>" +
        '<p style="font-size:0.8rem;color:var(--color-text-soft)">이 체크리스트는 참고용 선별 도구이며 의학적 진단을 대신하지 않아요.</p>';
      summaryBox.classList.add("show");
      summaryBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    container.appendChild(btn);
  }

  select.addEventListener("change", function () {
    renderChecklist(parseInt(select.value, 10));
  });

  renderChecklist(parseInt(select.value, 10));
});
