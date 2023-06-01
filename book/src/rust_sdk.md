# Using the SDK

The previous section setup a `main` function that can contain arbitrary code, but you still need a way to actually interact with the game. The WASM runtime that runs your code exports functions that you can use to take actions, or get information about the current state of the game. You can import these as `extern "C"` functions and directly use them. The [Rust SDK][rust_sdk] does this for you, and provides a safe API on top of those.

## Setup

To use the [Rust SDK][rust_sdk], you just need to add it as a dependency. Add the following to `Cargo.toml`

```toml
[dependencies]
snake_sdk = {git = "https://github.com/aitournament/snake_sdk"}
```

## Usage

You can now call functions provided by the SDK. A couple examples are below.

You can find the full list of available functions in the [Rust SDK Docs](https://sdk.snake.aitournament.com/snake_sdk)

```rust
#[no_mangle]
extern "C" fn main() {

    // Get the size of the arena that the snake will live in
    let (width, height) = snake_sdk::get_arena_size();

    // Find the head of your snake
    let (x,y) = snake_sdk::get_current_pos();

    // infinite loop so the program doesn't end
    loop {
        // Move East, and wait until the next tick
        snake_sdk::set_direction(snake_sdk::Direction::East);
        snake_sdk::move_snake();
        snake_sdk::sleep_remaining_tick();
    }
}
```

## Raw functions

The raw `extern "C"` functions are available in the [raw](https://sdk.snake.aitournament.com/snake_sdk/raw/index.html) module of the SDK. These unsafe functions _can_ be used directly, but they mostly exist as a reference to document the WebAssembly interface if you want to use another language without the [Rust SDK][rust_sdk].

[rust_sdk]: https://github.com/aitournament/snake_sdk