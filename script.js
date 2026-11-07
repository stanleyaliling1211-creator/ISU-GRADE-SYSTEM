
const ISU_PROGRAMS = {
  "Echague (Main)": [
    "BS in Agriculture",
    "BS in Agricultural and Biosystems Engineering",
    "BS in Civil Engineering",
    "BS in Computer Science",
    "BS in Information Technology",
    "BS in Business Administration",
    "BS in Accountancy",
    "BS in Nursing",
    "BS in Criminology",
    "BS in Development Communication",
    "BS in Veterinary Medicine",
    "Bachelor of Secondary Education",
    "Bachelor of Elementary Education"
  ],
  "Cabagan": [
    "BS in Forestry",
    "BS in Environmental Science",
    "BS in Agriculture",
    "BS in Computer Science",
    "Bachelor of Secondary Education",
    "Bachelor of Elementary Education",
    "BS in Criminology"
  ],
  "Cauayan": [
    "BS in Computer Science",
    "BS in Information Technology",
    "BS in Information Systems",
    "BS in Business Administration",
    "BS in Criminology",
    "Bachelor of Secondary Education",
    "BS in Tourism Management",
    "BS in Hospitality Management"
  ],
  "Ilagan": [
    "BS in Civil Engineering",
    "BS in Electrical Engineering",
    "BS in Mechanical Engineering",
    "BS in Industrial Technology",
    "BS in Information Technology",
    "BS in Nursing",
    "Bachelor of Secondary Education"
  ],
  "Angadanan": [
    "BS in Industrial Technology",
    "BS in Information Technology",
    "Bachelor of Elementary Education",
    "Bachelor of Secondary Education"
  ],
  "Jones": [
    "BS in Agriculture",
    "BS in Information Technology",
    "Bachelor of Secondary Education",
    "Bachelor of Elementary Education"
  ],
  "Roxas": [
    "BS in Agriculture",
    "BS in Information Technology",
    "Bachelor of Secondary Education",
    "Bachelor of Elementary Education"
  ],
  "San Mateo": [
    "BS in Information Technology",
    "BS in Business Administration",
    "Bachelor of Secondary Education"
  ],
  "San Mariano": [
    "BS in Agriculture",
    "BS in Information Technology",
    "Bachelor of Secondary Education"
  ],
  "Palanan": [
    "BS in Agriculture",
    "BS in Information Technology",
    "Bachelor of Elementary Education"
  ],
  "Santiago City": [
    "BS in Business Administration",
    "BS in Information Technology",
    "Bachelor of Secondary Education"
  ]
};


function getISUGrade(percentage) {
  if (percentage >= 98) return { grade: 1.00, status: "Passed", remark: "Excellent" };
  if (percentage >= 95) return { grade: 1.25, status: "Passed", remark: "Superior" };
  if (percentage >= 92) return { grade: 1.50, status: "Passed", remark: "Very Good" };
  if (percentage >= 89) return { grade: 1.75, status: "Passed", remark: "Good" };
  if (percentage >= 86) return { grade: 2.00, status: "Passed", remark: "Meritorious" };
  if (percentage >= 83) return { grade: 2.25, status: "Passed", remark: "Very Satisfactory" };
  if (percentage >= 80) return { grade: 2.50, status: "Passed", remark: "Satisfactory" };
  if (percentage >= 77) return { grade: 2.75, status: "Passed", remark: "Fair" };
  if (percentage >= 75) return { grade: 3.00, status: "Passed", remark: "Passing" };
  return { grade: 5.00, status: "Failed", remark: "Failure (Below 75%)" };
}


const campusSelect = document.getElementById("campusSelect");
const degreeSelect = document.getElementById("degreeSelect");
const customDegreeGroup = document.getElementById("customDegreeGroup");
const customDegreeInput = document.getElementById("customDegreeInput");
const coursesTableBody = document.getElementById("coursesTableBody");
const addCourseBtn = document.getElementById("addCourseBtn");

const totalUnitsElem = document.getElementById("totalUnits");
const gwaValueElem = document.getElementById("gwaValue");
const academicStatusElem = document.getElementById("academicStatus");

let courseCounter = 0;

document.addEventListener("DOMContentLoaded", () => {
  populateCampuses();
  updatePrograms();
  
  
  addCourseRow("IT 111", "Introduction to Computing", 3, 92, 90, 94);
  addCourseRow("IT 112", "Computer Programming 1", 3, 88, 91, 89);
  addCourseRow("GE 1", "Understanding the Self", 3, 95, 96, 94);
  
  calculateGWA();
});


campusSelect.addEventListener("change", updatePrograms);
degreeSelect.addEventListener("change", () => {
  if (degreeSelect.value === "Other") {
    customDegreeGroup.style.display = "flex";
  } else {
    customDegreeGroup.style.display = "none";
  }
});
addCourseBtn.addEventListener("click", () => addCourseRow());


function populateCampuses() {
  campusSelect.innerHTML = "";
  Object.keys(ISU_PROGRAMS).forEach(campus => {
    const option = document.createElement("option");
    option.value = campus;
    option.textContent = `ISU ${campus}`;
    campusSelect.appendChild(option);
  });
}


function updatePrograms() {
  const selectedCampus = campusSelect.value;
  const programs = ISU_PROGRAMS[selectedCampus] || [];
  
  degreeSelect.innerHTML = "";
  programs.forEach(program => {
    const option = document.createElement("option");
    option.value = program;
    option.textContent = program;
    degreeSelect.appendChild(option);
  });
  
  const otherOption = document.createElement("option");
  otherOption.value = "Other";
  otherOption.textContent = "Other / Custom Program...";
  degreeSelect.appendChild(otherOption);
  
  customDegreeGroup.style.display = "none";
}


function addCourseRow(code = "", title = "", units = 3, prelim = "", midterm = "", final = "") {
  courseCounter++;
  const rowId = `course-row-${courseCounter}`;
  
  const tr = document.createElement("tr");
  tr.id = rowId;
  
  tr.innerHTML = `
    <td>
      <input type="text" class="course-code" placeholder="e.g. IT 111" value="${code}">
    </td>
    <td>
      <input type="text" class="course-title" placeholder="e.g. Computer Programming" value="${title}">
    </td>
    <td class="number-col">
      <input type="number" class="course-units" min="1" max="12" step="1" value="${units}" onchange="calculateGWA()">
    </td>
    <td class="number-col">
      <input type="number" class="score-prelim" min="0" max="100" step="0.1" placeholder="0-100" value="${prelim}" oninput="calculateGWA()">
    </td>
    <td class="number-col">
      <input type="number" class="score-midterm" min="0" max="100" step="0.1" placeholder="0-100" value="${midterm}" oninput="calculateGWA()">
    </td>
    <td class="number-col">
      <input type="number" class="score-final" min="0" max="100" step="0.1" placeholder="0-100" value="${final}" oninput="calculateGWA()">
    </td>
    <td style="font-weight: 600; text-align: center;" class="subject-final-pct">-</td>
    <td style="font-weight: 700; text-align: center;" class="subject-isu-grade">-</td>
    <td style="text-align: center;">
      <button type="button" class="btn btn-danger" style="padding: 4px 8px; font-size: 0.8rem;" onclick="removeCourseRow('${rowId}')">
        Remove
      </button>
    </td>
  `;
  
  coursesTableBody.appendChild(tr);
  calculateGWA();
}

// Remove Course Row
function removeCourseRow(rowId) {
  const row = document.getElementById(rowId);
  if (row) {
    row.remove();
    calculateGWA();
  }
}

// Main Calculation Function
function calculateGWA() {
  const rows = coursesTableBody.querySelectorAll("tr");
  
  let totalWeightedGradePoints = 0;
  let totalUnits = 0;
  let hasFailedSubject = false;
  let validCoursesCount = 0;

  rows.forEach(row => {
    const unitsInput = row.querySelector(".course-units");
    const prelimInput = row.querySelector(".score-prelim");
    const midtermInput = row.querySelector(".score-midterm");
    const finalInput = row.querySelector(".score-final");

    const pctCell = row.querySelector(".subject-final-pct");
    const gradeCell = row.querySelector(".subject-isu-grade");

    const units = parseFloat(unitsInput.value) || 0;
    const prelim = parseFloat(prelimInput.value);
    const midterm = parseFloat(midtermInput.value);
    const finalExam = parseFloat(finalInput.value);

    // Calculate subject percentage if all 3 terms have valid inputs (Weights: Prelim 30%, Midterm 30%, Final 40%)
    if (!isNaN(prelim) && !isNaN(midterm) && !isNaN(finalExam) && units > 0) {
      const finalScorePct = (prelim * 0.30) + (midterm * 0.30) + (finalExam * 0.40);
      const gradeInfo = getISUGrade(finalScorePct);

      pctCell.textContent = finalScorePct.toFixed(2) + "%";
      gradeCell.textContent = gradeInfo.grade.toFixed(2);

      if (gradeInfo.grade === 5.00) {
        gradeCell.style.color = "var(--danger)";
        hasFailedSubject = true;
      } else {
        gradeCell.style.color = "var(--isu-green-dark)";
      }

      totalWeightedGradePoints += (gradeInfo.grade * units);
      totalUnits += units;
      validCoursesCount++;
    } else {
      pctCell.textContent = "-";
      gradeCell.textContent = "-";
      gradeCell.style.color = "inherit";
    }
  });

  // Display Total Units
  totalUnitsElem.textContent = totalUnits;

  // Calculate & Display Overall GWA
  if (totalUnits > 0 && validCoursesCount > 0) {
    const computedGWA = totalWeightedGradePoints / totalUnits;
    const formattedGWA = computedGWA.toFixed(2);
    gwaValueElem.textContent = formattedGWA;

    // Academic Honors / Distinction Assessment based on GWA & Failures
    let statusText = "Good Standing";
    let statusBadge = "badge-success";

    if (hasFailedSubject) {
      statusText = "With Failed Subject(s)";
      statusBadge = "badge-danger";
    } else if (computedGWA <= 1.20) {
      statusText = "President's Lister / Summa Cum Laude Candidate";
      statusBadge = "badge-success";
    } else if (computedGWA <= 1.45) {
      statusText = "Dean's Lister / Magna Cum Laude Candidate";
      statusBadge = "badge-success";
    } else if (computedGWA <= 1.75) {
      statusText = "Dean's Lister / Cum Laude Candidate";
      statusBadge = "badge-success";
    } else if (computedGWA > 3.00) {
      statusText = "Academic Deficiency";
      statusBadge = "badge-danger";
    }

    academicStatusElem.className = `badge ${statusBadge}`;
    academicStatusElem.textContent = statusText;
  } else {
    gwaValueElem.textContent = "0.00";
    academicStatusElem.className = "badge badge-warning";
    academicStatusElem.textContent = "Enter Grades";
  }
}
