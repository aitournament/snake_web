import { Box, ListItem, ListItemButton, ListItemText, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
// import { List } from "react-virtualized";
import List from "@mui/material/List";
import { EventEnvelope, Event } from "./event";
import TimestampDisplay from "./Timestamp";
// import { VirtualizedTable } from "./VirtualizedTable";
import { FixedSizeList, ListChildComponentProps } from "react-window";


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

    // function renderRow(input: RenderProps): JSX.Element {
    //     return (
    //         // <Box>
    //         <EventRow key={input.index} eventEnvelope={props.eventEnvelopes[input.index]} />
    //     );
    // }
    function renderRow(props: ListChildComponentProps) {
        const { data, index, style } = props;
        // console.log("Props:", props);
      
        return (
          <ListItem style={style} key={index} component="div" disablePadding>
            <EventRow key={index} eventEnvelope={data[index]} />
            {/* <ListItemButton>
              <ListItemText primary={`Item ${index + 1}`} />
            </ListItemButton> */}
          </ListItem>
        );
      }

    let rows:any = [];

    props.eventEnvelopes.forEach((envelope, i) => {
        rows.push(<EventRow key={i} eventEnvelope={envelope} />)
    });

    return <Paper sx={{backgroundColor: 'grey.800'}}>
        
        {/* <List style = {{width: 800, height: 300}}>
            {rows}
        </List> */}
        <FixedSizeList
        height={300}
        width={800}
        itemSize={24}
        itemData={props.eventEnvelopes}
        itemCount={props.eventEnvelopes.length}
        overscanCount={5}
      >
        {renderRow}
      </FixedSizeList>
        
        {/* <List
            width={800}
            height={300}
            rowCount={props.eventEnvelopes.length}
            rowHeight={16}
            rowRenderer={rowRenderer}
        // scrollToIndex={props.events.length-1}
        /> */}
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
            let color = data.teamId == 0 ? "Red" : "Blue";
            return `${color} snake (id=${data.snakeId}) added at (${data.head.x}, ${data.head.y})`;
        }
        case "FOOD_ADDED": {
            let data = event.data;
            return `Food added at (${data.pos.x}, ${data.pos.y}) with a health value of ${data.healthValue}`;
        }
        case "SNAKE_SLEEP": {
            let data = event.data;
            let color = data.teamId == 0 ? "Red" : "Blue";
            return `${color} snake (id=${data.snakeId}) is sleeping for ${data.cycles} cycles`;
        }
        case "SNAKE_MOVED": {
            let data = event.data;
            let color = data.teamId == 0 ? "Red" : "Blue";
            let description = data.forced ? "was forced to move" : (data.leap ? "leaped" : "moved");
            return `${color} snake (id=${data.snakeId}) ${description} from (${data.from.x}, ${data.from.y}) to (${data.to.x}, ${data.to.y})`;
        }
        default: {
            let event_any:any = event;
            console.log(`Type: ${event_any.type} with data: ${JSON.stringify(event_any.data)}`);
            return `Unknown type: (${event_any.type})`;
        }
    }
}