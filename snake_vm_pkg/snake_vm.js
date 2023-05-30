import * as wasm from "./snake_vm_bg.wasm";
import { __wbg_set_wasm } from "./snake_vm_bg.js";
__wbg_set_wasm(wasm);
export * from "./snake_vm_bg.js";
