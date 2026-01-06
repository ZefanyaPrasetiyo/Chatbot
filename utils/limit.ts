const LIMIT = 3;
const LIMIT_DURATION = 1 * 60 * 60 * 1000;

function getLimitData() {
  const raw = localStorage.getItem("pertanyaan_tamu");

  if (!raw) {
    return { count: 0, startTime: Date.now() };
  }

  return JSON.parse(raw);
}

function resetIfExpired() {
  const data = getLimitData();

  if (Date.now() - data.startTime > LIMIT_DURATION) {
    const resetData = { count: 0, startTime: Date.now() };
    localStorage.setItem("pertanyaan_tamu", JSON.stringify(resetData));
    return resetData;
  }

  return data;
}


export function LimitUser() {
 return Number (localStorage.getItem("Pertanyaan_tamu") || "0");
}

export function jumlahLimitUser() { 
    const next = LimitUser() + 1;
    localStorage.setItem("Pertanyaan_tamu", String(next));
    return next;
}
 export function LimitTercapai() {
    return LimitUser() >= LIMIT;
}

export { LIMIT };