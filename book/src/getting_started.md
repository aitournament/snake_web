# Getting Started

A WebAssembly file needs to be created to decide actions in the game. A [Rust SDK][rust_sdk] ([docs][sdk_docs]) is provided, but any language can be used as long as it can be compiled to WebAssembly. The rest of this section will assume you are using Rust with the [Rust SDK][rust_sdk].

A full [example](https://github.com/aitournament/snake_example) is available to help you get started. Below we will go over how to start a new program from scratch.

## Setup system dependencies

Ensure you have a recent version of Rust [installed](https://www.rust-lang.org/tools/install)

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Install the `wasm32-unknown-unknown` target for Rust, which allows you to compile to WebAssembly

```sh
rustup target add wasm32-unknown-unknown
```


## Create a new program

Start by creating a new Rust library.

```sh
cargo init my_snake_program --lib
```

## Setup code

A couple changes are needed to make the library work with snake. The first step is to add a `main` functions. Add the following to `lib.rs`

```rust
// src/lib.rs

#[no_mangle]
extern "C" fn main() {
    // The main function is called once when the game starts. If the function ever ends,
    // your snake will die.

    // TODO: code to control your snake goes here
}
```

You also need to change the library type by adding the following to `Cargo.toml`

```toml
# Cargo.toml 

[lib]
crate-type = ["cdylib"]
```

## Compiling

You can now compile the program! It won't do much (the snake will just die since the program immediately ends), but it's a start. Run the following, which will compile the wasm file at `target/wasm32-unknown-unknown/my_snake_program.wasm`

```sh
cargo build --release --target=wasm32-unknown-unknown
```

You can now use the WASM file at [https://snake.aitournament.com](https://snake.aitournament.com)


[rust_sdk]: https://github.com/aitournament/snake_sdk
[sdk_docs]: https://sdk.snake.aitournament.com/snake_sdk