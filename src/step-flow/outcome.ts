import type { StepFlowOutcome } from "./types";

/** 产生流程事件，由当前状态的 on 表决定下一状态 */
export function flowEvent(name: string): StepFlowOutcome {
    return { type: "event", name };
}

/** 重复当前流程状态（沿用 Step.repeat 语义） */
export function flowRepeat(): StepFlowOutcome {
    return { type: "repeat" };
}

/** 结束整个流程 */
export function flowEnd(): StepFlowOutcome {
    return { type: "end" };
}
