import { VITE_THEME } from "$env/static/private";

export function load() {
  console.log("load +layout.server.ts");
  console.log("VITE_THEME", VITE_THEME);
  return {
    theme: VITE_THEME,
  };
}
