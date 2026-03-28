const HARI_MBG = 1_200_000_000_000;
const MENIT_MBG = HARI_MBG / (24 * 60);
const DETIK_MBG = MENIT_MBG / 60;

export type Result = { title: string; copy: string };
export type ConvertResult = { compound: Result | null; decimals: Result[] };

function fmt(n: number, decimals = 6): string {
  return n.toLocaleString("id-ID", { maximumFractionDigits: decimals });
}

function toCompound(idr: number): string {
  const totalDetik = idr / DETIK_MBG;
  const hari = Math.floor(totalDetik / 86_400);
  const menit = Math.floor((totalDetik % 86_400) / 60);
  const detik = totalDetik % 60;

  const parts: string[] = [];
  if (hari > 0) parts.push(`${fmt(hari, 0)} Hari`);
  if (menit > 0 || (hari > 0 && detik > 0)) parts.push(`${fmt(menit, 0)} Menit`);
  if (detik > 0) parts.push(`${fmt(detik)} Detik`);

  return parts.join("; ") + " MBG";
}

export function convert(idr: number): ConvertResult {
  const compoundTitle = toCompound(idr);

  const decimals: Result[] = (
    [
      [idr / HARI_MBG, "Hari"],
      [idr / MENIT_MBG, "Menit"],
      [idr / DETIK_MBG, "Detik"],
    ] as [number, string][]
  ).flatMap(([val, unit]) => {
    const s = fmt(val);
    return s === "0" ? [] : [{ title: `${s} ${unit} MBG`, copy: s }];
  });

  const isDuplicate = decimals.some((r) => r.title === compoundTitle);
  const compound = isDuplicate ? null : { title: compoundTitle, copy: compoundTitle };

  return { compound, decimals };
}
