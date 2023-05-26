#!/bin/bash

set -e
cd ../snake_vm
wasm-pack build
cd ../snake_web
npm install ../snake_vm/pkg