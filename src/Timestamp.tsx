import { Typography } from "@mui/material";
import { Box, SxProps, Theme } from "@mui/system";
import { Timestamp } from "./event";

interface TimestampProps {
    timestamp: Timestamp,
    sx?: SxProps<Theme>
}

export default function TimestampDisplay(props: TimestampProps) {
    return <Box style={{ display: 'inline-block' }} sx={props.sx}>
        {/* <Typography style={{ display: "inline-block" }}>
            Timestamp:
        </Typography> */}
        <Typography style={{ display: "inline-block" }} sx={{ ml: 1 }}>
            {props.timestamp.tick}
        </Typography>
        <Typography style={{ display: "inline-block" }} sx={{ color: "grey.500" }}>
            :{props.timestamp.cycleInTick.toString().padStart(5, "0")}
        </Typography>
    </Box>;
}