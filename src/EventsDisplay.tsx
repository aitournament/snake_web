import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { List } from "react-virtualized";
import { EventEnvelope, Event } from "./event";
import TimestampDisplay from "./Timestamp";
import { VirtualizedTable } from "./VirtualizedTable";


export interface EventsDisplayProps {
    eventEnvelopes: EventEnvelope[]
}

interface RenderProps {
    key: any,
    index: any,
    isScrolling: any,
    isVisible: any,
    style: any,
}


export default function EventsDisplay(props: EventsDisplayProps) {


    // let [list, setList] = useState<string[]>([]);

    // let list:string[] = [];
    // for(let i=0; i<10000000; i++) {
    //     list.push(`Value ${i}`);
    // }

    // useEffect(() => {
    //     let interval: any = null;
    //     // if (running) {
    //       interval = setInterval(() => {
    //         setList((prevList) => 
    //             [...prevList, `Value ${prevList.length}`]
    //         )

    //       }, 5000);

    //     return () => {
    //       if (interval) {
    //         clearInterval(interval);
    //       }
    //     }
    //   }, []);

    function rowRenderer(input: RenderProps): JSX.Element {
        return (
            // <Box>
            <EventRow key={input.index} eventEnvelope={props.eventEnvelopes[input.index]} />
        );
    }
    return <Paper sx={{backgroundColor: 'grey.800'}}>
        <List
            width={800}
            height={300}
            rowCount={props.eventEnvelopes.length}
            rowHeight={24}
            rowRenderer={rowRenderer}
        // scrollToIndex={props.events.length-1}
        />
    </Paper>;

}

interface EventRowProps {
    key: number,
    eventEnvelope: EventEnvelope,
}

function EventRow(props: EventRowProps) {
    return <Box
        // key={props.id}
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
    // sx={{
    //     m: 5
    // }}
    >
        <TimestampDisplay timestamp={props.eventEnvelope.timestamp} sx={{ mr: 1 }} />
        <Typography style={{ display: "inline-block" }}>
            {getEventMessage(props.eventEnvelope.event)}
        </Typography>
    </Box>;
}

function getEventMessage(event: Event): string {
    switch (event.type) {
        case "SNAKE_ADDED": {
            let data = event.data;
            // console.log("Data: ", data);
            // event.data.snake_id
            return `Snake ${data.snakeId} added to team ${data.ownerId} at (${data.head.x}, ${data.head.y})`;
        }
        default: {
            return `Unknown type: (${event.type})`;
        }
    }
}