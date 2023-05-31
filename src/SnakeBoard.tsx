const WIDTH = 31;
const HEIGHT = 21;

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
  poison: Food[],
  snakes: Snake[],
  winner: Winner,
  timestamp: Timestamp,
  loseReason?: string
}

export interface Snake {
  id: number,
  team_id: number,
  body: Pos[],
  health: number
}

interface SnakeBoardProps {
  state: BoardState,
}

function bodyConnector(
  color: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  percent: number,
): JSX.Element {
  let min_x = Math.min(x1, x2);
  let max_x = Math.max(x1, x2);
  let min_y = Math.min(y1, y2);
  let max_y = Math.max(y1, y2);

  let thickness = TILE_SIZE * 0.5 * percent;

  if (y1 == y2) {
    // horizontal
    return <rect
      x={min_x * TILE_SIZE + TILE_SIZE * 0.5}
      y={min_y * TILE_SIZE + TILE_SIZE * 0.5 - thickness / 2}
      width={TILE_SIZE}
      height={thickness}
      fill={color}
    />;
  } else {
    return <rect
      x={min_x * TILE_SIZE + TILE_SIZE * 0.5 - thickness / 2}
      y={min_y * TILE_SIZE + TILE_SIZE * 0.5}
      width={thickness}
      height={TILE_SIZE}
      fill={color}
    />;
  }

  
}

export default function SnakeBoard(props: SnakeBoardProps) {
  // console.log('State: ', props.state);

  let elements = [];
  for(let snake_i = 0; snake_i < props.state.snakes.length; snake_i += 1) {
    let snake = props.state.snakes[snake_i];
    let color = snake.team_id == 0 ? '#ff4242': '#4242ff';

    for(let body_i = 0; body_i < snake.body.length; body_i += 1) {
      let size = body_i == 0? 0.7 : 0.5;
      let {x, y} = snake.body[body_i];

      elements.push(<circle
        key={`${x}.${y}`}
        cx={x * TILE_SIZE + TILE_SIZE / 2}
        cy={y * TILE_SIZE + TILE_SIZE / 2}
        r={(TILE_SIZE / 2) * size}
        fill={color}/>);

      if (body_i > 0) {
        // add body connector
        let prev_body = snake.body[body_i - 1];
        let prev_x = prev_body.x;
        let prev_y = prev_body.y;
        elements.push(bodyConnector(color, prev_x, prev_y, x, y, snake.health / 100));
      }
    }
  }


  return <svg
      width={WIDTH * TILE_SIZE}
      height={HEIGHT * TILE_SIZE}
      style={{border: '1px solid gray'}}
  >
    {props.state.food.map((food, i) => {
      let size = Math.max((Math.abs(food.healthValue) / 50) * 0.7, 0.20);

      return <>  
      <circle
          key={i}
          cx={food.pos.x * TILE_SIZE + TILE_SIZE / 2}
          cy={food.pos.y * TILE_SIZE + TILE_SIZE / 2}
          r={(TILE_SIZE / 2) * size}
          fill="green"/>
          
      </>;
    })}
    {props.state.poison.map((food, i) => {
      let size = Math.max((Math.abs(food.healthValue) / 50) * 0.7, 0.20);

      return <>  
      <circle
          key={i}
          cx={food.pos.x * TILE_SIZE + TILE_SIZE / 2}
          cy={food.pos.y * TILE_SIZE + TILE_SIZE / 2}
          r={(TILE_SIZE / 2) * size}
          fill="yellow"/>
          
      </>;
    })}
    { elements }
  </svg>;
}