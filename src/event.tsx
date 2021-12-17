export interface EventEnvelope {
    timestamp: { tick: number, cycleInTick: number },
    event: Event,
}

// export interface Event {

// }

export type Event = {type: "SNAKE_ADDED", data: SnakeAddedEvent}
| {type: "FOOD_ADDED", data: FoodAddedEvent};

export interface Timestamp {
    tick: number,
    cycleInTick: number,
}

export interface SnakeAddedEvent {
    snakeId: number,
    ownerId: number,
    head: Pos,
}

export interface FoodAddedEvent {
    pos: Pos
}

export interface Pos {
    x: number,
    y: number,
}