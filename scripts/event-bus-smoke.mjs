/**
 * 跨 WebView 事件总线 · 浏览器兜底通道回归测试
 *
 * 用 Node 的全局 BroadcastChannel 模拟两个/三个独立页面，校验：
 * 注册合并、身份与名称、广播不回发送方、name 定向、to:self 本地投递、
 * retain 存储与后加入页面回放、客户端上下线、未命中目标 missed 回报。
 *
 * 用法：npm run test:event-bus
 * 说明：只编译 src/event（不依赖 pinia），因此不需要完整安装依赖，也不需要构建 dist。
 */
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// realpath：macOS 下 /var 是 /private/var 的符号链接，require.resolve 返回真实路径，
// 不归一化会导致缓存清理失配、三个「页面」共用同一实例
const outDir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "assistsx-event-smoke-")));

const compile = spawnSync(
    "npx",
    [
        "tsc",
        "src/event/index.ts",
        "--module",
        "commonjs",
        "--target",
        "es2020",
        "--moduleResolution",
        "node",
        "--esModuleInterop",
        "--skipLibCheck",
        "--rootDir",
        "src",
        "--outDir",
        outDir,
    ],
    { cwd: root, stdio: "inherit", shell: process.platform === "win32" }
);
if (compile.status !== 0) {
    console.error("FAIL: 编译 src/event 失败");
    process.exit(1);
}

// 模拟浏览器环境：Node 18+ 自带 BroadcastChannel
globalThis.window = globalThis;

let failures = 0;
function check(name, ok, extra) {
    console.log(`${ok ? "PASS" : "FAIL"}  ${name}${!ok && extra !== undefined ? "  -> " + JSON.stringify(extra) : ""}`);
    if (!ok) failures++;
}

/** 重新加载模块，得到一份独立的「页面」实例（各自拥有独立 window 桥与身份） */
function loadPage() {
    Object.keys(require.cache)
        .filter((key) => key.startsWith(outDir))
        .forEach((key) => delete require.cache[key]);
    return require(path.join(outDir, "event/index.js"));
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const A = loadPage();
const B = loadPage();

const got = { A: {}, B: {}, C: {} };
const record = (who, event) => (payload) => {
    (got[who][event] = got[who][event] || []).push(payload);
};

A.eventBus.on("ping", record("A", "ping"));
B.eventBus.on("ping", record("B", "ping"));
A.eventBus.on("cmd", record("A", "cmd"));
B.eventBus.on("cmd", record("B", "cmd"));
B.eventBus.on("local", record("B", "local"));
A.eventBus.on("state", record("A", "state"));

let floatJoined = null;
A.eventBus.onClientsChange((client, joined) => {
    if (client.name === "float-a") floatJoined = joined;
});

const selfA = await A.eventBus.ready("main");
const selfB = await B.eventBus.ready("settings");
await sleep(80);

check("传输通道为 broadcast", A.eventBus.transport === "broadcast", A.eventBus.transport);
check("A 身份名称", selfA.name === "main", selfA.name);
check("B 身份名称", selfB.name === "settings", selfB.name);
check("A 客户端列表包含 B", A.eventBus.getClients().some((c) => c.name === "settings"));

await B.eventBus.emit("ping", { n: 1 });
await sleep(80);
check("广播到达 A", got.A.ping && got.A.ping.length === 1, got.A.ping);
check("广播不回给发送方 B", !got.B.ping, got.B.ping);

await A.eventBus.emit("cmd", { c: 1 }, { to: "name:settings" });
await sleep(80);
check("定向 name:settings 到达 B", got.B.cmd && got.B.cmd.length === 1, got.B.cmd);
check("定向不到达 A", !got.A.cmd, got.A.cmd);

await B.eventBus.emit("local", "x", { to: "self" });
await sleep(80);
check("to:self 本页本地投递", got.B.local && got.B.local.length === 1, got.B.local);

await A.eventBus.emit("state", { v: 1 }, { retain: true });
await sleep(80);
const retained = await A.eventBus.getRetained("state");
check("保留消息已存储", retained.length === 1 && retained[0].payload.v === 1, retained);

const C = loadPage();
C.eventBus.on("state", record("C", "state"));
const selfC = await C.eventBus.ready("float-a");
await sleep(150);
check("C 注册成功", selfC.name === "float-a", selfC.name);
check("后加入的 C 收到保留消息回放", got.C.state && got.C.state.length === 1, got.C.state);
check("A 收到客户端加入变化", floatJoined === true, floatJoined);

const missedResult = await A.eventBus.emit("nobody", null, { to: "name:ghost" });
check(
    "未命中目标进入 missed",
    missedResult.missed.length === 1 && missedResult.delivered.length === 0,
    missedResult
);

check("C 上线后 A 客户端数 = 3", A.eventBus.getClients().length === 3, A.eventBus.getClients().map((c) => c.name));

fs.rmSync(outDir, { recursive: true, force: true });
console.log(failures === 0 ? "\n全部通过" : `\n失败 ${failures} 项`);
process.exit(failures === 0 ? 0 : 1);
