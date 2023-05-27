#!/bin/bash

set -e
cd ../snake_vm
wasm-pack build
cd ../snake_web
cp -r ../snake_vm/pkg ./snake_vm_pkg
npm install ./snake_vm_pkg