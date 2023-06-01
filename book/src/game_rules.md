# Game Rules

Each player controls a team of snakes, controlled by a WebAssembly file. Two teams compete at a time.
The last player with a snake remaining in the game wins. If both teams lose their last snake on the same CPU cycle, the game is a tie.

The game rules were designed to guarantee games will end in a finite amount of time.

## Setup

Each team will start with a single snake, randomly placed in the arena with a length of 1, and full health (100).

Five food will be randomly placed around the arena.

## Ticks and CPU Cycles

One tick occurs every second of game play. There are 60,000 CPU cycles executed in each tick, for each snake. The programs of each snake are ran simultaneously, in lock-step with each other. A CPU cycle is roughly equal to a single WASM op-code being executed.

The snake runtime is 100% deterministic. Replaying the same game with the same WebAssembly files, initial seed, and same version of snake will have the same result. This is useful to be able to re-play games.

## Moves

Every snake is _required_ to move every tick. However, you may choose to move any time during the tick that you wish. If a snake fails to move it will be _forced_ to move at the end of the tick (in the direction currently set for the snake).

Colliding with the walls of the arena, or another snake, will result in the death of the snake.

Moving on top of food will consume the food and immediately heal and grow the snake.

If the snake's head is on top of poison at the end of a tick, it will be damaged, potentially killing the snake. Poison is permanent and will not be consumed.

Moves for snakes are resolved after every CPU cycle. It is possible that multiple snakes move on the exact same CPU cycle. Those moves will be resolved simultaneously. In rare cases, multiple snakes may try to move onto the same position on the same CPU cycle, which will result in all of them dying.

An additional move (called a leap) may occur at most once every 2 ticks. A leap must occur after a move has already been performed in the same tick. A leap uses extra energy from the snake, which will result in the snake losing the last section of its tail (which will become poison).

## Health

Each snake starts with 100 health. One health is lost at the end of each tick. If a snake's health reaches 0, it immediately dies. Health can be increased by eating food, or decreased when on poison.

## Food

Food has a health value, which is the amount that a snake's health with increase by consuming it. Snakes will also increase in length by one after consuming food (regardless of the health value).

Freshly spanwed food will start with a health value of 1, and increases by 1 every tick up to a maximum of 50.

New food will be spawned at the end of each tick to ensure there is always 5 food available (unless there is no more room in the arena).

## Poison

Poison also has a health value. This is the amount that a snake's health will be _damaged_. If the snake's head is on top of poison at the end of a tick it will take damage from the poison, potentially killing it.

Poison starts with a health value of 1, and increases by 1 every tick up to a maximum of 50. Poison is permanent, and can never be removed.

It is possible to cross over poison without taking damage by utilizing a properly timed leap.

When part (or all) of a snake dies, it drops to the ground as poison.


## Observing

Snakes can observe a single position in the arena to determine what is at that location. There is no limit to how often a snake can observe, except for the CPU cycles consumed from the running code.

## Splitting

Once a snake has fully matured (is a size of at least 9), it is capable of splitting. A split will result in a new snake being created. The snake is split into 3 equal parts (with the middle section rounding up if not divisible by 3). The front will remain as the original snake. The middle will die and turn into (poisonous) food. The end will become a new snake. The program is forked when this happens, and both snakes continue to run independently. The new snake will start with the same health as the parent snake.

## Speaking

Yes, snakes can talk! This can be used for debugging, or some friendly taunting.

Speaking is limited in length to 50 characters at a time, anything longer will be truncated. Each snake can speak at most twice per tick. Anything else will be ignored.

## Resource limits

A WASM file has a maximum size of 5 MB. If it is too large, it will be rejected and cannot be used.

The maximum stack size is 2 MB. If this is exceeded, the snake will die.

Programs are limited to using at most 32 WASM memory pages. Each page is 64 KB, which means you get a maximum of 2 MB. If you exceed this, the snake will die.

If the program terminates for any reason, the snake will die. This could, for example, be due to the main function returning, dividing by 0, accessing invalid memory, using an SDK function with invalid arguments, etc.

There is no CPU limit, but using too many CPU cycles between moves may result in a forced move, potentially killing the snake. 

