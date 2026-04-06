/**
 * 设备信息实体类
 */
export class DeviceInfo {
  /**
   * 设备唯一标识
   */
  uniqueDeviceId: string;

  /**
   * Android ID
   */
  androidID: string;

  /**
   * MAC地址
   */
  macAddress: string;

  /**
   * 是否已Root
   */
  isDeviceRooted: boolean;

  /**
   * 制造商
   */
  manufacturer: string;

  /**
   * 设备型号
   */
  model: string;

  /**
   * SDK版本号
   */
  sdkVersionCode: number;

  /**
   * SDK版本名称
   */
  sdkVersionName: string;

  /**
   * ABI列表
   */
  abiList: string[];

  /**
   * 是否启用ADB调试
   */
  isAdbEnabled: boolean;

  /**
   * 是否启用开发者选项
   */
  isDevelopmentSettingsEnabled: boolean;

  /**
   * 是否为模拟器
   */
  isEmulator: boolean;

  /**
   * 是否为平板
   */
  isTablet: boolean;

  constructor(
    uniqueDeviceId: string = "",
    androidID: string = "",
    macAddress: string = "",
    isDeviceRooted: boolean = false,
    manufacturer: string = "",
    model: string = "",
    sdkVersionCode: number = 0,
    sdkVersionName: string = "",
    abiList: string[] = [],
    isAdbEnabled: boolean = false,
    isDevelopmentSettingsEnabled: boolean = false,
    isEmulator: boolean = false,
    isTablet: boolean = false
  ) {
    this.uniqueDeviceId = uniqueDeviceId;
    this.androidID = androidID;
    this.macAddress = macAddress;
    this.isDeviceRooted = isDeviceRooted;
    this.manufacturer = manufacturer;
    this.model = model;
    this.sdkVersionCode = sdkVersionCode;
    this.sdkVersionName = sdkVersionName;
    this.abiList = abiList;
    this.isAdbEnabled = isAdbEnabled;
    this.isDevelopmentSettingsEnabled = isDevelopmentSettingsEnabled;
    this.isEmulator = isEmulator;
    this.isTablet = isTablet;
  }

  /**
   * 从JSON对象创建DeviceInfo实例
   * @param data JSON对象
   * @returns DeviceInfo实例
   */
  static fromJSON(data: any): DeviceInfo {
    return new DeviceInfo(
      data.uniqueDeviceId ?? "",
      data.androidID ?? "",
      data.macAddress ?? "",
      data.isDeviceRooted ?? false,
      data.manufacturer ?? "",
      data.model ?? "",
      data.sdkVersionCode ?? 0,
      data.sdkVersionName ?? "",
      data.abiList ?? [],
      data.isAdbEnabled ?? false,
      data.isDevelopmentSettingsEnabled ?? false,
      data.isEmulator ?? false,
      data.isTablet ?? false
    );
  }

  /**
   * 转换为JSON对象
   * @returns JSON对象
   */
  toJSON(): any {
    return {
      uniqueDeviceId: this.uniqueDeviceId,
      androidID: this.androidID,
      macAddress: this.macAddress,
      isDeviceRooted: this.isDeviceRooted,
      manufacturer: this.manufacturer,
      model: this.model,
      sdkVersionCode: this.sdkVersionCode,
      sdkVersionName: this.sdkVersionName,
      abiList: this.abiList,
      isAdbEnabled: this.isAdbEnabled,
      isDevelopmentSettingsEnabled: this.isDevelopmentSettingsEnabled,
      isEmulator: this.isEmulator,
      isTablet: this.isTablet,
    };
  }
}
