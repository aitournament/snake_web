const WIDTH = 30;
const HEIGHT = 20;

const TILE_SIZE = 20;

interface Pos {
  x: number,
  y: number,
}

interface Timestamp {
  tick: number,
  cycleInTick: number,
}

interface Food {
  pos: Pos,
  healthValue: number
}

type Winner = {type: "win", data: number} | {type: "pending"} | {type: "tie"};


export interface BoardState {
  food: Food[],
  snakes: Snake[],
  winner: Winner,
  timestamp: Timestamp
}

export interface Snake {
  id: number,
  owner_id: number,
  body: Pos[]
}

interface SnakeBoardProps {
  state: BoardState,
}

export default function SnakeBoard(props: SnakeBoardProps) {
  console.log('State: ', props.state);
  return <svg
      width={WIDTH * TILE_SIZE}
      height={HEIGHT * TILE_SIZE}
      style={{border: '1px solid gray'}}
  >
    {props.state.food.map((food, i) => {
      return <circle
          key={i}
          cx={food.pos.x * TILE_SIZE + TILE_SIZE / 2}
          cy={food.pos.y * TILE_SIZE + TILE_SIZE / 2}
          r={(TILE_SIZE / 2) * 0.30}
          fill="green"/>;
    })}
    {props.state.snakes.map((snake, snake_i) => {
      let color = snake.owner_id == 0 ? 'red': 'blue';
      return snake.body.map(({x,y}, body_i) => {
        let size = body_i == 0? 0.7 : 0.5;
        return <circle
            key={`${x}.${y}`}
            cx={x * TILE_SIZE + TILE_SIZE / 2}
            cy={y * TILE_SIZE + TILE_SIZE / 2}
            r={(TILE_SIZE / 2) * size}
            fill={color}/>;
      });
    })}
  </svg>;
}