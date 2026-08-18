import { supabase } from "./supabaseClient.js";

const TABLE = "dashboard_data";

// Reemplaza a window.storage.get(key, shared) del entorno de Claude.
// Devuelve { value: string } o null, igual que la API original.
export async function getData(key) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("value")
    .eq("id", key)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return { value: JSON.stringify(data.value) };
}

// Reemplaza a window.storage.set(key, value, shared) del entorno de Claude.
export async function setData(key, value) {
  const { error } = await supabase
    .from(TABLE)
    .upsert({ id: key, value: JSON.parse(value) });

  if (error) throw error;
}
