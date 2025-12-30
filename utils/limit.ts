const LIMIT = 3;

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