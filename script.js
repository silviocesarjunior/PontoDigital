document.addEventListener("DOMContentLoaded", function () {
  var clockElement = document.getElementById("clock");
  var entries = JSON.parse(localStorage.getItem("pontoEntries")) || [];
  var nameSection = document.getElementById("name-section");
  var nameInput = document.getElementById("name");
  var nameDisplay = document.getElementById("name-display");
  var nameText = document.getElementById("name-text");

  function updateClock() {
    var now = moment();
    clockElement.textContent = now.format("DD-MM-YYYY HH:mm:ss");
  }

  function showNameSection() {
    nameSection.style.display = "block";
  }

  function showNameDisplay() {
    nameDisplay.style.display = "block";
  }

  function registerName() {
    var name = nameInput.value.trim();
    if (name) {
      localStorage.setItem("pontoName", name);
      nameText.textContent = name;
      showNameDisplay();
    }
  }

  function clockIn() {
    var now = moment();
    entries.push({
      type: "Entrada",
      timestamp: now.format("DD-MM-YYYY HH:mm:ss"),
    });
    saveEntriesToLocalStorage();
    displayEntries();
  }

  function clockOut() {
    var now = moment();
    entries.push({
      type: "Saída",
      timestamp: now.format("DD-MM-YYYY HH:mm:ss"),
    });
    saveEntriesToLocalStorage();
    displayEntries();
  }

  function saveEntriesToLocalStorage() {
    localStorage.setItem("pontoEntries", JSON.stringify(entries));
  }

  function displayEntries() {
    var entriesElement = document.getElementById("entries");
    entriesElement.innerHTML = "";

    entries.forEach(function (entry) {
      var entryElement = document.createElement("li");
      entryElement.textContent = entry.type + ": " + entry.timestamp;
      entriesElement.appendChild(entryElement);
    });
  }

  function printReport() {
    var name = localStorage.getItem("pontoName");
    if (name) {
      var content = `
        <h1>Relatório de Ponto</h1>
        <h2>Nome: ${name}</h2>
        <ul>
          ${entries
            .map((entry) => `<li>${entry.type}: ${entry.timestamp}</li>`)
            .join("")}
        </ul>
      `;

      var options = {
        margin: [10, 10, 10, 10],
        filename: "relatorio_ponto.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { format: "a4", orientation: "portrait" },
      };

      html2pdf().set(options).from(content).save();
    } else {
      alert("Favor, informe seu nome antes de gerar o relatório.");
    }
  }

  var savedName = localStorage.getItem("pontoName");
  if (savedName) {
    nameText.textContent = savedName;
    showNameDisplay();
  } else {
    showNameSection();
  }

  document
    .getElementById("submit-name")
    .addEventListener("click", registerName);
  document.getElementById("clock-in").addEventListener("click", clockIn);
  document.getElementById("clock-out").addEventListener("click", clockOut);
  document
    .getElementById("print-report")
    .addEventListener("click", printReport);

  updateClock();
  displayEntries();
  setInterval(updateClock, 1000);
});
