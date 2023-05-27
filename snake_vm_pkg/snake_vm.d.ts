/* tslint:disable */
/* eslint-disable */
/**
* adds a new snake to the game, before it is started
* must be added in the same order if you want to keep simulations deterministic
* @param {Uint8Array} bytes
* @param {number} team_id
*/
export function add_starting_snake(bytes: Uint8Array, team_id: number): void;
/**
* @param {Uint8Array} wasm_bytes
*/
export function check_wasm(wasm_bytes: Uint8Array): void;
/**
* @param {number} num
*/
export function step(num: number): void;
/**
* @returns {any}
*/
export function get_state(): any;
/**
* @param {number} seed
*/
export function reset(seed: number): void;
