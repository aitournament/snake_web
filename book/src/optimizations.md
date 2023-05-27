# Optimizations

There are a few optimizations that can be done to help minimize the size of the WASM file and potentially speed up execution. Snake is a real-time game, which means a bit of extra performance could be the difference between winning and losing.

## Remove panic unwinding

By default, Rust will gracefully unwind the stack on a panic. This has no benefit in snake, and takes up a lot of extra space. You can disable this which will cause panics to immediately abort by adding the following to `Cargo.toml`

```toml
# Cargo.toml

[profile.release]
panic = "abort"
```

## Disable  the Rust standard library

The Rust stdlib is very useful and gives you access to things like memory allocation. The stdlib is also very large. You can disable it by adding the following to `lib.rs`

```rust
// src/lib.rs

#![no_std]

use core::panic::PanicInfo;

#[panic_handler]
fn panic(_info: &PanicInfo) -> ! {
    loop {}
}
```