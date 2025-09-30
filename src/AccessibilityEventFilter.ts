/**
 * AccessibilityEvent过滤配置接口
 * 用于配置AccessibilityEvent的处理方式和过滤条件
 */
export interface AccessibilityEventFilterConfig {
  /**
   * 包名过滤
   * 如果为空或null，则处理所有包的事件
   * 如果指定包名，则只处理该包的事件
   */
  packageName?: string | null;

  /**
   * 是否在子线程中处理AccessibilityEvent
   * true: 在子线程中处理，避免阻塞主线程
   * false: 在主线程中处理
   */
  processInBackground?: boolean;

  /**
   * 是否获取节点信息
   * true: 获取并解析AccessibilityNodeInfo节点信息
   * false: 不获取节点信息，提高处理性能
   */
  fetchNodeInfo?: boolean;

  /**
   * 是否启用日志输出
   * true: 输出AccessibilityEvent处理日志
   * false: 不输出日志
   */
  enableLogging?: boolean;

  /**
   * 事件类型过滤
   * 如果为空，则处理所有类型的事件
   * 如果指定类型，则只处理指定类型的事件
   */
  eventTypes?: number[] | null;

  /**
   * 是否启用事件去重
   * true: 启用去重，避免重复处理相同事件
   * false: 不启用去重
   */
  enableDeduplication?: boolean;
}

/**
 * AccessibilityEvent过滤配置类
 * 用于配置AccessibilityEvent的处理方式和过滤条件
 */
export class AccessibilityEventFilter {
  /**
   * 包名过滤
   */
  public readonly packageName: string | null;

  /**
   * 是否在子线程中处理AccessibilityEvent
   */
  public readonly processInBackground: boolean;

  /**
   * 是否获取节点信息
   */
  public readonly fetchNodeInfo: boolean;

  /**
   * 是否启用日志输出
   */
  public readonly enableLogging: boolean;

  /**
   * 事件类型过滤
   */
  public readonly eventTypes?: number[] | null;

  /**
   * 是否启用事件去重
   */
  public readonly enableDeduplication: boolean;

  constructor(config: AccessibilityEventFilterConfig = {}) {
    this.packageName = config.packageName ?? null;
    this.processInBackground = config.processInBackground ?? true;
    this.fetchNodeInfo = config.fetchNodeInfo ?? true;
    this.enableLogging = config.enableLogging ?? false;
    this.eventTypes = config.eventTypes;
    this.enableDeduplication = config.enableDeduplication ?? false;
  }

  /**
   * 检查是否应该处理指定包的事件
   * @param targetPackageName 目标包名
   * @returns true表示应该处理，false表示应该过滤
   */
  public shouldProcessPackage(targetPackageName: string | null): boolean {
    return this.packageName === null || this.packageName === targetPackageName;
  }

  /**
   * 检查是否应该处理指定类型的事件
   * @param eventType 事件类型
   * @returns true表示应该处理，false表示应该过滤
   */
  public shouldProcessEventType(eventType: number): boolean {
    return (
      this.eventTypes === null ||
      (this.eventTypes?.includes(eventType) ?? false)
    );
  }

  /**
   * 创建默认的过滤配置
   * 所有包名，子线程处理，获取节点信息，启用日志
   */
  public static createDefault(): AccessibilityEventFilter {
    return new AccessibilityEventFilter({
      packageName: null,
      processInBackground: true,
      fetchNodeInfo: true,
      enableLogging: false,
      eventTypes: null,
      enableDeduplication: false,
    });
  }

  /**
   * 创建高性能配置
   * 不获取节点信息，不启用日志，启用去重
   */
  public static createHighPerformance(): AccessibilityEventFilter {
    return new AccessibilityEventFilter({
      packageName: null,
      processInBackground: true,
      fetchNodeInfo: false,
      enableLogging: false,
      eventTypes: null,
      enableDeduplication: true,
    });
  }

  /**
   * 创建调试配置
   * 启用所有功能，便于调试
   */
  public static createDebug(): AccessibilityEventFilter {
    return new AccessibilityEventFilter({
      packageName: null,
      processInBackground: true,
      fetchNodeInfo: true,
      enableLogging: true,
      eventTypes: null,
      enableDeduplication: false,
    });
  }

  /**
   * 创建指定包名的过滤配置
   * @param targetPackageName 目标包名
   */
  public static createForPackage(
    targetPackageName: string
  ): AccessibilityEventFilter {
    return new AccessibilityEventFilter({
      packageName: targetPackageName,
      processInBackground: true,
      fetchNodeInfo: true,
      enableLogging: false,
      eventTypes: null,
      enableDeduplication: false,
    });
  }
}
