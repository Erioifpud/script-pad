export const cleanCSS = (css: string) => css
  .replace(/\s*:\s*root\s*\{/, '')
  .replace(/\s*}\s*/, '')
  .replace(/\/\/.*?\n|\/\*[\s\S]*?\*\//g, '')

  export const css2obj = (css: string) => {
  const r = /(?<=^|;)\s*([^:]+)\s*:\s*([^;]+)\s*/g;
  const o: Record<string, string> = {};
  css.replace(r, (_, p: string, v: string) => o[p] = v);
  return o;
};