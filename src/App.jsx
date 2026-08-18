import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell
} from "recharts";
import {
  Target, Newspaper, TrendingUp, Share2, RefreshCw, Plus, Trash2,
  ChevronDown, ChevronRight, AlertTriangle, CheckCircle2, Circle
} from "lucide-react";
import { getData, setData as saveData } from "./storage.js";

// ---------- estilo / tokens ----------
const COLORS = {
  ink: "#1C2333",
  inkSoft: "#4A5268",
  bg: "#F5F3EE",
  card: "#FFFFFF",
  line: "#E4E1D8",
  teal: "#0F6E56",
  tealSoft: "#DCEFE9",
  coral: "#C4562E",
  coralSoft: "#F5E1D6",
  amber: "#B8842A",
  amberSoft: "#F5EAD3",
  red: "#A33A2D",
  redSoft: "#F3DED9",
  platform: {
    Instagram: "#C4562E",
    LinkedIn: "#0F6E56",
    TikTok: "#1C2333",
    "Twitter/X": "#4A5268",
    Facebook: "#B8842A",
  },
};

const FONT_DISPLAY = "'Space Grotesk', 'Arial Narrow', sans-serif";
const FONT_BODY = "'Inter', system-ui, sans-serif";
const FONT_MONO = "'IBM Plex Mono', 'Courier New', monospace";

// ---------- datos iniciales (semillados desde el Excel) ----------
const INITIAL = {
  meta: { lastUpdated: "2026-07-28" },
  historialProyectos: [],
  proyectos: [
    { id: "p1", nombre: "ATLANTICO 2026", tipo: "B2G", soporte: true, items: { toolkit: "✓", eventoIni: "✓", eventoCie: "—", flyers: "✓", afiches: "✓", habla: "✓", banner: "✓", otrasImp: "✓", redes: "✓", otrasAcc: "✓" }, presupuestoTotal: 0, presupuestoEjecutado: 0, compras: [], obs: "Se está organizando nueva ruta a finales de agosto con Enel y la gobernación, para grabación de contenidos y nota de prensa." },
    { id: "p2", nombre: "ANTIOQUIA 2026", tipo: "B2G", soporte: true, items: { toolkit: "✓", eventoIni: "✓", eventoCie: "—", flyers: "✓", afiches: "✓", habla: "✓", banner: "✓", otrasImp: "✓", redes: "✓", otrasAcc: "En proceso" }, presupuestoTotal: 0, presupuestoEjecutado: 0, compras: [], obs: "Instalado todo el material POP con éxito. Ya realizamos la primera publicación en RRSS." },
    { id: "p3", nombre: "TOLIMA 2026", tipo: "B2G", soporte: true, items: { toolkit: "✓", eventoIni: "✓", eventoCie: "—", flyers: "N/A", afiches: "N/A", habla: "N/A", banner: "✓", otrasImp: "N/A", redes: "En proceso", otrasAcc: "En proceso" }, presupuestoTotal: 0, presupuestoEjecutado: 0, compras: [], obs: "Evento ejecutado con éxito." },
    { id: "p4", nombre: "BARRANQUILLA 2026", tipo: "B2G", soporte: true, items: { toolkit: "✓", eventoIni: "✓", eventoCie: "—", flyers: "✓", afiches: "✓", habla: "✓", banner: "✓", otrasImp: "✓", redes: "✓", otrasAcc: "En proceso" }, presupuestoTotal: 0, presupuestoEjecutado: 0, compras: [], obs: "Se realizó el primer microevento con éxito. Se hará el segundo el miércoles 29 de julio." },
    { id: "p5", nombre: "MEDELLIN 2026", tipo: "B2G", soporte: true, items: { toolkit: "✓", eventoIni: "✓", eventoCie: "—", flyers: "✓", afiches: "✓", habla: "✓", banner: "✓", otrasImp: "✓", redes: "✓", otrasAcc: "En proceso" }, presupuestoTotal: 0, presupuestoEjecutado: 0, compras: [], obs: "Estamos en planeación del bootcamp." },
    { id: "p6", nombre: "CALI 2026", tipo: "B2G", soporte: true, items: { toolkit: "✓", eventoIni: "✓", eventoCie: "—", flyers: "—", afiches: "—", habla: "—", banner: "—", otrasImp: "—", redes: "—", otrasAcc: "—" }, presupuestoTotal: 0, presupuestoEjecutado: 0, compras: [], obs: "A la espera de aprobación del material POP." },
    { id: "p7", nombre: "FAEA", tipo: "B2B", soporte: false, items: { toolkit: "N/A", eventoIni: "N/A", eventoCie: "N/A", flyers: "N/A", afiches: "N/A", habla: "N/A", banner: "N/A", otrasImp: "N/A", redes: "En proceso", otrasAcc: "N/A" }, presupuestoTotal: 0, presupuestoEjecutado: 0, compras: [], obs: "" },
    { id: "p8", nombre: "IPE MEX", tipo: "B2B", soporte: true, items: { toolkit: "N/A", eventoIni: "✓", eventoCie: "N/A", flyers: "N/A", afiches: "N/A", habla: "N/A", banner: "N/A", otrasImp: "N/A", redes: "En proceso", otrasAcc: "N/A" }, presupuestoTotal: 0, presupuestoEjecutado: 0, compras: [], obs: "" },
    { id: "p9", nombre: "UNICEF PERÚ", tipo: "B2B", soporte: false, items: { toolkit: "N/A", eventoIni: "N/A", eventoCie: "N/A", flyers: "N/A", afiches: "N/A", habla: "N/A", banner: "N/A", otrasImp: "N/A", redes: "N/A", otrasAcc: "N/A" }, presupuestoTotal: 0, presupuestoEjecutado: 0, compras: [], obs: "" },
    { id: "p10", nombre: "MELI", tipo: "B2B", soporte: false, items: { toolkit: "N/A", eventoIni: "N/A", eventoCie: "N/A", flyers: "N/A", afiches: "N/A", habla: "N/A", banner: "N/A", otrasImp: "N/A", redes: "N/A", otrasAcc: "N/A" }, presupuestoTotal: 0, presupuestoEjecutado: 0, compras: [], obs: "" },
    { id: "p11", nombre: "IMPULSARED", tipo: "B2B", soporte: false, items: { toolkit: "N/A", eventoIni: "En proceso", eventoCie: "En proceso", flyers: "N/A", afiches: "N/A", habla: "N/A", banner: "N/A", otrasImp: "N/A", redes: "N/A", otrasAcc: "N/A" }, presupuestoTotal: 0, presupuestoEjecutado: 0, compras: [], obs: "" },
  ],
  medios: {
    metaAnual: 12,
    items: [
      { id: "m1", mes: "Marzo", tipo: "Prensa escrita", nombre: "COOPERCOM - Atlántico" },
      { id: "m2", mes: "Marzo", tipo: "Prensa escrita", nombre: "Nota Zona Cero - Barranquilla" },
      { id: "m3", mes: "Marzo", tipo: "Prensa escrita", nombre: "Nota El Heraldo - Atlántico" },
      { id: "m4", mes: "Marzo", tipo: "Prensa escrita", nombre: "Inversión educación 2025 - Antioquia" },
      { id: "m5", mes: "Pendiente", tipo: "TV / Radio", nombre: "Teleantioquia noticias" },
      { id: "m6", mes: "Pendiente", tipo: "Podcast", nombre: "Eafit podcast - Imaginar futuros" },
      { id: "m7", mes: "Pendiente", tipo: "Prensa escrita", nombre: "Entrevista en Heraldo" },
      { id: "m8", mes: "Mayo", tipo: "Redes sociales", nombre: "Nota en Mioriente - Antioquia" },
      { id: "m9", mes: "Mayo", tipo: "Redes sociales", nombre: "Nota en Mioriente - Antioquia" },
      { id: "m10", mes: "Mayo", tipo: "Prensa escrita", nombre: "Nota en Mioriente - Antioquia" },
      { id: "m11", mes: "Mayo", tipo: "Prensa escrita", nombre: "Nota en Mioriente - Antioquia" },
      { id: "m12", mes: "Mayo", tipo: "Redes sociales", nombre: "Nota en Laviborapica - Antioquia" },
    ],
  },
  demanda: {
    metaPipelinePct: 40,
    pipelineActualPct: 5,
    metaCitasMes: 12,
    citas: [
      { mes: "Enero", valor: 1 },
      { mes: "Febrero", valor: 3 },
      { mes: "Marzo", valor: 3 },
      { mes: "Abril", valor: 5 },
      { mes: "Mayo", valor: 2 },
      { mes: "Junio", valor: null },
      { mes: "Julio", valor: null },
      { mes: "Agosto", valor: null },
      { mes: "Septiembre", valor: null },
      { mes: "Octubre", valor: null },
      { mes: "Noviembre", valor: null },
    ],
    leads: { fundraising: [], comercial: [] },
  },
  redes: [
    { id: "r1", plataforma: "Instagram", semana: "Sem 1 - Abr 20", inicio: 49515, fin: 49515, publicaciones: null, leads: 1, alcance: null, interaccion: null },
    { id: "r2", plataforma: "LinkedIn", semana: "Sem 1", inicio: 18633, fin: 18633, publicaciones: null, leads: 1, alcance: null, interaccion: null },
    { id: "r3", plataforma: "TikTok", semana: "Sem 1", inicio: 2316, fin: 2316, publicaciones: null, leads: null, alcance: null, interaccion: null },
    { id: "r4", plataforma: "Twitter/X", semana: "Sem 1", inicio: 811, fin: 811, publicaciones: null, leads: null, alcance: null, interaccion: null },
    { id: "r5", plataforma: "Facebook", semana: "Sem 1", inicio: 49515, fin: 49515, publicaciones: null, leads: null, alcance: null, interaccion: null },
    { id: "r6", plataforma: "Instagram", semana: "Sem 2 - Abr 27", inicio: 49515, fin: 49491, publicaciones: null, leads: null, alcance: null, interaccion: null },
    { id: "r7", plataforma: "LinkedIn", semana: "Sem 2", inicio: 18633, fin: 18654, publicaciones: null, leads: null, alcance: null, interaccion: null },
    { id: "r8", plataforma: "TikTok", semana: "Sem 2", inicio: 2316, fin: 2316, publicaciones: null, leads: null, alcance: null, interaccion: null },
    { id: "r9", plataforma: "Twitter/X", semana: "Sem 2", inicio: 811, fin: 811, publicaciones: null, leads: null, alcance: null, interaccion: null },
    { id: "r10", plataforma: "Facebook", semana: "Sem 2", inicio: 49515, fin: 49515, publicaciones: null, leads: null, alcance: null, interaccion: null },
    { id: "r11", plataforma: "Instagram", semana: "Sem 3 - May 4", inicio: 49515, fin: 49457, publicaciones: null, leads: null, alcance: null, interaccion: null },
    { id: "r12", plataforma: "LinkedIn", semana: "Sem 3", inicio: 18633, fin: 18728, publicaciones: null, leads: null, alcance: null, interaccion: null },
    { id: "r13", plataforma: "TikTok", semana: "Sem 3", inicio: 2316, fin: 2316, publicaciones: null, leads: null, alcance: null, interaccion: null },
    { id: "r14", plataforma: "Twitter/X", semana: "Sem 3", inicio: 811, fin: 811, publicaciones: null, leads: null, alcance: null, interaccion: null },
    { id: "r15", plataforma: "Facebook", semana: "Sem 3", inicio: 49515, fin: 49515, publicaciones: null, leads: null, alcance: null, interaccion: null },
  ],
};

const PLATFORMS = ["Instagram", "LinkedIn", "TikTok", "Twitter/X", "Facebook"];
const TIPOS_MEDIO = ["Prensa escrita", "TV / Radio", "Podcast", "Redes sociales", "Evento"];

// cortes de semana fijos, cada 7 días, desde ahora hasta el 1 de diciembre 2026
const WEEKS = [
  "Semana 1 (4 ago - 10 ago)",
  "Semana 2 (11 ago - 17 ago)",
  "Semana 3 (18 ago - 24 ago)",
  "Semana 4 (25 ago - 31 ago)",
  "Semana 5 (1 sep - 7 sep)",
  "Semana 6 (8 sep - 14 sep)",
  "Semana 7 (15 sep - 21 sep)",
  "Semana 8 (22 sep - 28 sep)",
  "Semana 9 (29 sep - 5 oct)",
  "Semana 10 (6 oct - 12 oct)",
  "Semana 11 (13 oct - 19 oct)",
  "Semana 12 (20 oct - 26 oct)",
  "Semana 13 (27 oct - 2 nov)",
  "Semana 14 (3 nov - 9 nov)",
  "Semana 15 (10 nov - 16 nov)",
  "Semana 16 (17 nov - 23 nov)",
  "Semana 17 (24 nov - 30 nov)",
  "Semana 18 (1 dic - 7 dic)",
];

// etapas del seguimiento de leads (fundraising y comerciales)
const LEAD_STAGES = [
  { key: "enviado", label: "Enviado", dateField: "fechaEnvio", bg: "#EFEDE6", fg: COLORS.inkSoft },
  { key: "respondio", label: "Respondió", dateField: "fechaRespuesta", bg: COLORS.coralSoft, fg: COLORS.coral },
  { key: "negociacion", label: "En negociación", dateField: "fechaNegociacion", bg: COLORS.amberSoft, fg: COLORS.amber },
  { key: "cerrado", label: "Cerrado", dateField: "fechaCierre", bg: COLORS.tealSoft, fg: COLORS.teal },
];
function defaultLead() {
  return {
    id: uid("l"),
    nombre: "Nuevo lead",
    contacto: "",
    contactoInfo: "",
    estado: "enviado",
    fechaEnvio: new Date().toISOString().slice(0, 10),
    fechaRespuesta: null,
    fechaNegociacion: null,
    fechaCierre: null,
    resultado: null,
  };
}

// checklist de entregables por proyecto, igual a las columnas del Excel
const ITEM_DEFS = [
  { key: "toolkit", label: "Diseño de toolkit", cuenta: false, responsable: "Ange" },
  { key: "eventoIni", label: "Evento inicial", cuenta: true, responsable: "Gise" },
  { key: "eventoCie", label: "Evento cierre", cuenta: true, responsable: "Gise" },
  { key: "flyers", label: "Flyers", cuenta: true, responsable: "Gise" },
  { key: "afiches", label: "Afiches", cuenta: true, responsable: "Gise" },
  { key: "habla", label: "Habladores", cuenta: true, responsable: "Gise" },
  { key: "banner", label: "Banner", cuenta: true, responsable: "Gise" },
  { key: "otrasImp", label: "Otras impresiones", cuenta: true, responsable: "Gise" },
  { key: "redes", label: "Redes", cuenta: true, responsable: "Gise" },
  { key: "otrasAcc", label: "Otras acciones mktg", cuenta: true, responsable: "Maria Camila" },
];
const ITEM_STATES = ["—", "✓", "En proceso", "N/A"];
const ITEM_STATE_STYLE = {
  "✓": { bg: COLORS.tealSoft, fg: COLORS.teal },
  "En proceso": { bg: COLORS.amberSoft, fg: COLORS.amber },
  "—": { bg: COLORS.redSoft, fg: COLORS.red },
  "N/A": { bg: "#EFEDE6", fg: COLORS.inkSoft },
};
function nextItemState(s) {
  const i = ITEM_STATES.indexOf(s);
  return ITEM_STATES[(i + 1) % ITEM_STATES.length];
}
// avance automático: ítems marcados ✓ / total de ítems que cuentan (igual fórmula que el Excel)
function computeAvance(items) {
  if (!items) return 0;
  const contables = ITEM_DEFS.filter(d => d.cuenta);
  const checked = contables.filter(d => items[d.key] === "✓").length;
  return contables.length ? checked / contables.length : 0;
}
function defaultItems() {
  const obj = {};
  ITEM_DEFS.forEach(d => { obj[d.key] = "—"; });
  return obj;
}

function uid(prefix) {
  return prefix + Math.random().toString(36).slice(2, 9);
}

function pct(n) {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return `${Math.round(n * 100)}%`;
}

function fmt(n) {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return new Intl.NumberFormat("es-CO").format(n);
}

// ---------- estado / status helpers ----------
function statusFromRatio(ratio) {
  if (ratio === null || ratio === undefined || isNaN(ratio)) return "pendiente";
  if (ratio >= 1) return "ok";
  if (ratio >= 0.6) return "atencion";
  return "riesgo";
}

const STATUS_STYLE = {
  ok: { bg: COLORS.tealSoft, fg: COLORS.teal, label: "Al día", icon: CheckCircle2 },
  atencion: { bg: COLORS.amberSoft, fg: COLORS.amber, label: "Atención", icon: AlertTriangle },
  riesgo: { bg: COLORS.redSoft, fg: COLORS.red, label: "En riesgo", icon: AlertTriangle },
  pendiente: { bg: "#EFEDE6", fg: COLORS.inkSoft, label: "Pendiente", icon: Circle },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.pendiente;
  const Icon = s.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: s.bg, color: s.fg, borderRadius: 999,
      padding: "3px 10px", fontSize: 12, fontWeight: 500, whiteSpace: "nowrap",
    }}>
      <Icon size={12} strokeWidth={2.5} />
      {s.label}
    </span>
  );
}

function ProgressBar({ ratio, color = COLORS.teal, height = 8 }) {
  const w = Math.max(0, Math.min(1, ratio || 0)) * 100;
  return (
    <div style={{ background: COLORS.line, borderRadius: 999, height, width: "100%", overflow: "hidden" }}>
      <div style={{ background: color, height: "100%", width: `${w}%`, borderRadius: 999, transition: "width .4s ease" }} />
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{
      background: COLORS.card, borderRadius: 14, border: `1px solid ${COLORS.line}`,
      padding: 20, ...style,
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1, textTransform: "uppercase",
      color: COLORS.inkSoft, marginBottom: 10,
    }}>
      {children}
    </div>
  );
}

// asegura que los datos cargados (posiblemente de una versión anterior) tengan
// la forma que la app espera, para que nunca truene por campos faltantes
function normalizarData(raw) {
  const base = INITIAL;
  const merged = { ...base, ...raw };
  merged.proyectos = (raw?.proyectos && raw.proyectos.length ? raw.proyectos : base.proyectos).map(p => ({
    ...p,
    items: p.items && Object.keys(p.items).length ? p.items : defaultItems(),
    presupuestoTotal: typeof p.presupuestoTotal === "number" ? p.presupuestoTotal : 0,
    presupuestoEjecutado: typeof p.presupuestoEjecutado === "number" ? p.presupuestoEjecutado : 0,
    compras: Array.isArray(p.compras) ? p.compras : [],
  }));
  merged.historialProyectos = raw?.historialProyectos || [];
  merged.medios = raw?.medios || base.medios;
  merged.demanda = raw?.demanda || base.demanda;
  merged.demanda.leads = {
    fundraising: (merged.demanda.leads?.fundraising || []).map(l => ({ contacto: "", contactoInfo: "", ...l })),
    comercial: (merged.demanda.leads?.comercial || []).map(l => ({ contacto: "", contactoInfo: "", ...l })),
  };
  merged.redes = raw?.redes || base.redes;
  return merged;
}

// ---------- app principal ----------
export default function App() {
  const [data, setData] = useState(INITIAL);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("resumen");
  const [saving, setSaving] = useState(false);
  const saveTimerRef = React.useRef(null);
  const pendingRef = React.useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getData("dashboard-data");
        if (mounted && res && res.value) {
          setData(normalizarData(JSON.parse(res.value)));
        }
      } catch (e) {
        // no hay datos guardados aún, usamos INITIAL
      }
      if (mounted) setLoaded(true);
    })();
    return () => { mounted = false; };
  }, []);

  // Actualiza la pantalla al instante, pero solo manda UNA escritura a la base de
  // datos después de que el usuario deje de teclear/hacer cambios por 600ms.
  // Esto evita que dos guardados casi simultáneos lleguen desordenados y uno
  // viejo sobreescriba a uno más nuevo (lo que hacía que "se borraran" cambios).
  const save = useCallback((next) => {
    setData(next);
    pendingRef.current = next;
    setSaving(true);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const toSave = pendingRef.current;
      saveData("dashboard-data", JSON.stringify(toSave))
        .catch(() => {})
        .finally(() => setSaving(false));
    }, 600);
  }, []);

  // ---------- cálculos derivados ----------
  const stats = useMemo(() => {
    const proyectos = data.proyectos;
    const activos = proyectos.length;
    const conSoporte = proyectos.filter(p => p.soporte).length;
    const cobertura = activos ? conSoporte / activos : 0;
    const promEntregas = activos ? proyectos.reduce((a, p) => a + computeAvance(p.items), 0) / activos : 0;
    const porTipo = { B2G: 0, B2B: 0, Fundraising: 0 };
    proyectos.forEach(p => { porTipo[p.tipo] = (porTipo[p.tipo] || 0) + 1; });

    const apariciones = data.medios.items.filter(m => m.mes !== "Pendiente").length;
    const metaMedios = data.medios.metaAnual;
    const medioRatio = metaMedios ? apariciones / metaMedios : 0;

    const pipelineRatio = data.demanda.metaPipelinePct ? data.demanda.pipelineActualPct / data.demanda.metaPipelinePct : 0;
    const citasConValor = data.demanda.citas.filter(c => c.valor !== null && c.valor !== undefined);
    const promCitas = citasConValor.length ? citasConValor.reduce((a, c) => a + c.valor, 0) / citasConValor.length : 0;
    const citasRatio = data.demanda.metaCitasMes ? promCitas / data.demanda.metaCitasMes : 0;

    const obj1Ratio = (cobertura + promEntregas) / 2;
    const obj2Ratio = medioRatio;
    const obj3Ratio = (pipelineRatio + citasRatio) / 2;

    const ponderado = obj1Ratio * 0.4 + obj2Ratio * 0.3 + obj3Ratio * 0.3;

    return {
      activos, conSoporte, cobertura, promEntregas, porTipo,
      apariciones, metaMedios, medioRatio,
      pipelineRatio, promCitas, citasRatio,
      obj1Ratio, obj2Ratio, obj3Ratio, ponderado,
    };
  }, [data]);

  const redesInsights = useMemo(() => buildRedesInsights(data.redes), [data.redes]);

  if (!loaded) {
    return (
      <div style={{ fontFamily: FONT_BODY, padding: 40, color: COLORS.inkSoft, textAlign: "center" }}>
        Cargando dashboard…
      </div>
    );
  }

  const TABS = [
    { id: "resumen", label: "Resumen", icon: Target },
    { id: "proyectos", label: "Proyectos", icon: CheckCircle2 },
    { id: "medios", label: "Medios", icon: Newspaper },
    { id: "demanda", label: "Demanda", icon: TrendingUp },
    { id: "redes", label: "Redes sociales", icon: Share2 },
  ];

  return (
    <div style={{
      fontFamily: FONT_BODY, background: COLORS.bg, minHeight: 400,
      padding: "0 0 32px", color: COLORS.ink,
    }}>
      {/* header */}
      <div style={{ padding: "24px 24px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: COLORS.coral, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
              Equipo de marketing · 2026
            </div>
            <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 600, margin: 0, letterSpacing: -0.5 }}>
              Dashboard de objetivos
            </h1>
          </div>
          <div style={{ textAlign: "right", fontSize: 12, color: COLORS.inkSoft }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
              <RefreshCw size={12} className={saving ? "spin" : ""} style={{ opacity: saving ? 1 : 0.4 }} />
              {saving ? "Guardando…" : "Guardado"}
            </div>
            <div>Datos compartidos con el equipo</div>
          </div>
        </div>
      </div>

      {/* tabs */}
      <div style={{ display: "flex", gap: 4, padding: "0 24px", borderBottom: `1px solid ${COLORS.line}`, overflowX: "auto" }}>
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "10px 14px", border: "none", background: "none",
                borderBottom: active ? `2px solid ${COLORS.coral}` : "2px solid transparent",
                color: active ? COLORS.ink : COLORS.inkSoft,
                fontWeight: active ? 500 : 400, fontSize: 13.5, cursor: "pointer",
                whiteSpace: "nowrap", fontFamily: FONT_BODY,
              }}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      <div style={{ padding: 24 }}>
        {tab === "resumen" && <Resumen stats={stats} data={data} redesInsights={redesInsights} />}
        {tab === "proyectos" && <Proyectos data={data} save={save} stats={stats} />}
        {tab === "medios" && <Medios data={data} save={save} stats={stats} />}
        {tab === "demanda" && <Demanda data={data} save={save} stats={stats} />}
        {tab === "redes" && <Redes data={data} save={save} insights={redesInsights} />}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        input, select, textarea { font-family: ${FONT_BODY}; }
      `}</style>
    </div>
  );
}

// ---------- RESUMEN ----------
function Resumen({ stats, data, redesInsights }) {
  const objetivos = [
    { nombre: "Habilitación comercial", peso: 40, ratio: stats.obj1Ratio, detalle: `${stats.conSoporte}/${stats.activos} proyectos con soporte · ${pct(stats.promEntregas)} entregas promedio` },
    { nombre: "Posicionamiento de marca", peso: 30, ratio: stats.obj2Ratio, detalle: `${stats.apariciones}/${stats.metaMedios} apariciones en medios` },
    { nombre: "Demanda y aliados", peso: 30, ratio: stats.obj3Ratio, detalle: `Pipeline ${stats.pipelineRatio ? pct(stats.pipelineRatio) : "—"} de meta · ${stats.promCitas.toFixed(1)} citas/mes promedio` },
  ];

  const barData = objetivos.map(o => ({ name: o.nombre, avance: Math.round(o.ratio * 100) }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card style={{ background: COLORS.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, opacity: 0.6, letterSpacing: 1 }}>AVANCE GENERAL PONDERADO</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 44, fontWeight: 600 }}>{pct(stats.ponderado)}</div>
        </div>
        <div style={{ width: 260 }}>
          <ProgressBar ratio={stats.ponderado} color="#fff" height={10} />
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        {objetivos.map((o, i) => {
          const status = statusFromRatio(o.ratio);
          return (
            <Card key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <SectionLabel>Objetivo {i + 1} · peso {o.peso}%</SectionLabel>
                  <div style={{ fontWeight: 500, fontSize: 15 }}>{o.nombre}</div>
                </div>
                <StatusBadge status={status} />
              </div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 30, marginBottom: 8 }}>{pct(o.ratio)}</div>
              <ProgressBar ratio={o.ratio} color={status === "riesgo" ? COLORS.red : status === "atencion" ? COLORS.amber : COLORS.teal} />
              <div style={{ fontSize: 12.5, color: COLORS.inkSoft, marginTop: 10 }}>{o.detalle}</div>
            </Card>
          );
        })}
      </div>

      <Card>
        <SectionLabel>Comparativo de objetivos</SectionLabel>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} margin={{ top: 8, right: 8, left: -12, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.line} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: COLORS.inkSoft }} />
            <YAxis tick={{ fontSize: 11, fill: COLORS.inkSoft }} domain={[0, 100]} />
            <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${COLORS.line}` }} />
            <Bar dataKey="avance" radius={[6, 6, 0, 0]}>
              {barData.map((d, i) => (
                <Cell key={i} fill={d.avance >= 100 ? COLORS.teal : d.avance >= 60 ? COLORS.amber : COLORS.red} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {redesInsights.length > 0 && (
        <Card>
          <SectionLabel>Alertas e insights automáticos</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {redesInsights.map((ins, i) => (
              <div key={i} style={{
                display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13,
                padding: "8px 0", borderBottom: i < redesInsights.length - 1 ? `1px solid ${COLORS.line}` : "none",
              }}>
                <span style={{ marginTop: 2 }}>{ins.tone === "up" ? "▲" : ins.tone === "down" ? "▼" : "•"}</span>
                <span style={{ color: COLORS.inkSoft }}>{ins.text}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ---------- PROYECTOS ----------
function fechaCorta() {
  return new Date().toLocaleString("es-CO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function Proyectos({ data, save, stats }) {
  const [filtro, setFiltro] = useState("Todos");
  const [expanded, setExpanded] = useState({});
  const [compraForms, setCompraForms] = useState({});
  const proyectos = data.proyectos.filter(p => filtro === "Todos" || p.tipo === filtro);
  const historial = data.historialProyectos || [];

  // update: aplica cambios y, si cambia el avance (derivado de los ítems) o el soporte, deja registro en el histórico
  const update = (id, patch, opts = {}) => {
    const proyecto = data.proyectos.find(p => p.id === id);
    const nuevosProyectos = data.proyectos.map(p => p.id === id ? { ...p, ...patch } : p);
    let nuevoHistorial = historial;
    if (proyecto && !opts.skipHistorial) {
      const entradas = [];
      if (patch.items) {
        const oldAvance = computeAvance(proyecto.items);
        const newAvance = computeAvance(patch.items);
        if (oldAvance !== newAvance) {
          entradas.push({
            id: uid("h"), proyectoId: id, proyectoNombre: proyecto.nombre,
            campo: "avance", valorAnterior: oldAvance, valorNuevo: newAvance,
            ts: Date.now(), fecha: fechaCorta(),
          });
        }
      }
      if (patch.soporte !== undefined && patch.soporte !== proyecto.soporte) {
        entradas.push({
          id: uid("h"), proyectoId: id, proyectoNombre: proyecto.nombre,
          campo: "soporte", valorAnterior: proyecto.soporte, valorNuevo: patch.soporte,
          ts: Date.now(), fecha: fechaCorta(),
        });
      }
      if (entradas.length) nuevoHistorial = [...historial, ...entradas];
    }
    save({ ...data, proyectos: nuevosProyectos, historialProyectos: nuevoHistorial });
  };

  const toggleItem = (proyecto, key) => {
    const items = proyecto.items || defaultItems();
    const newItems = { ...items, [key]: nextItemState(items[key]) };
    update(proyecto.id, { items: newItems });
  };

  const getCompraForm = (id) => compraForms[id] || { descripcion: "", monto: "", fecha: new Date().toISOString().slice(0, 10), link: "" };
  const setCompraForm = (id, patch) => setCompraForms(f => ({ ...f, [id]: { ...getCompraForm(id), ...patch } }));

  const addCompra = (proyecto) => {
    const form = getCompraForm(proyecto.id);
    if (!form.descripcion || !form.monto) return;
    const compra = { id: uid("c"), descripcion: form.descripcion, monto: Number(form.monto), fecha: form.fecha, link: form.link || "" };
    const nuevosProyectos = data.proyectos.map(pr => pr.id === proyecto.id ? { ...pr, compras: [...(pr.compras || []), compra] } : pr);
    save({ ...data, proyectos: nuevosProyectos });
    setCompraForm(proyecto.id, { descripcion: "", monto: "", fecha: form.fecha, link: "" });
  };

  const removeCompra = (proyectoId, compraId) => {
    const nuevosProyectos = data.proyectos.map(pr => pr.id === proyectoId ? { ...pr, compras: (pr.compras || []).filter(c => c.id !== compraId) } : pr);
    save({ ...data, proyectos: nuevosProyectos });
  };

  const addProyecto = () => {
    const next = { ...data, proyectos: [...data.proyectos, { id: uid("p"), nombre: "Nuevo proyecto", tipo: "B2G", soporte: false, items: defaultItems(), presupuestoTotal: 0, presupuestoEjecutado: 0, compras: [], obs: "" }] };
    save(next);
  };

  const removeProyecto = (id) => {
    save({ ...data, proyectos: data.proyectos.filter(p => p.id !== id), historialProyectos: historial.filter(h => h.proyectoId !== id) });
  };

  const toggleExpand = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const actividadReciente = historial.slice().sort((a, b) => b.ts - a.ts).slice(0, 6);

  const tipoChartData = ["B2G", "B2B", "Fundraising"].map(t => ({
    name: t, cantidad: data.proyectos.filter(p => p.tipo === t).length,
  }));

  const cargaPorResponsable = useMemo(() => {
    const map = {};
    data.proyectos.forEach(p => {
      const items = p.items || defaultItems();
      ITEM_DEFS.forEach(def => {
        const val = items[def.key];
        if (val === "N/A") return;
        if (!map[def.responsable]) map[def.responsable] = { pendientes: 0, enProceso: 0, hechos: 0 };
        if (val === "✓") map[def.responsable].hechos++;
        else if (val === "En proceso") map[def.responsable].enProceso++;
        else map[def.responsable].pendientes++;
      });
    });
    return map;
  }, [data.proyectos]);

  const presupuesto = useMemo(() => {
    const total = data.proyectos.reduce((a, p) => a + (p.presupuestoTotal || 0), 0);
    const ejecutado = data.proyectos.reduce((a, p) => a + (p.compras || []).reduce((s, c) => s + (c.monto || 0), 0), 0);
    return { total, ejecutado, ratio: total ? ejecutado / total : 0 };
  }, [data.proyectos]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <MiniStat label="Proyectos activos" value={stats.activos} />
        <MiniStat label="Con soporte marketing" value={stats.conSoporte} />
        <MiniStat label="Cobertura" value={pct(stats.cobertura)} />
        <MiniStat label="Entregas promedio" value={pct(stats.promEntregas)} />
      </div>

      <Card>
        <SectionLabel>Presupuesto de todos los proyectos</SectionLabel>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 11.5, color: COLORS.inkSoft }}>Presupuesto total</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 600 }}>${fmt(presupuesto.total)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11.5, color: COLORS.inkSoft }}>Ejecutado</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 600 }}>${fmt(presupuesto.ejecutado)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11.5, color: COLORS.inkSoft }}>% ejecutado</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 600 }}>{pct(presupuesto.ratio)}</div>
          </div>
        </div>
        <ProgressBar ratio={presupuesto.ratio} color={presupuesto.ejecutado > presupuesto.total ? COLORS.red : COLORS.teal} height={10} />
      </Card>

      {actividadReciente.length > 0 && (
        <Card>
          <SectionLabel>Actividad reciente</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {actividadReciente.map(h => (
              <div key={h.id} style={{ fontSize: 12.5, color: COLORS.inkSoft, display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span>
                  <strong style={{ color: COLORS.ink, fontWeight: 500 }}>{h.proyectoNombre}</strong>
                  {" · "}
                  {h.campo === "avance"
                    ? `avance ${pct(h.valorAnterior)} → ${pct(h.valorNuevo)}`
                    : `soporte ${h.valorAnterior ? "sí" : "no"} → ${h.valorNuevo ? "sí" : "no"}`}
                </span>
                <span style={{ fontFamily: FONT_MONO, fontSize: 11, whiteSpace: "nowrap" }}>{h.fecha}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <SectionLabel>Carga de entregables por responsable</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          {Object.entries(cargaPorResponsable).map(([nombre, c]) => (
            <div key={nombre} style={{ border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 12 }}>
              <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 6 }}>{nombre}</div>
              <div style={{ fontSize: 12, color: COLORS.teal }}>{c.hechos} hechos</div>
              <div style={{ fontSize: 12, color: COLORS.amber }}>{c.enProceso} en proceso</div>
              <div style={{ fontSize: 12, color: COLORS.red }}>{c.pendientes} pendientes</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionLabel>Distribución por tipo</SectionLabel>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={tipoChartData} layout="vertical" margin={{ left: 10 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: COLORS.inkSoft }} width={80} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${COLORS.line}` }} />
            <Bar dataKey="cantidad" fill={COLORS.teal} radius={[0, 6, 6, 0]} barSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <SectionLabel>Listado de proyectos</SectionLabel>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select value={filtro} onChange={e => setFiltro(e.target.value)} style={selectStyle}>
              {["Todos", "B2G", "B2B", "Fundraising"].map(t => <option key={t}>{t}</option>)}
            </select>
            <button onClick={addProyecto} style={btnPrimary}><Plus size={14} /> Añadir</button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {proyectos.map(p => {
            const isExpanded = !!expanded[p.id];
            const pItems = p.items || defaultItems();
            const avance = computeAvance(pItems);
            const pCompras = p.compras || [];
            const ejecutado = pCompras.reduce((a, c) => a + (c.monto || 0), 0);
            const compraForm = getCompraForm(p.id);
            const historialProyecto = historial.filter(h => h.proyectoId === p.id).sort((a, b) => b.ts - a.ts);
            return (
              <div key={p.id} style={{ border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 14 }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 8 }}>
                  <button onClick={() => toggleExpand(p.id)} style={btnGhost} aria-label={isExpanded ? "Ocultar histórico" : "Ver histórico"}>
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  <input
                    value={p.nombre}
                    onChange={e => update(p.id, { nombre: e.target.value }, { skipHistorial: true })}
                    style={{ ...inputStyle, fontWeight: 500, flex: "1 1 160px", minWidth: 140 }}
                  />
                  <select value={p.tipo} onChange={e => update(p.id, { tipo: e.target.value }, { skipHistorial: true })} style={selectStyle}>
                    {["B2G", "B2B", "Fundraising"].map(t => <option key={t}>{t}</option>)}
                  </select>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: COLORS.inkSoft }}>
                    <input type="checkbox" checked={p.soporte} onChange={e => update(p.id, { soporte: e.target.checked })} />
                    Soporte marketing
                  </label>
                  <button onClick={() => removeProyecto(p.id)} style={btnGhost} aria-label="Eliminar proyecto">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: COLORS.inkSoft, width: 60 }}>Avance</span>
                  <div style={{ flex: 1 }}>
                    <ProgressBar ratio={avance} color={statusFromRatio(avance) === "riesgo" ? COLORS.red : statusFromRatio(avance) === "atencion" ? COLORS.amber : COLORS.teal} />
                  </div>
                  <span style={{ fontSize: 12.5, fontFamily: FONT_MONO, width: 42, textAlign: "right" }}>{pct(avance)}</span>
                </div>

                <div style={{ fontSize: 11, color: COLORS.inkSoft, marginBottom: 6 }}>Entregables · clic para cambiar estado</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                  {ITEM_DEFS.map(def => {
                    const val = pItems[def.key];
                    const s = ITEM_STATE_STYLE[val] || ITEM_STATE_STYLE["—"];
                    return (
                      <button
                        key={def.key}
                        onClick={() => toggleItem(p, def.key)}
                        title={def.label}
                        style={{
                          display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2,
                          background: s.bg, color: s.fg, border: "none", borderRadius: 8,
                          padding: "6px 10px", cursor: "pointer", fontSize: 11.5, fontFamily: FONT_BODY,
                          minWidth: 92, textAlign: "left",
                        }}
                      >
                        <span style={{ fontWeight: 500, fontSize: 11 }}>{def.label}</span>
                        <span style={{ fontFamily: FONT_MONO, fontSize: 12 }}>{val}</span>
                        <span style={{ fontSize: 10, opacity: 0.75 }}>{def.responsable}</span>
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 10 }}>
                  <Field label="Presupuesto total">
                    <input
                      type="number"
                      value={p.presupuestoTotal}
                      onChange={e => update(p.id, { presupuestoTotal: Number(e.target.value) }, { skipHistorial: true })}
                      style={{ ...inputStyle, width: 140, fontFamily: FONT_MONO }}
                    />
                  </Field>
                  <Field label="Ejecutado (según compras)">
                    <div style={{ ...inputStyle, width: 140, fontFamily: FONT_MONO, background: COLORS.bg }}>
                      ${fmt(ejecutado)}
                    </div>
                  </Field>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ fontSize: 11, color: COLORS.inkSoft, marginBottom: 4 }}>% ejecutado</div>
                    <ProgressBar
                      ratio={p.presupuestoTotal ? ejecutado / p.presupuestoTotal : 0}
                      color={p.presupuestoTotal && ejecutado > p.presupuestoTotal ? COLORS.red : COLORS.teal}
                    />
                    <div style={{ fontSize: 11.5, color: COLORS.inkSoft, marginTop: 4 }}>
                      ${fmt(ejecutado)} de ${fmt(p.presupuestoTotal)}
                      {p.presupuestoTotal ? ` (${pct(ejecutado / p.presupuestoTotal)})` : ""}
                    </div>
                  </div>
                </div>

                <textarea
                  value={p.obs}
                  onChange={e => update(p.id, { obs: e.target.value }, { skipHistorial: true })}
                  placeholder="Observaciones y notas…"
                  style={{ ...inputStyle, width: "100%", minHeight: 44, resize: "vertical", fontSize: 12.5 }}
                />
                {isExpanded && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${COLORS.line}` }}>
                    <div style={{ fontSize: 11.5, color: COLORS.inkSoft, marginBottom: 6 }}>Compras registradas</div>
                    {pCompras.length === 0 ? (
                      <div style={{ fontSize: 12.5, color: COLORS.inkSoft, marginBottom: 10 }}>Aún no hay compras registradas para este proyecto.</div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 10 }}>
                        {pCompras.slice().reverse().map(c => (
                          <div key={c.id} style={{ fontSize: 12.5, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                            <span style={{ color: COLORS.ink }}>
                              {c.descripcion}
                              {c.link && (
                                <a href={c.link} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8, color: COLORS.teal, textDecoration: "underline", fontSize: 11.5 }}>
                                  ver cotización
                                </a>
                              )}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
                              <span style={{ fontFamily: FONT_MONO, fontSize: 12 }}>${fmt(c.monto)}</span>
                              <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: COLORS.inkSoft }}>{c.fecha}</span>
                              <button onClick={() => removeCompra(p.id, c.id)} style={btnGhost} aria-label="Eliminar compra"><Trash2 size={13} /></button>
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                      <input
                        value={compraForm.descripcion}
                        onChange={e => setCompraForm(p.id, { descripcion: e.target.value })}
                        placeholder="Descripción de la compra"
                        style={{ ...inputStyle, flex: "1 1 160px", minWidth: 140 }}
                      />
                      <input
                        type="number"
                        value={compraForm.monto}
                        onChange={e => setCompraForm(p.id, { monto: e.target.value })}
                        placeholder="Monto"
                        style={{ ...inputStyle, width: 110, fontFamily: FONT_MONO }}
                      />
                      <input
                        type="date"
                        value={compraForm.fecha}
                        onChange={e => setCompraForm(p.id, { fecha: e.target.value })}
                        style={{ ...inputStyle, width: 140 }}
                      />
                      <input
                        value={compraForm.link}
                        onChange={e => setCompraForm(p.id, { link: e.target.value })}
                        placeholder="Link de cotización (opcional)"
                        style={{ ...inputStyle, flex: "1 1 200px", minWidth: 160 }}
                      />
                      <button onClick={() => addCompra(p)} style={btnPrimary}><Plus size={14} /> Agregar</button>
                    </div>

                    <div style={{ fontSize: 11.5, color: COLORS.inkSoft, marginBottom: 6 }}>Histórico de este proyecto</div>
                    {historialProyecto.length === 0 ? (
                      <div style={{ fontSize: 12.5, color: COLORS.inkSoft }}>Aún no hay cambios registrados. Se guardan automáticamente cuando cambies un entregable o el soporte.</div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        {historialProyecto.map(h => (
                          <div key={h.id} style={{ fontSize: 12, display: "flex", justifyContent: "space-between", gap: 8 }}>
                            <span style={{ color: COLORS.inkSoft }}>
                              {h.campo === "avance"
                                ? `Avance: ${pct(h.valorAnterior)} → ${pct(h.valorNuevo)}`
                                : `Soporte: ${h.valorAnterior ? "sí" : "no"} → ${h.valorNuevo ? "sí" : "no"}`}
                            </span>
                            <span style={{ fontFamily: FONT_MONO, fontSize: 11, whiteSpace: "nowrap" }}>{h.fecha}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {proyectos.length === 0 && <div style={{ color: COLORS.inkSoft, fontSize: 13 }}>No hay proyectos en este filtro.</div>}
        </div>
      </Card>
    </div>
  );
}

// ---------- MEDIOS ----------
function Medios({ data, save, stats }) {
  const items = data.medios.items;

  const addItem = () => {
    const next = { ...data, medios: { ...data.medios, items: [...items, { id: uid("m"), mes: "Pendiente", tipo: "Prensa escrita", nombre: "" }] } };
    save(next);
  };
  const updateItem = (id, patch) => {
    save({ ...data, medios: { ...data.medios, items: items.map(m => m.id === id ? { ...m, ...patch } : m) } });
  };
  const removeItem = (id) => {
    save({ ...data, medios: { ...data.medios, items: items.filter(m => m.id !== id) } });
  };
  const updateMeta = (v) => {
    save({ ...data, medios: { ...data.medios, metaAnual: Number(v) } });
  };

  const porTipo = TIPOS_MEDIO.map(t => ({ name: t, cantidad: items.filter(m => m.tipo === t).length })).filter(d => d.cantidad > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <MiniStat label="Apariciones registradas" value={stats.apariciones} />
        <MiniStat label="Meta anual" value={
          <input type="number" value={data.medios.metaAnual} onChange={e => updateMeta(e.target.value)} style={{ ...inputStyle, width: 60, fontFamily: FONT_MONO }} />
        } />
        <MiniStat label="Avance vs meta" value={pct(stats.medioRatio)} />
        <MiniStat label="Pendientes" value={items.filter(m => m.mes === "Pendiente").length} />
      </div>

      <Card>
        <SectionLabel>Progreso hacia la meta anual</SectionLabel>
        <ProgressBar ratio={stats.medioRatio} color={statusFromRatio(stats.medioRatio) === "riesgo" ? COLORS.red : COLORS.teal} height={12} />
        <div style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 6 }}>{stats.apariciones} / {data.medios.metaAnual} apariciones</div>
      </Card>

      {porTipo.length > 0 && (
        <Card>
          <SectionLabel>Apariciones por tipo</SectionLabel>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={porTipo}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: COLORS.inkSoft }} />
              <YAxis tick={{ fontSize: 11, fill: COLORS.inkSoft }} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${COLORS.line}` }} />
              <Bar dataKey="cantidad" fill={COLORS.coral} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <SectionLabel>Registro de apariciones</SectionLabel>
          <button onClick={addItem} style={btnPrimary}><Plus size={14} /> Añadir</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map(m => (
            <div key={m.id} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", borderBottom: `1px solid ${COLORS.line}`, paddingBottom: 8 }}>
              <input value={m.mes} onChange={e => updateItem(m.id, { mes: e.target.value })} placeholder="Mes" style={{ ...inputStyle, width: 100 }} />
              <select value={m.tipo} onChange={e => updateItem(m.id, { tipo: e.target.value })} style={selectStyle}>
                {TIPOS_MEDIO.map(t => <option key={t}>{t}</option>)}
              </select>
              <input value={m.nombre} onChange={e => updateItem(m.id, { nombre: e.target.value })} placeholder="Medio / escenario" style={{ ...inputStyle, flex: 1, minWidth: 160 }} />
              <button onClick={() => removeItem(m.id)} style={btnGhost} aria-label="Eliminar"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ---------- DEMANDA ----------
function Demanda({ data, save, stats }) {
  const d = data.demanda;
  const leads = d.leads || { fundraising: [], comercial: [] };

  const updateField = (patch) => save({ ...data, demanda: { ...d, ...patch } });
  const updateCita = (mes, valor) => {
    const citas = d.citas.map(c => c.mes === mes ? { ...c, valor: valor === "" ? null : Number(valor) } : c);
    save({ ...data, demanda: { ...d, citas } });
  };

  const addLead = (categoria) => {
    const nuevosLeads = { ...leads, [categoria]: [...(leads[categoria] || []), defaultLead()] };
    save({ ...data, demanda: { ...d, leads: nuevosLeads } });
  };
  const updateLead = (categoria, id, patch) => {
    const nuevosLeads = { ...leads, [categoria]: leads[categoria].map(l => l.id === id ? { ...l, ...patch } : l) };
    save({ ...data, demanda: { ...d, leads: nuevosLeads } });
  };
  const removeLead = (categoria, id) => {
    const nuevosLeads = { ...leads, [categoria]: leads[categoria].filter(l => l.id !== id) };
    save({ ...data, demanda: { ...d, leads: nuevosLeads } });
  };
  const avanzarLead = (categoria, lead) => {
    const idx = LEAD_STAGES.findIndex(s => s.key === lead.estado);
    if (idx < 0 || idx >= LEAD_STAGES.length - 1) return;
    const next = LEAD_STAGES[idx + 1];
    updateLead(categoria, lead.id, { estado: next.key, [next.dateField]: new Date().toISOString().slice(0, 10) });
  };
  const marcarPerdido = (categoria, lead) => {
    updateLead(categoria, lead.id, { estado: "cerrado", resultado: "perdido", fechaCierre: new Date().toISOString().slice(0, 10) });
  };
  // permite saltar directo a cualquier etapa (útil para cargar leads que ya
  // avanzaron o se cerraron en meses anteriores). Si esa etapa no tiene fecha
  // todavía, le pone la de hoy como punto de partida, editable después.
  const setEtapa = (categoria, lead, nuevaEtapaKey) => {
    const stage = LEAD_STAGES.find(s => s.key === nuevaEtapaKey);
    const patch = { estado: nuevaEtapaKey };
    if (stage && !lead[stage.dateField]) {
      patch[stage.dateField] = new Date().toISOString().slice(0, 10);
    }
    updateLead(categoria, lead.id, patch);
  };

  const chartData = d.citas.map(c => ({ mes: c.mes.slice(0, 3), citas: c.valor }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        <Card>
          <SectionLabel>% pipeline originado en marketing</SectionLabel>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="number" value={d.pipelineActualPct} onChange={e => updateField({ pipelineActualPct: Number(e.target.value) })} style={{ ...inputStyle, width: 70, fontFamily: FONT_MONO, fontSize: 20 }} />
            <span style={{ color: COLORS.inkSoft, fontSize: 13 }}>de meta {d.metaPipelinePct}%</span>
          </div>
          <div style={{ marginTop: 10 }}><ProgressBar ratio={stats.pipelineRatio} color={statusFromRatio(stats.pipelineRatio) === "riesgo" ? COLORS.red : COLORS.teal} /></div>
        </Card>
        <MiniStat label="Meta citas / mes" value={
          <input type="number" value={d.metaCitasMes} onChange={e => updateField({ metaCitasMes: Number(e.target.value) })} style={{ ...inputStyle, width: 60, fontFamily: FONT_MONO }} />
        } />
        <MiniStat label="Promedio citas/mes" value={stats.promCitas.toFixed(1)} />
        <MiniStat label="Avance vs meta citas" value={pct(stats.citasRatio)} />
      </div>

      <LeadBoard titulo="Fundraising" categoria="fundraising" leads={leads.fundraising} addLead={addLead} updateLead={updateLead} removeLead={removeLead} avanzarLead={avanzarLead} marcarPerdido={marcarPerdido} setEtapa={setEtapa} />
      <LeadBoard titulo="Leads comerciales" categoria="comercial" leads={leads.comercial} addLead={addLead} updateLead={updateLead} removeLead={removeLead} avanzarLead={avanzarLead} marcarPerdido={marcarPerdido} setEtapa={setEtapa} />

      <Card>
        <SectionLabel>Citas con nuevos clientes por mes</SectionLabel>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.line} vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: COLORS.inkSoft }} />
            <YAxis tick={{ fontSize: 11, fill: COLORS.inkSoft }} allowDecimals={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${COLORS.line}` }} />
            <Bar dataKey="citas" radius={[6, 6, 0, 0]}>
              {chartData.map((c, i) => (
                <Cell key={i} fill={c.citas == null ? COLORS.line : c.citas >= d.metaCitasMes ? COLORS.teal : COLORS.red} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <SectionLabel>Editar citas por mes</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
          {d.citas.map(c => (
            <div key={c.mes}>
              <div style={{ fontSize: 11.5, color: COLORS.inkSoft, marginBottom: 4 }}>{c.mes}</div>
              <input
                type="number" value={c.valor ?? ""} placeholder="—"
                onChange={e => updateCita(c.mes, e.target.value)}
                style={{ ...inputStyle, width: "100%", fontFamily: FONT_MONO }}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// tablero tipo kanban para seguir leads de fundraising o comerciales
function LeadBoard({ titulo, categoria, leads, addLead, updateLead, removeLead, avanzarLead, marcarPerdido, setEtapa }) {
  const [expandedLeads, setExpandedLeads] = useState({});
  const toggleExpand = (id) => setExpandedLeads(e => ({ ...e, [id]: !e[id] }));

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <SectionLabel>{titulo}</SectionLabel>
        <button onClick={() => addLead(categoria)} style={btnPrimary}><Plus size={14} /> Agregar lead</button>
      </div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
        {LEAD_STAGES.map(stage => {
          const leadsEnEtapa = leads.filter(l => l.estado === stage.key);
          return (
            <div key={stage.key} style={{ minWidth: 240, flex: "1 1 240px" }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: stage.bg, color: stage.fg, borderRadius: 8, padding: "6px 10px", marginBottom: 8,
              }}>
                <span style={{ fontSize: 12, fontWeight: 500 }}>{stage.label}</span>
                <span style={{ fontFamily: FONT_MONO, fontSize: 12 }}>{leadsEnEtapa.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {leadsEnEtapa.map(lead => {
                  const isExpanded = !!expandedLeads[lead.id];
                  return (
                    <div key={lead.id} style={{ border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: 10, background: COLORS.card }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 4, marginBottom: 6 }}>
                        <button onClick={() => toggleExpand(lead.id)} style={{ ...btnGhost, padding: 2 }} aria-label={isExpanded ? "Ocultar detalle" : "Ver detalle"}>
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                        <input
                          value={lead.nombre}
                          onChange={e => updateLead(categoria, lead.id, { nombre: e.target.value })}
                          style={{ ...inputStyle, fontWeight: 500, fontSize: 12.5, flex: 1, minWidth: 0 }}
                        />
                        <button onClick={() => removeLead(categoria, lead.id)} style={btnGhost} aria-label="Eliminar lead"><Trash2 size={13} /></button>
                      </div>

                      {lead.contacto && !isExpanded && (
                        <div style={{ fontSize: 11, color: COLORS.inkSoft, marginBottom: 6 }}>{lead.contacto}</div>
                      )}

                      {!isExpanded && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 8 }}>
                          {LEAD_STAGES.filter(s => lead[s.dateField]).map(s => (
                            <div key={s.key} style={{ fontSize: 10.5, color: COLORS.inkSoft, display: "flex", justifyContent: "space-between" }}>
                              <span>{s.label}</span>
                              <span style={{ fontFamily: FONT_MONO }}>{lead[s.dateField]}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {isExpanded && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
                          <Field label="Nombre de contacto">
                            <input
                              value={lead.contacto}
                              onChange={e => updateLead(categoria, lead.id, { contacto: e.target.value })}
                              placeholder="Ej: Ana Pérez"
                              style={{ ...inputStyle, width: "100%", fontSize: 12 }}
                            />
                          </Field>
                          <Field label="Teléfono o email">
                            <input
                              value={lead.contactoInfo}
                              onChange={e => updateLead(categoria, lead.id, { contactoInfo: e.target.value })}
                              placeholder="Ej: ana@correo.com"
                              style={{ ...inputStyle, width: "100%", fontSize: 12 }}
                            />
                          </Field>
                          <Field label="Etapa actual">
                            <select
                              value={lead.estado}
                              onChange={e => setEtapa(categoria, lead, e.target.value)}
                              style={{ ...selectStyle, width: "100%" }}
                            >
                              {LEAD_STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                            </select>
                          </Field>
                          {LEAD_STAGES.map(s => (
                            <Field key={s.key} label={`Fecha: ${s.label}`}>
                              <input
                                type="date"
                                value={lead[s.dateField] || ""}
                                onChange={e => updateLead(categoria, lead.id, { [s.dateField]: e.target.value || null })}
                                style={{ ...inputStyle, width: "100%", fontFamily: FONT_MONO, fontSize: 12 }}
                              />
                            </Field>
                          ))}
                        </div>
                      )}

                      {lead.estado === "cerrado" ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => updateLead(categoria, lead.id, { resultado: "ganado" })}
                            style={{ ...btnGhost, flex: 1, background: lead.resultado === "ganado" ? COLORS.tealSoft : COLORS.bg, color: lead.resultado === "ganado" ? COLORS.teal : COLORS.inkSoft, borderRadius: 6, fontSize: 11, padding: "4px 6px" }}
                          >
                            Ganado
                          </button>
                          <button
                            onClick={() => updateLead(categoria, lead.id, { resultado: "perdido" })}
                            style={{ ...btnGhost, flex: 1, background: lead.resultado === "perdido" ? COLORS.redSoft : COLORS.bg, color: lead.resultado === "perdido" ? COLORS.red : COLORS.inkSoft, borderRadius: 6, fontSize: 11, padding: "4px 6px" }}
                          >
                            Perdido
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <button onClick={() => avanzarLead(categoria, lead)} style={{ ...btnPrimary, width: "100%", justifyContent: "center", fontSize: 11.5, padding: "6px 8px" }}>
                            Avanzar a {LEAD_STAGES[LEAD_STAGES.findIndex(s => s.key === lead.estado) + 1]?.label} →
                          </button>
                          <button onClick={() => marcarPerdido(categoria, lead)} style={{ ...btnGhost, width: "100%", justifyContent: "center", fontSize: 11, color: COLORS.red }}>
                            Marcar como perdido
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {leadsEnEtapa.length === 0 && (
                  <div style={{ fontSize: 11.5, color: COLORS.inkSoft, fontStyle: "italic" }}>Sin leads en esta etapa</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ---------- REDES SOCIALES ----------
function buildRedesInsights(redes) {
  const insights = [];
  PLATFORMS.forEach(plat => {
    const rows = redes.filter(r => r.plataforma === plat);
    if (rows.length < 2) return;
    const last = rows[rows.length - 1];
    const prev = rows[rows.length - 2];
    const deltaLast = last.fin - last.inicio;
    const deltaPrev = prev.fin - prev.inicio;
    if (deltaLast < 0 && deltaPrev < 0) {
      insights.push({ tone: "down", text: `${plat} perdió seguidores dos semanas seguidas (${deltaPrev} y ${deltaLast}).` });
    } else if (deltaLast > 0 && rows.every(r => (r.fin - r.inicio) >= 0)) {
      insights.push({ tone: "up", text: `${plat} lleva crecimiento sostenido, sin semanas negativas registradas.` });
    }
  });
  // plataforma con mejor crecimiento acumulado
  const growth = PLATFORMS.map(plat => {
    const rows = redes.filter(r => r.plataforma === plat);
    if (!rows.length) return null;
    const total = rows[rows.length - 1].fin - rows[0].inicio;
    return { plat, total };
  }).filter(Boolean);
  if (growth.length) {
    const best = growth.reduce((a, b) => (b.total > a.total ? b : a));
    if (best.total > 0) insights.push({ tone: "up", text: `${best.plat} es la plataforma con mejor crecimiento acumulado (+${fmt(best.total)} seguidores).` });
  }
  return insights;
}

function Redes({ data, save, insights }) {
  const redes = data.redes;
  const [form, setForm] = useState({ plataforma: "Instagram", semana: WEEKS[0], inicio: "", fin: "", publicaciones: "", leads: "", alcance: "", interaccion: "" });

  const addEntry = () => {
    if (!form.semana || form.inicio === "" || form.fin === "") return;
    const entry = {
      id: uid("r"), plataforma: form.plataforma, semana: form.semana,
      inicio: Number(form.inicio), fin: Number(form.fin),
      publicaciones: form.publicaciones === "" ? null : Number(form.publicaciones),
      leads: form.leads === "" ? null : Number(form.leads),
      alcance: form.alcance === "" ? null : Number(form.alcance),
      interaccion: form.interaccion === "" ? null : Number(form.interaccion),
    };
    save({ ...data, redes: [...redes, entry] });
    const idx = WEEKS.indexOf(form.semana);
    const siguienteSemana = idx >= 0 && idx < WEEKS.length - 1 ? WEEKS[idx + 1] : form.semana;
    setForm({ ...form, semana: siguienteSemana, inicio: "", fin: "", publicaciones: "", leads: "", alcance: "", interaccion: "" });
  };

  const removeEntry = (id) => save({ ...data, redes: redes.filter(r => r.id !== id) });

  const [chartPlat, setChartPlat] = useState("Instagram");
  const chartData = redes.filter(r => r.plataforma === chartPlat).map((r, i) => ({ semana: (r.semana || `S${i + 1}`).match(/^Semana \d+/)?.[0] || r.semana, seguidores: r.fin }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {insights.length > 0 && (
        <Card>
          <SectionLabel>Insights automáticos</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {insights.map((ins, i) => (
              <div key={i} style={{ fontSize: 13, color: COLORS.inkSoft, display: "flex", gap: 8 }}>
                <span>{ins.tone === "up" ? "▲" : "▼"}</span>{ins.text}
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <SectionLabel>Evolución de seguidores</SectionLabel>
          <select value={chartPlat} onChange={e => setChartPlat(e.target.value)} style={selectStyle}>
            {PLATFORMS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.line} vertical={false} />
            <XAxis dataKey="semana" tick={{ fontSize: 10, fill: COLORS.inkSoft }} />
            <YAxis tick={{ fontSize: 11, fill: COLORS.inkSoft }} domain={["auto", "auto"]} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${COLORS.line}` }} />
            <Line type="monotone" dataKey="seguidores" stroke={COLORS.platform[chartPlat]} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <SectionLabel>Registrar semana</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, marginBottom: 12 }}>
          <Field label="Plataforma">
            <select value={form.plataforma} onChange={e => setForm({ ...form, plataforma: e.target.value })} style={{ ...selectStyle, width: "100%" }}>
              {PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Semana"><select value={form.semana} onChange={e => setForm({ ...form, semana: e.target.value })} style={{ ...selectStyle, width: "100%" }}>{WEEKS.map(w => <option key={w}>{w}</option>)}</select></Field>
          <Field label="Publicaciones"><input type="number" value={form.publicaciones} onChange={e => setForm({ ...form, publicaciones: e.target.value })} style={{ ...inputStyle, width: "100%" }} /></Field>
          <Field label="Seguidores inicio"><input type="number" value={form.inicio} onChange={e => setForm({ ...form, inicio: e.target.value })} style={{ ...inputStyle, width: "100%" }} /></Field>
          <Field label="Seguidores fin"><input type="number" value={form.fin} onChange={e => setForm({ ...form, fin: e.target.value })} style={{ ...inputStyle, width: "100%" }} /></Field>
          <Field label="Leads inbox"><input type="number" value={form.leads} onChange={e => setForm({ ...form, leads: e.target.value })} style={{ ...inputStyle, width: "100%" }} /></Field>
          <Field label="Alcance prom/post"><input type="number" value={form.alcance} onChange={e => setForm({ ...form, alcance: e.target.value })} style={{ ...inputStyle, width: "100%" }} /></Field>
          <Field label="Interacción %"><input type="number" value={form.interaccion} onChange={e => setForm({ ...form, interaccion: e.target.value })} style={{ ...inputStyle, width: "100%" }} /></Field>
        </div>
        <button onClick={addEntry} style={btnPrimary}><Plus size={14} /> Guardar semana</button>
      </Card>

      <Card style={{ overflowX: "auto" }}>
        <SectionLabel>Historial</SectionLabel>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ textAlign: "left", color: COLORS.inkSoft, borderBottom: `1px solid ${COLORS.line}` }}>
              {["Plataforma", "Semana", "Inicio", "Fin", "Δ", "Leads", "Alcance", "Interacción", ""].map(h => (
                <th key={h} style={{ padding: "6px 8px", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {redes.slice().reverse().map(r => {
              const delta = r.fin - r.inicio;
              return (
                <tr key={r.id} style={{ borderBottom: `1px solid ${COLORS.line}` }}>
                  <td style={{ padding: "6px 8px" }}>
                    <span style={{ color: COLORS.platform[r.plataforma], fontWeight: 500 }}>{r.plataforma}</span>
                  </td>
                  <td style={{ padding: "6px 8px" }}>{r.semana}</td>
                  <td style={{ padding: "6px 8px", fontFamily: FONT_MONO }}>{fmt(r.inicio)}</td>
                  <td style={{ padding: "6px 8px", fontFamily: FONT_MONO }}>{fmt(r.fin)}</td>
                  <td style={{ padding: "6px 8px", fontFamily: FONT_MONO, color: delta > 0 ? COLORS.teal : delta < 0 ? COLORS.red : COLORS.inkSoft }}>
                    {delta > 0 ? "+" : ""}{fmt(delta)}
                  </td>
                  <td style={{ padding: "6px 8px" }}>{fmt(r.leads)}</td>
                  <td style={{ padding: "6px 8px" }}>{fmt(r.alcance)}</td>
                  <td style={{ padding: "6px 8px" }}>{r.interaccion != null ? `${r.interaccion}%` : "—"}</td>
                  <td style={{ padding: "6px 8px" }}>
                    <button onClick={() => removeEntry(r.id)} style={btnGhost} aria-label="Eliminar registro"><Trash2 size={13} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ---------- componentes utilitarios ----------
function MiniStat({ label, value }) {
  return (
    <Card style={{ padding: 16 }}>
      <div style={{ fontSize: 11.5, color: COLORS.inkSoft, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 600 }}>{value}</div>
    </Card>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 11.5, color: COLORS.inkSoft, marginBottom: 4 }}>{label}</div>
      {children}
    </div>
  );
}

const inputStyle = {
  border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "6px 10px",
  fontSize: 13, color: COLORS.ink, background: "#fff",
};
const selectStyle = { ...inputStyle };
const btnPrimary = {
  display: "inline-flex", alignItems: "center", gap: 6,
  background: COLORS.ink, color: "#fff", border: "none", borderRadius: 8,
  padding: "8px 14px", fontSize: 13, cursor: "pointer", fontWeight: 500,
};
const btnGhost = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  background: "none", border: "none", color: COLORS.inkSoft, cursor: "pointer", padding: 4,
};
