import type { Step, StepData } from "../step";
import type { StepFlowData } from "./types";

function asFlowData(step: Step): StepFlowData {
    return step.data as StepFlowData;
}

/** 读取业务 payload（不存在时返回空对象） */
export function getFlowPayload<T extends StepData = StepData>(step: Step): T {
    const data = asFlowData(step);
    const payload = data.payload;
    if (payload !== null && payload !== undefined && typeof payload === "object" && !Array.isArray(payload)) {
        return payload as T;
    }
    return {} as T;
}

/** 浅合并写入 payload */
export function assignFlowPayload(step: Step, partial: StepData): void {
    const data = asFlowData(step);
    const current = getFlowPayload(step);
    data.payload = { ...current, ...partial };
}
