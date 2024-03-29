import { Box, ListItem, Paper, Typography } from "@mui/material";
import { EventEnvelope, Event, Pos, SnakeDiedEvent } from "./event";
import TimestampDisplay from "./Timestamp";
import { FixedSizeList, ListChildComponentProps } from "react-window";


export interface EventsDisplayProps {
    eventEnvelopes: EventEnvelope[]
}

export default function EventsDisplay(props: EventsDisplayProps) {
    function renderRow(props: ListChildComponentProps) {
        const { data, index, style } = props;
        return (
          <ListItem style={style} key={index} component="div" disablePadding>
            <EventRow key={index} eventEnvelope={data[index]} />
          </ListItem>
        );
      }

    let rows:any = [];

    props.eventEnvelopes.forEach((envelope, i) => {
        rows.push(<EventRow key={i} eventEnvelope={envelope} />)
    });

    return <Paper sx={{backgroundColor: 'grey.800'}}>
        <FixedSizeList
        height={200}
        width={800}
        itemSize={24}
        itemData={props.eventEnvelopes}
        itemCount={props.eventEnvelopes.length}
        overscanCount={5}
      >
        {renderRow}
      </FixedSizeList>
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

export function getSnakeDiedReason(event: SnakeDiedEvent): string {
    switch (event.reason.type) {
        case "TOO_SMALL_TO_SPLIT": {
            return "too small to split";
        }
        case "COLLISION": {
            return "collision: snake";
        }
        case "MOVE_OUT_OF_BOUNDS": {
            return "collision: arena";
        }
        case "NOT_READY_TO_LEAP": {
            return "illegal leap";
        }
        case "NOT_READY_TO_MOVE": {
            return "illegal move";
        }
        case "ZERO_HEALTH": {
            return event.reason.data.type === "POISON" ? "zero health (poison)" : "zero health (hunger)";
        }
        case "EXECUTION_FAILURE": {
            switch (event.reason.data.type) {
                case "MAIN_EXITED": {
                    return "code ended";
                }
                case "UNREACHABLE": {
                    return "unreachable executed";
                }
                case "STACK_OVERFLOW": {
                    return "stack overflow";
                }
                case "MEMORY_SIZE_EXCEEDED": {
                    return "out of memory";
                }
                case "OUT_OF_BOUNDS_MEMORY_ACCESS": {
                    return "illegal memory access";
                }
                case "DIVIDE_BY_ZERO": {
                    return "divide by zero";
                }
                case "OUT_OF_BOUNDS_TABLE_ACCESS": {
                    return "illegal table access";
                }
                case "INVALID_INDIRECT_CALL_TARGET": {
                    return "illegal indirect call target";
                }
                case "UNIMPLEMENTED": {
                    return "internal VM error: this is a bug, please report";
                }
                case "INVALID_FUNCTION_INPUT": {
                    return "invalid function call";
                }
            }
        }
    }
    return "unknown";
}

function getEventMessage(event: Event): JSX.Element {
    switch (event.type) {
        case "SNAKE_ADDED": {
            let data = event.data;
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
        case "SNAKE_SPLIT": {
            let data = event.data;
            return <p>{getColor(data.teamId)} snake split into two!</p>;
        }
        case "SNAKE_DIED": {
            let data = event.data;
            let reason = getSnakeDiedReason(data);
            return <p>{getColor(data.teamId)} snake {snakeId(data.snakeId)} died ({reason})</p>
        }
        case "LOG": {
            let data = event.data;
            let color = teamColor(data.teamId);
            return <p>{getColor(data.teamId)} snake {snakeId(data.snakeId)} says: <span style={{color: color}}>{data.msg}</span></p> 
        }
        default: {
            let event_any:any = event;
            console.log(`Type: ${event_any.type} with data: ${JSON.stringify(event_any.data)}`);
            return <p>Unknown type: ({event_any.type})</p>;
        }
    }
}

function teamColor(teamId: number): string {
    return teamId === 0 ? "#ff8888": "#8888ff";
}

function getColor(teamId: number): JSX.Element {
    return teamId === 0 ? <span style={{color: '#ff8888'}}>Red</span> : <span style={{color: '#8888ff'}}>Blue</span>;
}

function snakeId(id: number): JSX.Element {
    return <span style={{color: '#9e9e9e'}}>(id={id})</span>;
}

function pos(pos: Pos): JSX.Element {
    return <span style={{color: '#9e9e9e'}}>({pos.x}, {pos.y})</span>;
}