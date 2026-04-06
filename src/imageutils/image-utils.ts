/**
 * 图片工具相关功能
 * 提供图片处理相关的功能，包括转换、处理、压缩、保存等
 */
import { CallResponse } from "../call-response";
import { decodeBase64UTF8, generateUUID } from "../utils";

/**
 * 图片尺寸信息
 */
export interface ImageSize {
    filePath: string;
    width: number;
    height: number;
}

/**
 * 图片类型信息
 */
export interface ImageType {
    filePath: string;
    imageType: string;
}

/**
 * 图片旋转角度信息
 */
export interface ImageRotateDegree {
    filePath: string;
    degree: number;
}

/**
 * 图片处理结果
 */
export interface ImageProcessResult {
    filePath: string;
}

/**
 * 图片保存结果
 */
export interface ImageSaveResult {
    success: boolean;
    filePath: string;
}

// 回调函数存储对象
const callbacks: Map<string, (data: string) => void> = new Map();

// 初始化全局回调函数
if (typeof window !== "undefined" && !window.assistsxImageUtilsCallback) {
    window.assistsxImageUtilsCallback = (data: string) => {
        let callbackId: string | undefined;
        try {
            const json = decodeBase64UTF8(data);
            const response = JSON.parse(json);
            callbackId = response.callbackId;
            if (callbackId) {
                const callback = callbacks.get(callbackId);
                if (callback) {
                    callback(json);
                }
            }
        } catch (e) {
            console.error("ImageUtils callback error:", e);
        } finally {
            if (callbackId) {
                callbacks.delete(callbackId);
            }
        }
    };
}

export class ImageUtils {
    /**
     * 执行异步调用
     * @param method 方法名
     * @param args 参数对象
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<调用响应>
     */
    private async asyncCall(
        method: string,
        args?: any,
        timeout: number = 30
    ): Promise<CallResponse> {
        const uuid = generateUUID();
        const params = {
            method,
            arguments: args ? args : undefined,
            callbackId: uuid,
        };
        const promise = new Promise<string>((resolve) => {
            callbacks.set(uuid, (data: string) => {
                resolve(data);
            });
            setTimeout(() => {
                callbacks.delete(uuid);
                resolve(JSON.stringify(new CallResponse(0, null, uuid)));
            }, timeout * 1000);
        });
        const result = window.assistsxImageUtils.call(JSON.stringify(params));
        const promiseResult = await promise;
        if (typeof promiseResult === "string") {
            const responseData = JSON.parse(promiseResult);
            return new CallResponse(
                responseData.code,
                responseData.data,
                responseData.callbackId
            );
        }
        throw new Error("Call failed");
    }

    // ==================== 获取相关 ====================

    /**
     * 获取图片尺寸
     * @param imagePath 图片路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<图片尺寸信息>
     */
    async getSize(imagePath: string, timeout?: number): Promise<ImageSize> {
        const response = await this.asyncCall("getSize", { imagePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "获取图片尺寸失败");
        }
        return response.data as ImageSize;
    }

    /**
     * 获取图片类型
     * @param imagePath 图片路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<图片类型信息>
     */
    async getImageType(imagePath: string, timeout?: number): Promise<ImageType> {
        const response = await this.asyncCall("getImageType", { imagePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "获取图片类型失败");
        }
        return response.data as ImageType;
    }

    /**
     * 判断是否为图片
     * @param fileName 文件名
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<是否为图片>
     */
    async isImage(fileName: string, timeout?: number): Promise<boolean> {
        const response = await this.asyncCall("isImage", { fileName }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "判断是否为图片失败");
        }
        return (response.data as { isImage: boolean }).isImage;
    }

    /**
     * 获取图片旋转角度
     * @param imagePath 图片路径
     * @param timeout 超时时间(秒)，默认30秒
     * @returns Promise<图片旋转角度信息>
     */
    async getRotateDegree(imagePath: string, timeout?: number): Promise<ImageRotateDegree> {
        const response = await this.asyncCall("getRotateDegree", { imagePath }, timeout);
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "获取图片旋转角度失败");
        }
        return response.data as ImageRotateDegree;
    }

    // ==================== 图片处理相关 ====================

    /**
     * 缩放图片
     * @param imagePath 图片路径
     * @param options 缩放选项
     * @param options.scaleWidth 缩放宽度（可选）
     * @param options.scaleHeight 缩放高度（可选）
     * @param options.savePath 保存路径（可选）
     * @param options.format 图片格式，支持 "PNG"、"JPEG"、"JPG"、"WEBP"，默认"PNG"
     * @param options.timeout 超时时间(秒)，默认30秒
     * @returns Promise<处理后的图片路径>
     */
    async scale(
        imagePath: string,
        options: {
            scaleWidth?: number;
            scaleHeight?: number;
            savePath?: string;
            format?: "PNG" | "JPEG" | "JPG" | "WEBP";
            timeout?: number;
        } = {}
    ): Promise<string> {
        const { scaleWidth, scaleHeight, savePath, format, timeout } = options;
        const response = await this.asyncCall(
            "scale",
            { imagePath, scaleWidth, scaleHeight, savePath, format },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "缩放图片失败");
        }
        return (response.data as ImageProcessResult).filePath;
    }

    /**
     * 裁剪图片
     * @param imagePath 图片路径
     * @param options 裁剪选项
     * @param options.x 起始X坐标，默认0
     * @param options.y 起始Y坐标，默认0
     * @param options.width 裁剪宽度（可选，不提供则裁剪到图片右边界）
     * @param options.height 裁剪高度（可选，不提供则裁剪到图片下边界）
     * @param options.savePath 保存路径（可选）
     * @param options.format 图片格式，支持 "PNG"、"JPEG"、"JPG"、"WEBP"，默认"PNG"
     * @param options.timeout 超时时间(秒)，默认30秒
     * @returns Promise<处理后的图片路径>
     */
    async clip(
        imagePath: string,
        options: {
            x?: number;
            y?: number;
            width?: number;
            height?: number;
            savePath?: string;
            format?: "PNG" | "JPEG" | "JPG" | "WEBP";
            timeout?: number;
        } = {}
    ): Promise<string> {
        const { x = 0, y = 0, width, height, savePath, format, timeout } = options;
        const response = await this.asyncCall(
            "clip",
            { imagePath, x, y, width, height, savePath, format },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "裁剪图片失败");
        }
        return (response.data as ImageProcessResult).filePath;
    }

    /**
     * 倾斜图片
     * @param imagePath 图片路径
     * @param options 倾斜选项
     * @param options.kx X轴倾斜系数，默认0
     * @param options.ky Y轴倾斜系数，默认0
     * @param options.px X轴倾斜点（可选）
     * @param options.py Y轴倾斜点（可选）
     * @param options.savePath 保存路径（可选）
     * @param options.format 图片格式，支持 "PNG"、"JPEG"、"JPG"、"WEBP"，默认"PNG"
     * @param options.timeout 超时时间(秒)，默认30秒
     * @returns Promise<处理后的图片路径>
     */
    async skew(
        imagePath: string,
        options: {
            kx?: number;
            ky?: number;
            px?: number;
            py?: number;
            savePath?: string;
            format?: "PNG" | "JPEG" | "JPG" | "WEBP";
            timeout?: number;
        } = {}
    ): Promise<string> {
        const { kx = 0, ky = 0, px, py, savePath, format, timeout } = options;
        const response = await this.asyncCall(
            "skew",
            { imagePath, kx, ky, px, py, savePath, format },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "倾斜图片失败");
        }
        return (response.data as ImageProcessResult).filePath;
    }

    /**
     * 旋转图片
     * @param imagePath 图片路径
     * @param options 旋转选项
     * @param options.degree 旋转角度，默认0
     * @param options.px 旋转中心X坐标（可选）
     * @param options.py 旋转中心Y坐标（可选）
     * @param options.savePath 保存路径（可选）
     * @param options.format 图片格式，支持 "PNG"、"JPEG"、"JPG"、"WEBP"，默认"PNG"
     * @param options.timeout 超时时间(秒)，默认30秒
     * @returns Promise<处理后的图片路径>
     */
    async rotate(
        imagePath: string,
        options: {
            degree?: number;
            px?: number;
            py?: number;
            savePath?: string;
            format?: "PNG" | "JPEG" | "JPG" | "WEBP";
            timeout?: number;
        } = {}
    ): Promise<string> {
        const { degree = 0, px, py, savePath, format, timeout } = options;
        const response = await this.asyncCall(
            "rotate",
            { imagePath, degree, px, py, savePath, format },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "旋转图片失败");
        }
        return (response.data as ImageProcessResult).filePath;
    }

    /**
     * 转为圆形图片
     * @param imagePath 图片路径
     * @param options 选项
     * @param options.savePath 保存路径（可选）
     * @param options.format 图片格式，支持 "PNG"、"JPEG"、"JPG"、"WEBP"，默认"PNG"
     * @param options.timeout 超时时间(秒)，默认30秒
     * @returns Promise<处理后的图片路径>
     */
    async toRound(
        imagePath: string,
        options: {
            savePath?: string;
            format?: "PNG" | "JPEG" | "JPG" | "WEBP";
            timeout?: number;
        } = {}
    ): Promise<string> {
        const { savePath, format, timeout } = options;
        const response = await this.asyncCall(
            "toRound",
            { imagePath, savePath, format },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "转为圆形图片失败");
        }
        return (response.data as ImageProcessResult).filePath;
    }

    /**
     * 转为圆角图片
     * @param imagePath 图片路径
     * @param options 选项
     * @param options.radius 圆角半径，默认0
     * @param options.savePath 保存路径（可选）
     * @param options.format 图片格式，支持 "PNG"、"JPEG"、"JPG"、"WEBP"，默认"PNG"
     * @param options.timeout 超时时间(秒)，默认30秒
     * @returns Promise<处理后的图片路径>
     */
    async toRoundCorner(
        imagePath: string,
        options: {
            radius?: number;
            savePath?: string;
            format?: "PNG" | "JPEG" | "JPG" | "WEBP";
            timeout?: number;
        } = {}
    ): Promise<string> {
        const { radius = 0, savePath, format, timeout } = options;
        const response = await this.asyncCall(
            "toRoundCorner",
            { imagePath, radius, savePath, format },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "转为圆角图片失败");
        }
        return (response.data as ImageProcessResult).filePath;
    }

    /**
     * 添加圆角边框
     * @param imagePath 图片路径
     * @param options 选项
     * @param options.borderSize 边框大小，默认0
     * @param options.color 边框颜色，默认"#000000"
     * @param options.cornerRadius 圆角半径，默认0
     * @param options.savePath 保存路径（可选）
     * @param options.format 图片格式，支持 "PNG"、"JPEG"、"JPG"、"WEBP"，默认"PNG"
     * @param options.timeout 超时时间(秒)，默认30秒
     * @returns Promise<处理后的图片路径>
     */
    async addCornerBorder(
        imagePath: string,
        options: {
            borderSize?: number;
            color?: string;
            cornerRadius?: number;
            savePath?: string;
            format?: "PNG" | "JPEG" | "JPG" | "WEBP";
            timeout?: number;
        } = {}
    ): Promise<string> {
        const { borderSize = 0, color = "#000000", cornerRadius = 0, savePath, format, timeout } = options;
        const response = await this.asyncCall(
            "addCornerBorder",
            { imagePath, borderSize, color, cornerRadius, savePath, format },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "添加圆角边框失败");
        }
        return (response.data as ImageProcessResult).filePath;
    }

    /**
     * 添加圆形边框
     * @param imagePath 图片路径
     * @param options 选项
     * @param options.borderSize 边框大小，默认0
     * @param options.color 边框颜色，默认"#000000"
     * @param options.savePath 保存路径（可选）
     * @param options.format 图片格式，支持 "PNG"、"JPEG"、"JPG"、"WEBP"，默认"PNG"
     * @param options.timeout 超时时间(秒)，默认30秒
     * @returns Promise<处理后的图片路径>
     */
    async addCircleBorder(
        imagePath: string,
        options: {
            borderSize?: number;
            color?: string;
            savePath?: string;
            format?: "PNG" | "JPEG" | "JPG" | "WEBP";
            timeout?: number;
        } = {}
    ): Promise<string> {
        const { borderSize = 0, color = "#000000", savePath, format, timeout } = options;
        const response = await this.asyncCall(
            "addCircleBorder",
            { imagePath, borderSize, color, savePath, format },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "添加圆形边框失败");
        }
        return (response.data as ImageProcessResult).filePath;
    }

    /**
     * 添加倒影
     * @param imagePath 图片路径
     * @param options 选项
     * @param options.reflectionHeight 倒影高度，默认0
     * @param options.savePath 保存路径（可选）
     * @param options.format 图片格式，支持 "PNG"、"JPEG"、"JPG"、"WEBP"，默认"PNG"
     * @param options.timeout 超时时间(秒)，默认30秒
     * @returns Promise<处理后的图片路径>
     */
    async addReflection(
        imagePath: string,
        options: {
            reflectionHeight?: number;
            savePath?: string;
            format?: "PNG" | "JPEG" | "JPG" | "WEBP";
            timeout?: number;
        } = {}
    ): Promise<string> {
        const { reflectionHeight = 0, savePath, format, timeout } = options;
        const response = await this.asyncCall(
            "addReflection",
            { imagePath, reflectionHeight, savePath, format },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "添加倒影失败");
        }
        return (response.data as ImageProcessResult).filePath;
    }

    /**
     * 添加文字水印
     * @param imagePath 图片路径
     * @param options 选项
     * @param options.text 水印文字，默认""
     * @param options.x 文字X坐标，默认0
     * @param options.y 文字Y坐标，默认0
     * @param options.color 文字颜色，默认"#000000"
     * @param options.size 文字大小，默认16
     * @param options.savePath 保存路径（可选）
     * @param options.format 图片格式，支持 "PNG"、"JPEG"、"JPG"、"WEBP"，默认"PNG"
     * @param options.timeout 超时时间(秒)，默认30秒
     * @returns Promise<处理后的图片路径>
     */
    async addTextWatermark(
        imagePath: string,
        options: {
            text?: string;
            x?: number;
            y?: number;
            color?: string;
            size?: number;
            savePath?: string;
            format?: "PNG" | "JPEG" | "JPG" | "WEBP";
            timeout?: number;
        } = {}
    ): Promise<string> {
        const { text = "", x = 0, y = 0, color = "#000000", size = 16, savePath, format, timeout } = options;
        const response = await this.asyncCall(
            "addTextWatermark",
            { imagePath, text, x, y, color, size, savePath, format },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "添加文字水印失败");
        }
        return (response.data as ImageProcessResult).filePath;
    }

    /**
     * 添加图片水印
     * @param imagePath 图片路径
     * @param options 选项
     * @param options.watermarkPath 水印图片路径（必需）
     * @param options.x 水印X坐标，默认0
     * @param options.y 水印Y坐标，默认0
     * @param options.alpha 透明度，默认255
     * @param options.savePath 保存路径（可选）
     * @param options.format 图片格式，支持 "PNG"、"JPEG"、"JPG"、"WEBP"，默认"PNG"
     * @param options.timeout 超时时间(秒)，默认30秒
     * @returns Promise<处理后的图片路径>
     */
    async addImageWatermark(
        imagePath: string,
        options: {
            watermarkPath: string;
            x?: number;
            y?: number;
            alpha?: number;
            savePath?: string;
            format?: "PNG" | "JPEG" | "JPG" | "WEBP";
            timeout?: number;
        }
    ): Promise<string> {
        const { watermarkPath, x = 0, y = 0, alpha = 255, savePath, format, timeout } = options;
        const response = await this.asyncCall(
            "addImageWatermark",
            { imagePath, watermarkPath, x, y, alpha, savePath, format },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "添加图片水印失败");
        }
        return (response.data as ImageProcessResult).filePath;
    }

    /**
     * 转为 alpha 位图
     * @param imagePath 图片路径
     * @param options 选项
     * @param options.savePath 保存路径（可选）
     * @param options.format 图片格式，支持 "PNG"、"JPEG"、"JPG"、"WEBP"，默认"PNG"
     * @param options.timeout 超时时间(秒)，默认30秒
     * @returns Promise<处理后的图片路径>
     */
    async toAlpha(
        imagePath: string,
        options: {
            savePath?: string;
            format?: "PNG" | "JPEG" | "JPG" | "WEBP";
            timeout?: number;
        } = {}
    ): Promise<string> {
        const { savePath, format, timeout } = options;
        const response = await this.asyncCall(
            "toAlpha",
            { imagePath, savePath, format },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "转为 alpha 位图失败");
        }
        return (response.data as ImageProcessResult).filePath;
    }

    /**
     * 转为灰度图片
     * @param imagePath 图片路径
     * @param options 选项
     * @param options.savePath 保存路径（可选）
     * @param options.format 图片格式，支持 "PNG"、"JPEG"、"JPG"、"WEBP"，默认"PNG"
     * @param options.timeout 超时时间(秒)，默认30秒
     * @returns Promise<处理后的图片路径>
     */
    async toGray(
        imagePath: string,
        options: {
            savePath?: string;
            format?: "PNG" | "JPEG" | "JPG" | "WEBP";
            timeout?: number;
        } = {}
    ): Promise<string> {
        const { savePath, format, timeout } = options;
        const response = await this.asyncCall(
            "toGray",
            { imagePath, savePath, format },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "转为灰度图片失败");
        }
        return (response.data as ImageProcessResult).filePath;
    }

    /**
     * 快速模糊
     * @param imagePath 图片路径
     * @param options 选项
     * @param options.radius 模糊半径，默认0
     * @param options.scale 缩放比例，默认1
     * @param options.savePath 保存路径（可选）
     * @param options.format 图片格式，支持 "PNG"、"JPEG"、"JPG"、"WEBP"，默认"PNG"
     * @param options.timeout 超时时间(秒)，默认30秒
     * @returns Promise<处理后的图片路径>
     */
    async fastBlur(
        imagePath: string,
        options: {
            radius?: number;
            scale?: number;
            savePath?: string;
            format?: "PNG" | "JPEG" | "JPG" | "WEBP";
            timeout?: number;
        } = {}
    ): Promise<string> {
        const { radius = 0, scale = 1, savePath, format, timeout } = options;
        const response = await this.asyncCall(
            "fastBlur",
            { imagePath, radius, scale, savePath, format },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "快速模糊失败");
        }
        return (response.data as ImageProcessResult).filePath;
    }

    /**
     * RenderScript 模糊
     * @param imagePath 图片路径
     * @param options 选项
     * @param options.radius 模糊半径，默认0
     * @param options.savePath 保存路径（可选）
     * @param options.format 图片格式，支持 "PNG"、"JPEG"、"JPG"、"WEBP"，默认"PNG"
     * @param options.timeout 超时时间(秒)，默认30秒
     * @returns Promise<处理后的图片路径>
     */
    async renderScriptBlur(
        imagePath: string,
        options: {
            radius?: number;
            savePath?: string;
            format?: "PNG" | "JPEG" | "JPG" | "WEBP";
            timeout?: number;
        } = {}
    ): Promise<string> {
        const { radius = 0, savePath, format, timeout } = options;
        const response = await this.asyncCall(
            "renderScriptBlur",
            { imagePath, radius, savePath, format },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "RenderScript 模糊失败");
        }
        return (response.data as ImageProcessResult).filePath;
    }

    /**
     * Stack 模糊
     * @param imagePath 图片路径
     * @param options 选项
     * @param options.radius 模糊半径，默认0
     * @param options.savePath 保存路径（可选）
     * @param options.format 图片格式，支持 "PNG"、"JPEG"、"JPG"、"WEBP"，默认"PNG"
     * @param options.timeout 超时时间(秒)，默认30秒
     * @returns Promise<处理后的图片路径>
     */
    async stackBlur(
        imagePath: string,
        options: {
            radius?: number;
            savePath?: string;
            format?: "PNG" | "JPEG" | "JPG" | "WEBP";
            timeout?: number;
        } = {}
    ): Promise<string> {
        const { radius = 0, savePath, format, timeout } = options;
        const response = await this.asyncCall(
            "stackBlur",
            { imagePath, radius, savePath, format },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "Stack 模糊失败");
        }
        return (response.data as ImageProcessResult).filePath;
    }

    // ==================== 压缩相关 ====================

    /**
     * 按缩放压缩
     * @param imagePath 图片路径
     * @param options 选项
     * @param options.scaleWidth 缩放宽度（可选）
     * @param options.scaleHeight 缩放高度（可选）
     * @param options.savePath 保存路径（可选）
     * @param options.format 图片格式，支持 "PNG"、"JPEG"、"JPG"、"WEBP"，默认"PNG"
     * @param options.timeout 超时时间(秒)，默认30秒
     * @returns Promise<压缩后的图片路径>
     */
    async compressByScale(
        imagePath: string,
        options: {
            scaleWidth?: number;
            scaleHeight?: number;
            savePath?: string;
            format?: "PNG" | "JPEG" | "JPG" | "WEBP";
            timeout?: number;
        } = {}
    ): Promise<string> {
        const { scaleWidth, scaleHeight, savePath, format, timeout } = options;
        const response = await this.asyncCall(
            "compressByScale",
            { imagePath, scaleWidth, scaleHeight, savePath, format },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "按缩放压缩失败");
        }
        return (response.data as ImageProcessResult).filePath;
    }

    /**
     * 按质量压缩
     * @param imagePath 图片路径
     * @param options 选项
     * @param options.quality 压缩质量，0-100，默认100
     * @param options.format 图片格式，支持 "JPEG"、"PNG"、"WEBP"，默认"JPEG"
     * @param options.savePath 保存路径（可选）
     * @param options.timeout 超时时间(秒)，默认30秒
     * @returns Promise<压缩后的图片路径>
     */
    async compressByQuality(
        imagePath: string,
        options: {
            quality?: number;
            format?: "JPEG" | "PNG" | "WEBP";
            savePath?: string;
            timeout?: number;
        } = {}
    ): Promise<string> {
        const { quality = 100, format = "JPEG", savePath, timeout } = options;
        const response = await this.asyncCall(
            "compressByQuality",
            { imagePath, quality, format, savePath },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "按质量压缩失败");
        }
        return (response.data as ImageProcessResult).filePath;
    }

    /**
     * 按采样大小压缩
     * @param imagePath 图片路径
     * @param options 选项
     * @param options.sampleSize 采样大小，默认1
     * @param options.savePath 保存路径（可选）
     * @param options.format 图片格式，支持 "PNG"、"JPEG"、"JPG"、"WEBP"，默认"PNG"
     * @param options.timeout 超时时间(秒)，默认30秒
     * @returns Promise<压缩后的图片路径>
     */
    async compressBySampleSize(
        imagePath: string,
        options: {
            sampleSize?: number;
            savePath?: string;
            format?: "PNG" | "JPEG" | "JPG" | "WEBP";
            timeout?: number;
        } = {}
    ): Promise<string> {
        const { sampleSize = 1, savePath, format, timeout } = options;
        const response = await this.asyncCall(
            "compressBySampleSize",
            { imagePath, sampleSize, savePath, format },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "按采样大小压缩失败");
        }
        return (response.data as ImageProcessResult).filePath;
    }

    // ==================== 保存相关 ====================

    /**
     * 保存图片
     * @param imagePath 图片路径
     * @param options 选项
     * @param options.savePath 保存路径（可选，不提供则自动生成）
     * @param options.format 图片格式，支持 "PNG"、"JPEG"、"JPG"、"WEBP"，默认"PNG"
     * @param options.timeout 超时时间(秒)，默认30秒
     * @returns Promise<保存结果>
     */
    async save(
        imagePath: string,
        options: {
            savePath?: string;
            format?: "PNG" | "JPEG" | "JPG" | "WEBP";
            timeout?: number;
        } = {}
    ): Promise<ImageSaveResult> {
        const { savePath, format = "PNG", timeout } = options;
        const response = await this.asyncCall(
            "save",
            { imagePath, savePath, format },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "保存图片失败");
        }
        return response.data as ImageSaveResult;
    }

    /**
     * 保存图片到相册
     * @param imagePath 图片路径
     * @param options 选项
     * @param options.fileName 文件名（可选，不提供则自动生成）
     * @param options.format 图片格式，支持 "PNG"、"JPEG"、"JPG"、"WEBP"，默认"PNG"
     * @param options.timeout 超时时间(秒)，默认30秒
     * @returns Promise<保存结果>
     */
    async save2Album(
        imagePath: string,
        options: {
            fileName?: string;
            format?: "PNG" | "JPEG" | "JPG" | "WEBP";
            timeout?: number;
        } = {}
    ): Promise<ImageSaveResult> {
        const { fileName, format = "PNG", timeout } = options;
        const response = await this.asyncCall(
            "save2Album",
            { imagePath, fileName, format },
            timeout
        );
        if (!response.isSuccess()) {
            throw new Error(response.data?.message || "保存图片到相册失败");
        }
        return response.data as ImageSaveResult;
    }
}

// 导出常量实例
export const imageUtils = new ImageUtils();
