/**
 * 应用信息实体类
 */
export class AppInfo {
  /**
   * 是否为系统应用
   */
  isSystem: boolean;

  /**
   * 最低SDK版本
   */
  minSdkVersion: number;

  /**
   * 应用名称
   */
  name: string;

  /**
   * 应用包名
   */
  packageName: string;

  /**
   * 目标SDK版本
   */
  targetSdkVersion: number;

  /**
   * 版本号
   */
  versionCode: number;

  /**
   * 版本名称
   */
  versionName: string;

  constructor(
    isSystem: boolean = false,
    minSdkVersion: number = 0,
    name: string = "",
    packageName: string = "",
    targetSdkVersion: number = 0,
    versionCode: number = 0,
    versionName: string = ""
  ) {
    this.isSystem = isSystem;
    this.minSdkVersion = minSdkVersion;
    this.name = name;
    this.packageName = packageName;
    this.targetSdkVersion = targetSdkVersion;
    this.versionCode = versionCode;
    this.versionName = versionName;
  }

  /**
   * 从JSON对象创建AppInfo实例
   * @param data JSON对象
   * @returns AppInfo实例
   */
  static fromJSON(data: any): AppInfo {
    return new AppInfo(
      data.isSystem ?? false,
      data.minSdkVersion ?? 0,
      data.name ?? "",
      data.packageName ?? "",
      data.targetSdkVersion ?? 0,
      data.versionCode ?? 0,
      data.versionName ?? ""
    );
  }

  /**
   * 转换为JSON对象
   * @returns JSON对象
   */
  toJSON(): any {
    return {
      isSystem: this.isSystem,
      minSdkVersion: this.minSdkVersion,
      name: this.name,
      packageName: this.packageName,
      targetSdkVersion: this.targetSdkVersion,
      versionCode: this.versionCode,
      versionName: this.versionName,
    };
  }
}
