export const CATEGORY_KEYS = [
  "food",
  "digital",
  "rent",
  "transport",
  "sideIncome",
  "salary",
  "other",
] as const;

export type CategoryKey = (typeof CATEGORY_KEYS)[number];

const legacyCategoryMap: Record<string, CategoryKey> = {
  "Food & Dining": "food",
  "Digital & Electronics": "digital",
  "Rent & Utilities": "rent",
  Transportation: "transport",
  "Side Income": "sideIncome",
  Salary: "salary",
  Other: "other",
  餐饮美食: "food",
  数码电子: "digital",
  房租水电: "rent",
  交通出行: "transport",
  副业收入: "sideIncome",
  工资: "salary",
  其他: "other",
  食費: "food",
  デジタル: "digital",
  "家賃・光熱費": "rent",
  交通費: "transport",
  副収入: "sideIncome",
  給与: "salary",
  その他: "other"
};

export function normalizeCategory(value: string): CategoryKey {
  if ((CATEGORY_KEYS as readonly string[]).includes(value)) {
    return value as CategoryKey;
  }

  return legacyCategoryMap[value] ?? "other";
}
