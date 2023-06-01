export interface EventEnvelope {
    timestamp: { tick: number, cycleInTick: number },
    event: Event,
}

// export interface Event {

// }

export type Event = 
{type: "SNAKE_ADDED", data: SnakeAddedEvent} |
{type: "FOOD_ADDED", data: FoodAddedEvent} |
{type: "SNAKE_SLEEP", data: SnakeSleepEvent} |
{type: "SNAKE_MOVED", data: SnakeMovedEvent} |
{type: "SNAKE_SPLIT", data: SnakeSplitEvent} |
{type: "SNAKE_DIED", data: SnakeDiedEvent} |
{type: "LOG", data: LogEvent};

export interface SnakeSplitEvent {
    teamId: number,
    frontSnake: Pos,
    backSnake: Pos
}

export interface LogEvent {
    snakeId: number,
    teamId: number,
    msg: string
}

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

export interface SnakeMovedEvent {
    snakeId: number,
    teamId: number,
    from: Pos,
    to: Pos,
    leap: boolean,
    forced: boolean,
}

export interface SnakeDiedEvent {
    snakeId: number,
    teamId: number,
    head: Pos,
    reason: SnakeDeathReason
}

export type SnakeDeathReason = 
{type: "TOO_SMALL_TO_SPLIT"} |
{type: "MOVE_OUT_OF_BOUNDS"} |
{type: "NOT_READY_TO_LEAP"} |
{type: "NOT_READY_TO_MOVE"} |
{type: "ZERO_HEALTH", data: HealthDeathReason} |
{type: "EXECUTION_FAILURE", data: ExecutionFailure} |
{type: "COLLISION", data: CollisionData} |
{type: "SUICIDE"};

export type HealthDeathReason = 
{type: "POISON"} |
{type: "TIME"};

export type ExecutionFailure = 
{type: "MAIN_EXITED"} |
{type: "UNREACHABLE"} |
{type: "STACK_OVERFLOW"} |
{type: "MEMORY_SIZE_EXCEEDED"} |
{type: "OUT_OF_BOUNDS_MEMORY_ACCESS"} |
{type: "DIVIDE_BY_ZERO"} |
{type: "OUT_OF_BOUNDS_TABLE_ACCESS"} |
{type: "INVALID_INDIRECT_CALL_TARGET"} |
{type: "UNIMPLEMENTED", data: string } |
{type: "INVALID_FUNCTION_INPUT", data: InvalidFunctionInputData};

export interface InvalidFunctionInputData {
    functionName: string
}

export interface CollisionData {
    snakeIds: string[]
}

export interface FoodAddedEvent {
    pos: Pos,
    healthValue: number
}

export interface Pos {
    x: number,
    y: number,
}