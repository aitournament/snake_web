# Optimizations

The WASM files may become quite large. If you start running into the 5 MB limit, here are a few things you can try.

## Remove panic unwinding

By default, Rust will gracefully unwind the stack on a panic. This has no benefit in snake, and takes up a lot of extra space. You can disable this which will cause panics to immediately abort by adding the following to `Cargo.toml`

```toml
# Cargo.toml

[profile.release]
panic = "abort"
```

## Disable  the Rust standard library

The Rust stdlib is very useful and gives you access to things like memory allocation. It's also very large. You can disable it by adding the following to `lib.rs`

```rust
// src/lib.rs

#![no_std]

use core::panic::PanicInfo;

#[panic_handler]
fn panic(_info: &PanicInfo) -> ! {
    loop {}
}
```