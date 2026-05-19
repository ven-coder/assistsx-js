import { createPinia, getActivePinia, setActivePinia, type Pinia } from "pinia";

/**
 * 当宿主应用未执行 app.use(pinia) 时，为 assistsx-js 内部使用的 Pinia store 提供默认实例，
 * 避免 useStepStore 等在无 active Pinia 时抛错。
 */
let fallbackPinia: Pinia | null = null;

export function ensureAssistsXPinia(): void {
    if (getActivePinia() !== undefined) return;
    if (fallbackPinia === null) {
        fallbackPinia = createPinia();
    }
    setActivePinia(fallbackPinia);
}
