import type { Step, StepImpl } from "../step";
import type { FlowStateDef, StepFlowData, StepFlowOutcome } from "./types";
import { getFlowPayload } from "./payload";

/**
 * 为 legacy 步骤（如 app-launch）创建 finishMethod：
 * 应用打开成功后跳回 StepFlow dispatcher 并切换到指定状态。
 */
export function createFinishHandoff(
    dispatcher: StepImpl,
    nextState: string
): StepImpl {
    return async (step: Step) => {
        const data = step.data as StepFlowData;
        if (!data.__flow) {
            data.__flow = { state: nextState };
        } else {
            data.__flow.state = nextState;
        }
        return step.next(dispatcher);
    };
}

/**
 * 创建 launch 类流程状态：写入 finishMethod 后委托执行 legacy StepImpl 链。
 */
export function createLaunchState(
    dispatcher: StepImpl,
    launchImpl: StepImpl,
    nextState: string,
    /** legacy 步骤从 step.data 读取的字段名（默认与 payload 键一致） */
    legacyDataKeys: string[] = ["appName", "packageName"]
): FlowStateDef {
    return {
        run: async (step): Promise<StepFlowOutcome> => {
            const payload = getFlowPayload(step);
            for (const key of legacyDataKeys) {
                if (payload[key] !== undefined) {
                    (step.data as StepFlowData)[key] = payload[key];
                }
            }
            (step.data as StepFlowData).finishMethod = createFinishHandoff(
                dispatcher,
                nextState
            );
            return { type: "legacy", impl: launchImpl };
        },
        on: {},
    };
}
