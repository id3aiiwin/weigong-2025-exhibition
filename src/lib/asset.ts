// 在 GitHub Pages（子路徑）部署時，public/ 內的資源需手動加上 basePath 前綴。
// 本機開發 NEXT_PUBLIC_BASE_PATH 未設定 → 維持原樣。
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path; // 外部網址不處理
  return `${BASE_PATH}${path}`;
}
