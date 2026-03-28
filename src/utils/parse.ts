const UNITS: [RegExp, number][] = [
  [/^(trili{1,2}un|T)$/i, 1_000_000_000_000],
  [/^(miliar|milyar|M)$/i, 1_000_000_000],
  [/^(juta|jt)$/i, 1_000_000],
  [/^(ribu|rb|K)$/i, 1_000],
];

function multiplierFor(unit: string): number {
  for (const [pattern, value] of UNITS) {
    if (pattern.test(unit)) return value;
  }
  return 1;
}

function normaliseCoefficient(raw: string): number {
  const match = raw.match(/^(\d+)([.,])(\d+)$/);
  if (!match) return parseFloat(raw);

  const [, integer, , decimals] = match;
  if (decimals.length === 3) {
    // e.g. "1.200" → thousand grouping → 1200
    return parseFloat(integer + decimals);
  }
  // e.g. "1.2" or "1,5" → decimal
  return parseFloat(integer + "." + decimals);
}

export function parseIdr(input: string): number {
  const trimmed = input.trim();

  if (!/[a-zA-Z]/.test(trimmed)) {
    return parseFloat(trimmed.replace(/[,.\s]/g, ""));
  }

  const TOKEN = /([\d]+(?:[.,]\d+)?)\s*(trili{1,2}un|miliar|milyar|juta|jt|ribu|rb|[TMK])/gi;
  let total = 0;
  let matched = false;

  for (const match of trimmed.matchAll(TOKEN)) {
    const coefficient = normaliseCoefficient(match[1]);
    const multiplier = multiplierFor(match[2]);
    total += coefficient * multiplier;
    matched = true;
  }

  return matched ? total : NaN;
}
