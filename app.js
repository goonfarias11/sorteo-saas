const STORAGE_KEY = "sorteador-social:v1";

const form = document.querySelector("#raffleForm");
const titleInput = document.querySelector("#title");
const prizeInput = document.querySelector("#prize");
const postUrlInput = document.querySelector("#postUrl");
const participantsInput = document.querySelector("#participants");
const winnersInput = document.querySelector("#winnersCount");
const participantsCount = document.querySelector("#participantsCount");
const winnersTotal = document.querySelector("#winnersTotal");
const sourceLabel = document.querySelector("#sourceLabel");
const message = document.querySelector("#message");
const importButton = document.querySelector("#importButton");
const importStatus = document.querySelector("#importStatus");
const fileInput = document.querySelector("#fileInput");
const resetButton = document.querySelector("#resetButton");
const emptyResult = document.querySelector("#emptyResult");
const resultContent = document.querySelector("#resultContent");
const finishedBadge = document.querySelector("#finishedBadge");
const resultTitle = document.querySelector("#resultTitle");
const resultPrize = document.querySelector("#resultPrize");
const winnersList = document.querySelector("#winnersList");
const copyButton = document.querySelector("#copyButton");
const csvButton = document.querySelector("#csvButton");
const shareButton = document.querySelector("#shareButton");

let currentResult = null;

loadState();
updateCounters();
renderResult();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearMessage();

  try {
    currentResult = runRaffle({
      title: titleInput.value,
      prize: prizeInput.value,
      winnersCount: Number(winnersInput.value),
      participantsText: participantsInput.value,
    });

    saveState();
    renderResult();
  } catch (error) {
    currentResult = null;
    showMessage(error.message || "No se pudo ejecutar el sorteo.");
    renderResult();
    saveState();
  }
});

[titleInput, prizeInput, postUrlInput, participantsInput, winnersInput].forEach((field) => {
  field.addEventListener("input", () => {
    updateCounters();
    updateImportStatus();
    saveState();
  });
});

importButton.addEventListener("click", () => {
  const source = detectSource(postUrlInput.value);

  if (source === "unknown") {
    showMessage("Pega un link valido de Instagram o TikTok.");
    return;
  }

  showMessage(
    `Detecte una publicacion de ${source}. Para traer comentarios automaticamente hace falta conectar la API oficial con autenticacion. Mientras tanto, pega la exportacion de comentarios o importa un .csv/.txt.`,
  );
});

fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];

  if (!file) return;

  const text = await file.text();
  participantsInput.value = mergeParticipants(participantsInput.value, text);
  fileInput.value = "";
  updateCounters();
  saveState();
  showMessage("Archivo importado. Revise la lista antes de ejecutar el sorteo.");
});

resetButton.addEventListener("click", () => {
  titleInput.value = "";
  prizeInput.value = "";
  postUrlInput.value = "";
  participantsInput.value = "";
  winnersInput.value = "1";
  currentResult = null;
  localStorage.removeItem(STORAGE_KEY);
  clearMessage();
  updateCounters();
  updateImportStatus();
  renderResult();
});

copyButton.addEventListener("click", async () => {
  if (!currentResult) return;

  await navigator.clipboard.writeText(buildResultText());
  showMessage("Resultado copiado.");
});

shareButton.addEventListener("click", async () => {
  if (!currentResult) return;

  const text = buildResultText();

  if (navigator.share) {
    await navigator.share({ title: `Sorteo: ${titleInput.value}`, text });
    return;
  }

  await navigator.clipboard.writeText(text);
  showMessage("Tu navegador no permite compartir directo. Copie el resultado.");
});

csvButton.addEventListener("click", () => {
  if (!currentResult) return;

  const rows = [
    ["posicion", "ganador", "sorteo", "premio", "fecha"],
    ...currentResult.winners.map((winner) => [
      String(winner.position),
      winner.name,
      titleInput.value,
      prizeInput.value,
      currentResult.createdAt,
    ]),
  ];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${slugify(titleInput.value || "sorteo")}-ganadores.csv`;
  link.click();
  URL.revokeObjectURL(url);
});

function parseParticipants(value) {
  const seen = new Set();

  return value
    .split(/\r?\n/)
    .flatMap((line) => line.split(line.includes("@") ? /\s*,\s*/ : /\t|;/))
    .map(extractParticipantName)
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLocaleLowerCase("es");

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
}

function extractParticipantName(value) {
  const item = value.trim();

  if (!item) return "";

  const handle = item.match(/@[\w.]{2,30}/);

  if (handle) {
    return handle[0];
  }

  return item
    .split(/[:,]/)[0]
    .replace(/^"|"$/g, "")
    .trim();
}

function runRaffle(input) {
  const title = input.title.trim();
  const prize = input.prize.trim();
  const participants = parseParticipants(input.participantsText);

  if (!title) {
    throw new Error("Agrega un nombre para el sorteo.");
  }

  if (!prize) {
    throw new Error("Agrega el premio.");
  }

  if (participants.length === 0) {
    throw new Error("Carga al menos un participante.");
  }

  if (input.winnersCount < 1) {
    throw new Error("La cantidad de ganadores debe ser mayor a cero.");
  }

  if (input.winnersCount > participants.length) {
    throw new Error("No puede haber mas ganadores que participantes.");
  }

  const shuffled = [...participants];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = secureRandomInt(index + 1);
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return {
    winners: shuffled.slice(0, input.winnersCount).map((name, index) => ({
      position: index + 1,
      name,
    })),
    participants,
    createdAt: new Date().toISOString(),
  };
}

function secureRandomInt(maxExclusive) {
  if (!window.crypto?.getRandomValues) {
    return Math.floor(Math.random() * maxExclusive);
  }

  const range = 0x100000000;
  const limit = range - (range % maxExclusive);
  const buffer = new Uint32Array(1);

  do {
    window.crypto.getRandomValues(buffer);
  } while (buffer[0] >= limit);

  return buffer[0] % maxExclusive;
}

function updateCounters() {
  const participants = parseParticipants(participantsInput.value);
  const winners = Number(winnersInput.value) || 0;

  participantsCount.textContent = String(participants.length);
  winnersTotal.textContent = String(winners);
  sourceLabel.textContent = sourceName(detectSource(postUrlInput.value));
  winnersInput.max = String(Math.max(participants.length, 1));
}

function updateImportStatus() {
  const source = detectSource(postUrlInput.value);

  if (source === "unknown") {
    importStatus.textContent = "Podes pegar comentarios abajo o importar un archivo .txt/.csv.";
    return;
  }

  importStatus.textContent = `Link detectado: ${sourceName(source)}. La importacion automatica requiere API oficial.`;
}

function renderResult() {
  const hasResult = Boolean(currentResult);

  emptyResult.hidden = hasResult;
  resultContent.hidden = !hasResult;
  finishedBadge.hidden = !hasResult;
  winnersList.replaceChildren();

  if (!currentResult) {
    return;
  }

  resultTitle.textContent = titleInput.value;
  resultPrize.textContent = prizeInput.value;

  currentResult.winners.forEach((winner) => {
    const item = document.createElement("li");
    const position = document.createElement("span");
    const name = document.createElement("span");

    position.className = "winner-position";
    position.textContent = String(winner.position);
    name.textContent = winner.name;
    item.append(position, name);
    winnersList.append(item);
  });
}

function buildResultText() {
  const winners = currentResult.winners
    .map((winner) => `${winner.position}. ${winner.name}`)
    .join("\n");

  return `Resultado del sorteo: ${titleInput.value}
Premio: ${prizeInput.value}
Ganadores:
${winners}
Participantes: ${currentResult.participants.length}`;
}

function saveState() {
  const state = {
    title: titleInput.value,
    prize: prizeInput.value,
    postUrl: postUrlInput.value,
    winnersCount: Number(winnersInput.value) || 1,
    participantsText: participantsInput.value,
    result: currentResult,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return;
  }

  try {
    const state = JSON.parse(saved);
    titleInput.value = state.title || "";
    prizeInput.value = state.prize || "";
    postUrlInput.value = state.postUrl || "";
    winnersInput.value = String(state.winnersCount || 1);
    participantsInput.value = state.participantsText || "";
    currentResult = state.result || null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function detectSource(value) {
  const url = value.trim().toLowerCase();

  if (!url) return "manual";
  if (url.includes("instagram.com/")) return "instagram";
  if (url.includes("tiktok.com/")) return "tiktok";

  return "unknown";
}

function sourceName(source) {
  const names = {
    instagram: "Instagram",
    tiktok: "TikTok",
    manual: "Manual",
    unknown: "Sin detectar",
  };

  return names[source] || names.unknown;
}

function mergeParticipants(current, incoming) {
  return parseParticipants(`${current}\n${incoming}`).join("\n");
}

function showMessage(value) {
  message.textContent = value;
  message.classList.add("is-visible");
}

function clearMessage() {
  message.textContent = "";
  message.classList.remove("is-visible");
}

function csvCell(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
