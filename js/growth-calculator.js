/*
 * 성장 백분위 계산기
 * WHO 소아 성장표준(0~24개월) 및 국내 성장도표 경향(24~36개월)을 참고하여
 * 월령별 평균(mean)과 표준편차(SD)를 근사한 값으로 백분위를 추정합니다.
 * 실제 병원에서 사용하는 대한소아과학회 2017 성장도표(LMS 방식)와는
 * 다소 차이가 있을 수 있는 "간이 추정" 도구입니다.
 */

// 월령 기준점: 0~12개월은 매달, 이후 3개월 간격으로 36개월까지
var AGE_POINTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 18, 21, 24, 27, 30, 33, 36];

var GROWTH_DATA = {
  boy: {
    height: [49.9, 54.7, 58.4, 61.4, 63.9, 65.9, 67.6, 69.2, 70.6, 72.0, 73.3, 74.5, 75.7, 79.1, 82.3, 85.1, 87.8, 90.2, 92.4, 94.6, 96.7],
    heightSD: [1.9, 2.0, 2.1, 2.2, 2.3, 2.3, 2.4, 2.4, 2.5, 2.5, 2.6, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.4, 3.5],
    weight: [3.3, 4.5, 5.6, 6.4, 7.0, 7.5, 7.9, 8.3, 8.6, 8.9, 9.2, 9.4, 9.6, 10.3, 10.9, 11.5, 12.2, 12.7, 13.3, 13.8, 14.3],
    weightSD: [0.4, 0.5, 0.6, 0.65, 0.7, 0.75, 0.79, 0.83, 0.86, 0.89, 0.92, 0.94, 0.96, 1.0, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35]
  },
  girl: {
    height: [49.1, 53.7, 57.1, 59.8, 62.1, 64.0, 65.7, 67.3, 68.7, 70.1, 71.5, 72.8, 74.0, 77.5, 80.7, 83.7, 86.4, 88.9, 91.2, 93.3, 95.4],
    heightSD: [1.9, 2.0, 2.1, 2.2, 2.2, 2.3, 2.4, 2.4, 2.5, 2.5, 2.6, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.4, 3.5],
    weight: [3.2, 4.2, 5.1, 5.8, 6.4, 6.9, 7.3, 7.6, 7.9, 8.2, 8.5, 8.7, 8.9, 9.6, 10.2, 10.9, 11.5, 12.1, 12.7, 13.2, 13.9],
    weightSD: [0.4, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.78, 0.81, 0.84, 0.87, 0.89, 0.91, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3]
  }
};

// 선형 보간으로 특정 월령의 평균/표준편차 추정
function interpolate(months, arr) {
  if (months <= AGE_POINTS[0]) return arr[0];
  if (months >= AGE_POINTS[AGE_POINTS.length - 1]) return arr[arr.length - 1];

  for (var i = 0; i < AGE_POINTS.length - 1; i++) {
    var a = AGE_POINTS[i];
    var b = AGE_POINTS[i + 1];
    if (months >= a && months <= b) {
      var ratio = (months - a) / (b - a);
      return arr[i] + (arr[i + 1] - arr[i]) * ratio;
    }
  }
  return arr[arr.length - 1];
}

// 표준정규분포 누적분포함수 근사 (Abramowitz and Stegun)
function normalCDF(z) {
  var t = 1 / (1 + 0.2316419 * Math.abs(z));
  var d = 0.3989423 * Math.exp((-z * z) / 2);
  var prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) prob = 1 - prob;
  return prob;
}

function calcPercentile(sex, months, value, metric) {
  var mean = interpolate(months, GROWTH_DATA[sex][metric]);
  var sd = interpolate(months, GROWTH_DATA[sex][metric + "SD"]);
  var z = (value - mean) / sd;
  var p = normalCDF(z) * 100;
  p = Math.max(0.1, Math.min(99.9, p));
  return { percentile: p, mean: mean, z: z };
}

function percentileLabel(p) {
  if (p < 3) return { text: "또래보다 많이 작은 편", cls: "warn" };
  if (p < 15) return { text: "또래보다 작은 편", cls: "" };
  if (p < 85) return { text: "또래와 비슷한 표준 범위", cls: "" };
  if (p < 97) return { text: "또래보다 큰 편", cls: "" };
  return { text: "또래보다 많이 큰 편", cls: "warn" };
}

// 0.1%, 99.9% 같은 극단값을 "0%"/"100%"로 반올림하면 실제 의미(1% 미만 등)가
// 사라지므로 별도로 표기한다.
function formatPercentile(p) {
  if (p < 1) return "1% 미만";
  if (p > 99) return "99% 초과";
  return Math.round(p) + "%";
}

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("growth-form");
  if (!form) return;

  var resultBox = document.getElementById("growth-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var sex = form.querySelector('input[name="sex"]:checked').value;
    var months = parseFloat(document.getElementById("months").value);
    var height = parseFloat(document.getElementById("height").value);
    var weight = parseFloat(document.getElementById("weight").value);

    if (isNaN(months) || isNaN(height) || isNaN(weight) || months < 0 || months > 36) {
      alert("개월수(0~36), 키, 몸무게를 정확히 입력해주세요.");
      return;
    }

    var hResult = calcPercentile(sex, months, height, "height");
    var wResult = calcPercentile(sex, months, weight, "weight");

    document.getElementById("result-height-pct").textContent = formatPercentile(hResult.percentile);
    document.getElementById("result-weight-pct").textContent = formatPercentile(wResult.percentile);
    document.getElementById("result-height-bar").style.width = hResult.percentile + "%";
    document.getElementById("result-weight-bar").style.width = wResult.percentile + "%";

    var extremeNote = document.getElementById("result-extreme-note");
    if (Math.abs(hResult.z) > 3 || Math.abs(wResult.z) > 3) {
      extremeNote.style.display = "block";
    } else {
      extremeNote.style.display = "none";
    }

    var hLabel = percentileLabel(hResult.percentile);
    var wLabel = percentileLabel(wResult.percentile);

    document.getElementById("result-height-label").textContent = hLabel.text;
    document.getElementById("result-weight-label").textContent = wLabel.text;

    document.getElementById("result-headline").textContent =
      (sex === "boy" ? "남아" : "여아") + " " + months + "개월, 키 " + height + "cm / 몸무게 " + weight + "kg";

    resultBox.classList.add("show");
    resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});
