import { Box, ListItem, ListItemButton, ListItemText, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
// import { List } from "react-virtualized";
import List from "@mui/material/List";
import { EventEnvelope, Event, Pos } from "./event";
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

function getEventMessage(event: Event): JSX.Element {
    switch (event.type) {
        case "SNAKE_ADDED": {
            let data = event.data;
            // let color = data.teamId == 0 ? "Red" : "Blue";
            return <p>{getColor(data.teamId)} snake {snakeId(data.snakeId)} added at {pos(data.head)}</p>;
        }
        case "FOOD_ADDED": {
            let data = event.data;
            return <p>Food added at {pos(data.pos)} with a health value of {data.healthValue}</p>;
        }
        case "SNAKE_SLEEP": {
            let data = event.data;
            // let color = data.teamId == 0 ? <span style={{color: 'red'}}>Red</span> : <span style={{color: 'blue'}}>Blue</span>;
            return <p>{getColor(data.teamId)} snake {snakeId(data.snakeId)} is sleeping for {data.cycles} cycles</p>;
        }
        case "SNAKE_MOVED": {
            let data = event.data;
            let description = data.forced ? "was forced to move" : (data.leap ? "leaped" : "moved");
            return <p>{getColor(data.teamId)} snake {snakeId(data.snakeId)} {description} from {pos(data.from)} to {pos(data.to)}</p>;
        }
        case "SNAKE_DIED": {
            let data = event.data;

            let reason;
            switch (data.reason.type) {
                case "TOO_SMALL_TO_SPLIT": {
                    reason = "too small to split";
                    break;
                }
                case "COLLISION": {
                    reason = "collision";
                    break;
                }
                case "MOVE_OUT_OF_BOUNDS": {
                    reason = "out of bounds move";
                    break;
                }
                case "NOT_READY_TO_LEAP": {
                    reason = "illegal leap";
                    break;
                }
                case "NOT_READY_TO_MOVE": {
                    reason = "illegal move";
                    break;
                }
                case "ZERO_HEALTH": {
                    reason = data.reason.data.type == "EAT" ? "zero health (ate poison)" : "zero health (hunger)";
                    break;
                }
                case "EXECUTION_FAILURE": {
                    switch (data.reason.data.type) {
                        case "MAIN_EXITED": {
                            reason = "code ended";
                            break;
                        }
                        case "UNREACHABLE": {
                            reason = "code panic";
                            break;
                        }
                        case "STACK_OVERFLOW": {
                            reason = "stack overflow";
                            break;
                        }
                        case "MEMORY_SIZE_EXCEEDED": {
                            reason = "out of memory";
                            break;
                        }
                        case "OUT_OF_BOUNDS_MEMORY_ACCESS": {
                            reason = "illegal memory access";
                            break;
                        }
                        case "DIVIDE_BY_ZERO": {
                            reason = "divide by zero";
                            break;
                        }
                        case "OUT_OF_BOUNDS_TABLE_ACCESS": {
                            reason = "illegal table access";
                            break;
                        }
                        case "INVALID_INDIRECT_CALL_TARGET": {
                            reason = "invalid indirect call target";
                            break;
                        }
                        case "UNIMPLEMENTED": {
                            reason = "Internal VM error. This is a bug, please report";
                            break;
                        }
                        case "INVALID_FUNCTION_INPUT": {
                            reason = "invalid function call";
                            break;
                        }
                    }
                }
            }
            return <p>{getColor(data.teamId)} snake {snakeId(data.snakeId)} died ({reason})</p>
        }
        default: {
            let event_any:any = event;
            console.log(`Type: ${event_any.type} with data: ${JSON.stringify(event_any.data)}`);
            return <p>Unknown type: ({event_any.type})</p>;
        }
    }
}

function getColor(teamId: number): JSX.Element {
    return teamId == 0 ? <span style={{color: 'red'}}>Red</span> : <span style={{color: 'blue'}}>Blue</span>;
}

function snakeId(id: number): JSX.Element {
    return <span style={{color: '#9e9e9e'}}>(id={id})</span>;
}

function pos(pos: Pos): JSX.Element {
    return <span style={{color: '#9e9e9e'}}>({pos.x}, {pos.y})</span>;
}