/* Cliente público de Supabase. En GitHub Pages usa solo la anon key, nunca service_role. */
const SUPABASE_URL = "https://hosbzzdvlfprzscfqxpv.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_msOZDwYhpUpNDEn2Dr7IXQ_p1GqnbF4";

let supabaseClient;
let ofertas = [];
const $ = (id) => document.getElementById(id);
const safe = (value, fallback = "—") => String(value ?? fallback).replace(/[&<>'\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const value = (item, fallback = "—") => item == null || item === "" ? fallback : item;
const date = (item) => {
  if (!item) return "—";
  const parsed = new Date(String(item).includes("T") ? item : `${item}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? String(item) : new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(parsed);
};
function message(id, content) { const el = $(id); if (el) el.innerHTML = `<div class="loading-message">${safe(content)}</div>`; }
function isConfigured() { return SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes("PEGA_AQUI"); }

document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabase) return message("offersContainer", "No se pudo cargar Supabase. Revisa tu conexión.");
  if (!isConfigured()) {
    message("offersContainer", "Falta configurar la clave pública de Supabase.");
    if ($("offersCount")) $("offersCount").textContent = "Configuración pendiente";
    return;
  }
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  ["btnBuscarOfertas", "searchOferta", "filterProgram", "filterModalidad"].forEach(id => $(id)?.addEventListener(id === "btnBuscarOfertas" ? "click" : id === "searchOferta" ? "input" : "change", filterOffers));
  // GitHub Pages es público. No cargamos datos académicos o personales sin autenticación.
  await Promise.all([loadPrograms(), loadOffers()]);
  tableMessage($("postulacionesContainer"), "Inicia sesión para consultar tus postulaciones.");
  message("entrevistasContainer", "Inicia sesión para consultar tus entrevistas.");
  message("practiceContainer", "Inicia sesión para consultar tu práctica.");
  message("documentsContainer", "Inicia sesión para consultar tus documentos.");
});

async function loadPrograms() {
  const {data, error} = await supabaseClient.from("programas").select("nombre").order("nombre");
  if (error) return console.error("Error programas:", error);
  const select = $("filterProgram");
  data.forEach(p => select?.insertAdjacentHTML("beforeend", `<option value="${safe(p.nombre, "")}">${safe(p.nombre, "")}</option>`));
}
async function loadOffers() {
  message("offersContainer", "Cargando ofertas...");
  const {data, error} = await supabaseClient.from("ofertas_practicas").select("*, empresas(nombre,ciudad), programas(nombre)").order("fecha_publicacion", {ascending:false});
  if (error) { console.error("Error ofertas:", error); return message("offersContainer", "No fue posible cargar las ofertas. Revisa las políticas RLS de Supabase."); }
  ofertas = data || []; filterOffers();
}
function filterOffers() {
  const search = $("searchOferta")?.value.trim().toLowerCase() || "";
  const program = $("filterProgram")?.value || "";
  const modality = $("filterModalidad")?.value || "";
  const result = ofertas.filter(o => (!search || [o.cargo,o.descripcion,o.empresas?.nombre].filter(Boolean).join(" ").toLowerCase().includes(search)) && (!program || o.programas?.nombre === program) && (!modality || o.modalidad === modality));
  const count = $("offersCount"); if (count) count.textContent = `${result.length} oferta${result.length === 1 ? "" : "s"} encontrada${result.length === 1 ? "" : "s"}`;
  const el = $("offersContainer"); if (!el) return;
  if (!result.length) return message("offersContainer", "No hay ofertas que coincidan con la búsqueda.");
  el.innerHTML = result.map(o => `<article class="offer-card"><span class="status status-open">${safe(value(o.estado,"Disponible"))}</span><h3>${safe(value(o.cargo,"Oferta de práctica"))}</h3><p><strong>Empresa:</strong> ${safe(value(o.empresas?.nombre,"Sin empresa"))}</p><p><strong>Programa:</strong> ${safe(value(o.programas?.nombre,"Sin programa"))}</p><p><strong>Ciudad:</strong> ${safe(value(o.empresas?.ciudad))}</p><p><strong>Modalidad:</strong> ${safe(value(o.modalidad))}</p><p>${safe(value(o.descripcion,"Sin descripción."))}</p></article>`).join("");
}
function tableMessage(el, text) { if (el) el.innerHTML = `<tr><td colspan="6">${safe(text)}</td></tr>`; }
