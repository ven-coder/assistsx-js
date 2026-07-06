/**
 * AssistsX 当前运行插件信息（由宿主拦截 getCurrentPlugin 返回）
 */
export class PluginInfo {
    id: string;
    name: string;
    packageName: string;
    versionName: string;
    versionCode: number;
    description: string;
    path: string;
    index: string;
    port: number;
    needScreenCapture: boolean;

    constructor(
        id: string = "",
        name: string = "",
        packageName: string = "",
        versionName: string = "",
        versionCode: number = 0,
        description: string = "",
        path: string = "",
        index: string = "",
        port: number = 0,
        needScreenCapture: boolean = false
    ) {
        this.id = id;
        this.name = name;
        this.packageName = packageName;
        this.versionName = versionName;
        this.versionCode = versionCode;
        this.description = description;
        this.path = path;
        this.index = index;
        this.port = port;
        this.needScreenCapture = needScreenCapture;
    }

    static fromJSON(data: unknown): PluginInfo {
        const record = (data ?? {}) as Record<string, unknown>;
        return new PluginInfo(
            String(record.id ?? ""),
            String(record.name ?? ""),
            String(record.packageName ?? ""),
            String(record.versionName ?? ""),
            Number(record.versionCode ?? 0),
            String(record.description ?? ""),
            String(record.path ?? ""),
            String(record.index ?? ""),
            Number(record.port ?? 0),
            Boolean(record.needScreenCapture ?? false)
        );
    }

    toJSON(): Record<string, unknown> {
        return {
            id: this.id,
            name: this.name,
            packageName: this.packageName,
            versionName: this.versionName,
            versionCode: this.versionCode,
            description: this.description,
            path: this.path,
            index: this.index,
            port: this.port,
            needScreenCapture: this.needScreenCapture,
        };
    }
}
