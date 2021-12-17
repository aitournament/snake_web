import { Theme, Typography } from "@mui/material";
import { Box, SxProps } from "@mui/system";
import { ReactNode, useState } from "react";
import FileInput from "../../FileInput";
import { SnakeVm } from "./Play";


interface WasmInputProps {
    editable: boolean,
    children?: ReactNode,
    snake_vm: SnakeVm,
    color: string,
    onChange?: (filename: string, bytes: Uint8Array|null) => void,
}

export default function WasmInput(props: WasmInputProps) {
    let [err, setErr] = useState<boolean>(false);
    let [name, setName] = useState("...");

    return <Box
        sx={{
            border: 2,
            borderColor: props.color,
            borderStyle: "asdf",
            borderRadius: 3,
            px: 3,
            py: 1
        }}>
        {err && <Typography
            variant='h5'
            color="error.main"
        >
            {"Import Failed"}
        </Typography>}

        {!err && <Typography
            variant='h5'
        >
            {name}
        </Typography>}

        {props.editable && <FileInput
            sx={{ m: 2 }}
            onChange={(filename, buffer) => {
                try {
                    setErr(false);
                    props.snake_vm?.check_wasm(new Uint8Array(buffer));
                    setName(filename.replace(/\.[^/.]+$/, ""));
                    if (props.onChange) {
                        props.onChange(filename, new Uint8Array(buffer));
                    }
                } catch (e: any) {
                    setErr(true);
                    console.log("WASM CHECK FAILED:", e);
                    return;
                }
            }}>
            Select WASM File
        </FileInput>}
    </Box>;

}