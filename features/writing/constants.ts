import type { Direction, PassageLengthUnit } from "./types";

export const DIRECTION_TABS: {
  value: Direction;
  label: string;
  hint: string;
  flag: string;
}[] = [
  {
    value: "en_to_vi",
    label: "Anh → Việt",
    hint: "Đọc tiếng Anh, dịch sang tiếng Việt",
    flag: "🇬🇧→🇻🇳",
  },
  {
    value: "vi_to_en",
    label: "Việt → Anh",
    hint: "Đọc tiếng Việt, dịch sang tiếng Anh",
    flag: "🇻🇳→🇬🇧",
  },
];

export const LENGTH_LIMITS: Record<
  PassageLengthUnit,
  { min: number; max: number; step: number }
> = {
  chars: { min: 180, max: 1200, step: 20 },
  lines: { min: 2, max: 8, step: 1 },
};
