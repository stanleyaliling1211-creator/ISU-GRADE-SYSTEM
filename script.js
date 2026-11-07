class Student {
  constructor(name = '', studentId = '', age = '', campus = '', degree = '') {
    this.name = name;
    this.studentId = studentId;
    this.age = age;
    this.campus = campus;
    this.degree = degree;
  }
}

class Course {
  constructor(id, code, description, units, prelim, midterm, finalGrade, inputMode = 'percentage') {
    this.id = id;
    this.code = code;
    this.description = description;
    this.units = parseFloat(units) || 0;
    this.prelim = parseFloat(prelim) || 0;
    this.midterm = parseFloat(midterm) || 0;
    this.finalGrade = parseFloat(finalGrade) || 0;
    this.inputMode = inputMode;
  }

  calculateWeightedPercentage() {
    return (this.prelim * 0.30) + (this.midterm * 0.30) + (this.finalGrade * 0.40);
  }

  getISUGradeScale(pct) {
    if (pct >= 98) return 1.00;
    if (pct >= 95) return 1.25;
    if (pct >= 92) return 1.50;
    if (pct >= 89) return 1.75;
    if (pct >= 86) return 2.00;
    if (pct >= 83) return 2.25;
    if (pct >= 80) return 2.50;
    if (pct >= 77) return 2.75;
    if (pct >= 75) return 3.00;
    return 5.00;
  }

  getFinalGradeScale() {
    if (this.inputMode === 'scale') {
      return (this.prelim * 0.30) + (this.midterm * 0.30) + (this.finalGrade * 0.40);
    }
    const weightedPct = this.calculateWeightedPercentage();
    return this.getISUGradeScale(weightedPct);
  }

  getRemarks() {
    const scale = this.getFinalGradeScale();
    return scale <= 3.00 ? 'PASSED' : 'FAILED';
  }
}

class GWACalculatorApp {
  constructor() {
    this.student = new Student();
    this.courses = [];
    this.courseIdCounter = 1;

    this.initDOMReferences();
    this.bindEvents();
    this.addCourse();
  }

  initDOMReferences() {
    this.studentNameInput = document.getElementById('studentName');
    this.studentIdInput = document.getElementById('studentId');
    this.studentAgeInput = document.getElementById('studentAge');
    this.campusSelect = document.getElementById('campusSelect');
    this.degreeSelect = document.getElementById('degreeSelect');

    this.coursesContainer = document.getElementById('coursesContainer');
    this.addCourseBtn = document.getElementById('addCourseBtn');
    this.calculateBtn = document.getElementById('calculateBtn');
    this.resetBtn = document.getElementById('resetBtn');
    this.printBtn = document.getElementById('printBtn');

    this.gwaDisplay = document.getElementById('gwaDisplay');
    this.totalUnitsDisplay = document.getElementById('totalUnitsDisplay');
    this.academicStatusBadge = document.getElementById('academicStatusBadge');

    this.printName = document.getElementById('printName');
    this.printId = document.getElementById('printId');
    this.printCampus = document.getElementById('printCampus');
    this.printDegree = document.getElementById('printDegree');
    this.printAge = document.getElementById('printAge');
    this.printTableBody = document.getElementById('printTableBody');
    this.printGWA = document.getElementById('printGWA');
    this.printStatus = document.getElementById('printStatus');
  }

  bindEvents() {
    this.addCourseBtn.addEventListener('click', () => this.addCourse());
    this.calculateBtn.addEventListener('click', () => this.calculateAll());
    this.resetBtn.addEventListener('click', () => this.resetForm());
    this.printBtn.addEventListener('click', () => window.print());

    this.studentIdInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 2) {
        val = val.substring(0, 2) + '-' + val.substring(2, 7);
      }
      e.target.value = val;
    });
  }

  addCourse() {
    const id = this.courseIdCounter++;
    const courseCard = document.createElement('div');
    courseCard.className = 'course-item p-4 bg-gray-50 border border-gray-200 rounded-lg relative transition-all duration-200 hover:shadow-md';
    courseCard.dataset.id = id;

    courseCard.innerHTML = `
      <div class="flex justify-between items-center mb-3">
        <span class="font-bold text-emerald-800 text-sm tracking-wide">SUBJECT #${id}</span>
        <button type="button" class="remove-btn text-red-500 hover:text-red-700 font-bold text-sm flex items-center gap-1">
          &times; Remove
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-6 gap-3">
        <div class="md:col-span-2">
          <label class="block text-xs font-semibold text-gray-600 mb-1">Code & Title</label>
          <input type="text" class="course-code w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="e.g. IT 111">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Units</label>
          <input type="number" min="1" max="10" value="3" class="course-units w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-emerald-500 outline-none">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Prelim (30%)</label>
          <input type="number" step="0.01" class="course-prelim w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="0-100 or 1.0-5.0">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Midterm (30%)</label>
          <input type="number" step="0.01" class="course-midterm w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="0-100 or 1.0-5.0">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Finals (40%)</label>
          <input type="number" step="0.01" class="course-finals w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="0-100 or 1.0-5.0">
        </div>
      </div>
      <div class="mt-3 flex justify-between items-center pt-2 border-t border-gray-200 text-xs text-gray-600">
        <div>
          Input Mode: 
          <select class="input-mode bg-white border border-gray-300 rounded px-2 py-0.5 ml-1">
            <option value="percentage">Percentage Scale (0-100)</option>
            <option value="scale">ISU Grade Scale (1.00-5.00)</option>
          </select>
        </div>
        <div class="font-semibold text-emerald-900">
          Computed Grade: <span class="computed-grade text-sm font-bold text-emerald-700">--</span>
        </div>
      </div>
    `;

    courseCard.querySelector('.remove-btn').addEventListener('click', () => {
      courseCard.remove();
      this.calculateAll();
    });

    const inputs = courseCard.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('input', () => this.calculateAll());
    });

    this.coursesContainer.appendChild(courseCard);
  }

  collectStudentData() {
    this.student.name = this.studentNameInput.value.trim() || 'N/A';
    this.student.studentId = this.studentIdInput.value.trim() || 'N/A';
    this.student.age = this.studentAgeInput.value || 'N/A';
    this.student.campus = this.campusSelect.value || 'N/A';
    this.student.degree = this.degreeSelect.value || 'N/A';
  }

  collectCoursesData() {
    this.courses = [];
    const courseCards = this.coursesContainer.querySelectorAll('.course-item');

    courseCards.forEach(card => {
      const id = card.dataset.id;
      const code = card.querySelector('.course-code').value.trim() || `Subject #${id}`;
      const units = card.querySelector('.course-units').value;
      const prelim = card.querySelector('.course-prelim').value;
      const midterm = card.querySelector('.course-midterm').value;
      const finals = card.querySelector('.course-finals').value;
      const mode = card.querySelector('.input-mode').value;

      const course = new Course(id, code, '', units, prelim, midterm, finals, mode);
      this.courses.push(course);

      const computedSpan = card.querySelector('.computed-grade');
      const finalScaleGrade = course.getFinalGradeScale();
      computedSpan.textContent = finalScaleGrade ? finalScaleGrade.toFixed(2) : '--';
    });
  }

  calculateGWA() {
    let totalWeightedGrades = 0;
    let totalUnits = 0;

    this.courses.forEach(course => {
      const gradeScale = course.getFinalGradeScale();
      if (course.units > 0 && gradeScale > 0) {
        totalWeightedGrades += (gradeScale * course.units);
        totalUnits += course.units;
      }
    });

    const gwa = totalUnits > 0 ? (totalWeightedGrades / totalUnits) : 0;
    return { gwa, totalUnits };
  }

  getAcademicStanding(gwa) {
    if (gwa === 0) return { label: 'Pending Calculation', color: 'bg-gray-100 text-gray-700' };
    if (gwa <= 1.25) return { label: "President's Lister (Highest Honors)", color: 'bg-emerald-100 text-emerald-800' };
    if (gwa <= 1.75) return { label: "Dean's Lister (High Honors)", color: 'bg-blue-100 text-blue-800' };
    if (gwa <= 3.00) return { label: 'Good Standing (Passed)', color: 'bg-green-100 text-green-800' };
    return { label: 'Academic Warning / Failed', color: 'bg-red-100 text-red-800' };
  }

  calculateAll() {
    this.collectStudentData();
    this.collectCoursesData();

    const { gwa, totalUnits } = this.calculateGWA();
    const standing = this.getAcademicStanding(gwa);

    this.gwaDisplay.textContent = gwa > 0 ? gwa.toFixed(2) : '0.00';
    this.totalUnitsDisplay.textContent = totalUnits;
    this.academicStatusBadge.textContent = standing.label;
    this.academicStatusBadge.className = `inline-block px-3 py-1 rounded-full text-xs font-semibold ${standing.color}`;

    this.updatePrintPreview(gwa, standing.label);
  }

  updatePrintPreview(gwa, standingLabel) {
    this.printName.textContent = this.student.name;
    this.printId.textContent = this.student.studentId;
    this.printCampus.textContent = this.student.campus;
    this.printDegree.textContent = this.student.degree;
    this.printAge.textContent = this.student.age;

    this.printTableBody.innerHTML = '';
    this.courses.forEach(c => {
      const tr = document.createElement('tr');
      const finalScale = c.getFinalGradeScale().toFixed(2);
      const remark = c.getRemarks();

      tr.innerHTML = `
        <td class="py-2 px-3 border-b">${c.code}</td>
        <td class="py-2 px-3 border-b text-center">${c.units}</td>
        <td class="py-2 px-3 border-b text-center">${c.prelim}</td>
        <td class="py-2 px-3 border-b text-center">${c.midterm}</td>
        <td class="py-2 px-3 border-b text-center">${c.finalGrade}</td>
        <td class="py-2 px-3 border-b text-center font-bold">${finalScale}</td>
        <td class="py-2 px-3 border-b text-center font-semibold ${remark === 'PASSED' ? 'text-emerald-700' : 'text-red-600'}">${remark}</td>
      `;
      this.printTableBody.appendChild(tr);
    });

    this.printGWA.textContent = gwa > 0 ? gwa.toFixed(2) : '0.00';
    this.printStatus.textContent = standingLabel;
  }

  resetForm() {
    this.studentNameInput.value = '';
    this.studentIdInput.value = '';
    this.studentAgeInput.value = '';
    this.campusSelect.selectedIndex = 0;
    this.degreeSelect.selectedIndex = 0;

    this.coursesContainer.innerHTML = '';
    this.courseIdCounter = 1;
    this.addCourse();
    this.calculateAll();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.isuApp = new GWACalculatorApp();
});
