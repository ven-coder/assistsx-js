import { Step, type StepImpl } from "../step";
import { StepError } from "../step-error";
import type { StepFlowConfig, StepFlowData, StepFlowOutcome } from "./types";

function ensureFlowMeta(step: Step, config: StepFlowConfig): void {
    const data = step.data as StepFlowData;
    if (!data.__flow) {
        data.__flow = { id: config.id, state: config.initial };
    }
}

function setFlowState(step: Step, state: string, config: StepFlowConfig): void {
    const data = step.data as StepFlowData;
    if (!data.__flow) {
        data.__flow = { id: config.id, state };
    } else {
        data.__flow.state = state;
    }
}

function resolveOutcome(
    config: StepFlowConfig,
    currentState: string,
    outcome: StepFlowOutcome
): string | null | undefined | "legacy" {
    if (outcome.type === "end") {
        return undefined;
    }
    if (outcome.type === "repeat") {
        return null;
    }
    if (outcome.type === "legacy") {
        return "legacy";
    }
    const stateDef = config.states[currentState];
    if (!stateDef) {
        throw new StepError(`StepFlow: unknown state "${currentState}"`, {
            flowId: config.id,
            state: currentState,
        });
    }
    const nextState = stateDef.on[outcome.name];
    if (!nextState) {
        throw new StepError(
            `StepFlow: no transition for event "${outcome.name}" in state "${currentState}"`,
            { flowId: config.id, state: currentState, event: outcome.name }
        );
    }
    return nextState;
}

function createDispatcher(config: StepFlowConfig): StepImpl {
    const dispatcher: StepImpl = async (step) => {
        ensureFlowMeta(step, config);
        const data = step.data as StepFlowData;
        const currentState = data.__flow!.state;
        const stateDef = config.states[currentState];
        if (!stateDef) {
            throw new StepError(`StepFlow: unknown state "${currentState}"`, {
                flowId: config.id,
                state: currentState,
            });
        }

        const outcome = await stateDef.run(step);
        const resolved = resolveOutcome(config, currentState, outcome);

        if (resolved === undefined) {
            return undefined;
        }
        if (resolved === null) {
            return step.repeat();
        }
        if (resolved === "legacy") {
            if (outcome.type !== "legacy") {
                throw new StepError("StepFlow: internal legacy outcome mismatch");
            }
            return step.next(outcome.impl);
        }

        setFlowState(step, resolved, config);
        return step.next(dispatcher);
    };
    return dispatcher;
}

/** 创建流程调度 StepImpl（需先填充 config.states，见 createLaunchState） */
export function createFlowDispatcher(config: StepFlowConfig): StepImpl {
    return createDispatcher(config);
}

export function buildFlowInitialData(config: StepFlowConfig): StepFlowData {
    return {
        payload: config.data ?? {},
        __flow: {
            id: config.id,
            state: config.initial,
        },
    };
}

export class StepFlow {
    /**
     * 按状态机配置运行流程，内部复用 Step.run 与现有步骤循环。
     */
    static async run(
        config: StepFlowConfig,
        options?: {
            stepId?: string;
            tag?: string;
            delayMs?: number;
            exceptionRetryCountMax?: number;
        }
    ): Promise<Step | undefined> {
        if (!config.states[config.initial]) {
            throw new StepError(
                `StepFlow: initial state "${config.initial}" is not defined`,
                { flowId: config.id }
            );
        }
        const dispatcher = createDispatcher(config);
        return Step.run(dispatcher, {
            ...options,
            tag: options?.tag ?? config.id,
            data: buildFlowInitialData(config),
        });
    }
}
