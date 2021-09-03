const WIDTH = 30;
const HEIGHT = 20;

const TILE_SIZE = 20;

interface Pos {
  x: number,
  y: number,
}

export interface BoardState {
  food: Pos[],
  snakes: Snake[],
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
    {props.state.food.map((pos, i) => {
      return <circle
          key={i}
          cx={pos.x * TILE_SIZE + TILE_SIZE / 2}
          cy={pos.y * TILE_SIZE + TILE_SIZE / 2}
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