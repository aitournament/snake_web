
import { Button } from "@mui/material";
import React, {ReactChild, ReactChildren, ReactNode} from "react";

interface FileInputProps {
    children?: ReactNode,
    onChange?: (filename: string, bytes: ArrayBuffer) => void
}

export default function FileInput(props: FileInputProps) {
    return <Button
        variant="contained"
        component="label"
        color="success"
    >
        {props.children}
        <input
            type="file"
            hidden
            onChange={(e) => {
                if ((e.target.files || []).length > 0) {
                    let file = e?.target?.files?.[0];
                    if (file) {
                        let filename = file.name;
                        file.arrayBuffer().then(buffer => {
                            if (props.onChange) {
                                props.onChange(filename, buffer);
                            }
                        })
                    }
                }
            }}
        />
    </Button>;
}