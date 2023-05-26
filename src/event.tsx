export interface EventEnvelope {
    timestamp: { tick: number, cycleInTick: number },
    event: Event,
}

// export interface Event {

// }

export type Event = 
{type: "SNAKE_ADDED", data: SnakeAddedEvent} |
{type: "FOOD_ADDED", data: FoodAddedEvent} |
{type: "SNAKE_SLEEP", data: SnakeSleepEvent}|
{type: "SNAKE_MOVED", data: SnakeMoveEvent};

export interface Timestamp {
    tick: number,
    cycleInTick: number,
}

export interface SnakeAddedEvent {
    snakeId: number,
    teamId: number,
    head: Pos,
}

export interface SnakeSleepEvent {
    snakeId: number,
    teamId: number,
    cycles: number,
}

export interface SnakeMoveEvent {
    snakeId: number,
    teamId: number,
    from: Pos,
    to: Pos,
    leap: boolean,
    forced: boolean,
}

export interface FoodAddedEvent {
    pos: Pos,
    healthValue: number
}

export interface Pos {
    x: number,
    y: number,
}