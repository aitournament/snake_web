import * as wasm from './snake_vm_bg.wasm';

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
* adds a new snake to the game, before it is started
* must be added in the same order if you want to keep simulations deterministic
* @param {Uint8Array} bytes
* @param {number} team_id
*/
export function add_starting_snake(bytes, team_id) {
    var ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.add_starting_snake(ptr0, len0, team_id);
}

/**
* @param {Uint8Array} wasm_bytes
*/
export function check_wasm(wasm_bytes) {
    var ptr0 = passArray8ToWasm0(wasm_bytes, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.check_wasm(ptr0, len0);
}

/**
* @param {number} num
*/
export function step(num) {
    wasm.step(num);
}

/**
* @returns {any}
*/
export function get_state() {
    var ret = wasm.get_state();
    return takeObject(ret);
}

/**
* @param {number} seed
*/
export function reset(seed) {
    wasm.reset(seed);
}

export function __wbg_log_fb0e74ae0e54f80f(arg0, arg1) {
    console.log(getStringFromWasm0(arg0, arg1));
};

export function __wbg_onEvent_d1f98e755a83e1e6(arg0) {
    onEvent(takeObject(arg0));
};

export function __wbindgen_string_new(arg0, arg1) {
    var ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbindgen_json_parse(arg0, arg1) {
    var ret = JSON.parse(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbindgen_rethrow(arg0) {
    throw takeObject(arg0);
};

