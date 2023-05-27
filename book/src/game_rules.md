# Game Rules

Each player controls a team of snakes, controlled by a WASM file. Two teams compete at a time.
The last player remaining in the game wins. If both teams lose their last snake on the same CPU cycle, the game is a tie.

The game rules are designed to ensure games will end in a finite amount of time.

## Setup

Each team will start with a single snake, randomly placed in the arena with a size of 1. Snakes will start with full health (100).

Five food will be randomly placed around the arena.

## Ticks and CPU Cycles

One tick occurs every second of game play. There are 60,000 CPU cycles executed in each tick, for each snake. The programs of each snake are ran simultaneously, in lock-step with each other. A CPU cycle is roughly equal to a single WASM op-code being executed.

The snake runtime is 100% deterministic. Replaying the same game with the same WASM files, initial seed, and same version of Snake will have the same result. This is useful to be able to re-play games.

## Moves

Every snake is _required_ to move every tick. You may choose to move any time during the tick that you wish, and the move will happen immediately. This means that not all snakes will move at the same time.
If a snake fails to move, it will be _forced_ to move at the end of the tick, in the direction currently set for the snake.

Colliding with the walls of the arena, or another snake, will result in the death of the snake.

Moving on top of food (or poison) will eat the food, causing the snake to gain/lose health, and grow longer.

Moves for snakes are resolved after every CPU cycle. It is possible that multiple snakes move on the exact same CPU cycle. Those moves will be resolved simultaneously. In rare cases, multiple snakes may try to move onto the same position on the same CPU cycle, which will result in both of them dying.

An additional move (called a leap) may occur at most once every 2 ticks. A leap must occur after a move has already been performed in tick. A leap uses extra energy from the snake, which will result in the snake losing the last section of its tail (which will become poisonous food).

## Health

Each snake starts with 100 health. One health is lost at the end of each tick. If a snake's health reaches 0, it immediately dies. Health can be increased by eating food, or decreased when eating poisonous food.

## Food

Food has a health value, which is the amount that a snake's health with increase/decrease by eating it. Snakes will always grow when eating food, regardless of the health value.


Freshly spanwed food will start with a health value of 1, and increase by 1 every tick up to a maximum of 50.

When part (or all) of a snake dies, it drops to the ground as (poisonous) food. These start with a health value of -50, and increase by 1 every tick up to a maximum of 0.

New food will be spawned at the end of each tick to ensure there is always at least 5 food with a health value greater than zero.

## Observing

Snakes can observe a single position in the arena to determine what is at that location. There is no limit to how often a snake can observe, except for the CPU cycles consumed from the running code.

## Splitting

Once a snake has fully matured (is a size of at least 9), it is capable of splitting. A split will result in a new snake being created. The snake is split into 3 equal parts (with the middle section rounding up if not divisible by 3). The front will remain as the original snake. The middle will die and turn into (poisonous) food. The end will become a new snake. The program is forked when this happens, and both snakes continue to run independently. The new snake will start with the same health as the parent snake.

## Resource limits

A WASM file has a maximum size of 5 MB. If it is too large, it will be rejected and cannot be used.

The maximum stack size is 2 MB. If this is exceeded, the snake will die.

Programs are limited to using at most 32 WASM memory pages (heap memory). Each page is 64 KB, which means you get a maximum of 2 MB. If you exceed this, the snake will die.

If the program terminates for any reason, the snake will die. This could, for example, be due to the main function returning, dividing by 0, accessing invalid memory, using an SDK function with invalid arguments, etc.

There is no CPU limit, but using too many CPU cycles between moves may result in a forced move, potentially killing the snake. 

