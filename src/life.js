//@flow

type Neighbors = [
    Cell,
    Cell,
    Cell,
    Cell,
    Cell,
    Cell,
    Cell,
    Cell
];

type Player = {
    name: string
};

type PlayerCellsCounter = {
    player: ?Player,
    cellCount: number
};

class PlayerCellsCounters {
    counters: PlayerCellsCounter[];

    constructor(counters: PlayerCellsCounter[])
    {
        this.counters = counters;
    }

    initCounterForPlayer(player: Player): PlayerCellsCounters
    {
        if (this.getCounterForPlayer(player) !== null) {
            return this;
        }

        return new PlayerCellsCounters(
            this.counters.concat({
                player,
                cellCount: 0
            })
        )
    }

    getCounterForPlayer(player: Player): ?PlayerCellsCounter
    {
        let filteredCounters = this.counters.filter((currentCounter) => currentCounter.player == player);
        if (filteredCounters.length === 1) {
            return filteredCounters[0];
        }

        return null;
    }

    addCellForPlayer(player: ?Player): PlayerCellsCounters
    {
        if (player === null || player === undefined) {
            return this;
        }

        return new PlayerCellsCounters(
            this.initCounterForPlayer(player).counters.map(
                (counter: PlayerCellsCounter) => (counter.player == player) ? { player, cellCount: counter.cellCount+1 } : counter
            )
        );
    }

    getHighestCellCountOwner(): ?Player
    {
        let maxCellCount = Math.max(...this.counters.map((currentCounter: PlayerCellsCounter) => currentCounter.cellCount));
        let playersWithMaxCount = this.counters.filter((counter: PlayerCellsCounter) => counter.cellCount === maxCellCount);

        if (playersWithMaxCount.length === 1) {
            return playersWithMaxCount[0].player;
        }

        return null;
    }
}

export class Cell {

    isAlive: bool;
    owner: ?Player;

    constructor(isAlive: bool, owner: ?Player = null){
        this.isAlive = isAlive;
        this.owner = owner;
    }

    nextState(neighbors: Neighbors): Cell
    {
        const aliveNeighbors: Cell[] = neighbors.filter((cell: Cell) => cell.isAlive);

        if (aliveNeighbors.length === 2) return this;

        if (aliveNeighbors.length === 3) {
            const counters: PlayerCellsCounters = aliveNeighbors.reduce(
                (counters: PlayerCellsCounters, cell: Cell) => counters.addCellForPlayer(cell.owner),
                new PlayerCellsCounters([])
            );

            return Cell.alive(counters.getHighestCellCountOwner());
        }

        return Cell.dead();
    }

    isOwnedBy(owner: Player): bool
    {
        return this.owner == owner;
    }

    hasOwner(): bool
    {
        return this.owner !== null;
    }

    static alive(owner: ?Player = null): Cell
    {
        return new Cell(true, owner);
    }

    static dead(): Cell
    {
        return new Cell(false, null);
    }
}

export class Grid {
    cells: Cell[][];

    constructor(cells: Cell[][]){
        this.cells = cells;
    }

    cellAt(x: number, y: number): Cell
    {
        if (this.cells[x] === undefined || this.cells[x][y] === undefined) {
            return Cell.dead();
        }

        return this.cells[x][y];
    }

    cellNeighborsAt(x: number, y: number): Neighbors
    {
        return [
            this.cellAt(x-1, y-1),
            this.cellAt(x-1, y),
            this.cellAt(x-1, y+1),
            this.cellAt(x, y-1),
            this.cellAt(x, y+1),
            this.cellAt(x+1, y-1),
            this.cellAt(x+1, y),
            this.cellAt(x+1, y+1)
        ];
    }

    nextState(): Grid
    {
        return new Grid(
            this.cells.map(
                (column: Cell[], x: number) => column.map(
                    (cell: Cell, y: number) => this.cellAt(x, y).nextState(this.cellNeighborsAt(x, y)),
                )
            )
        );
    }

    hasAliveCells(): bool
    {
        return this.cells.reduce(
            (hasAliveCells: bool, column: Cell[]) => column.reduce(
                (hasAliveCells: bool, cell: Cell) => hasAliveCells || cell.isAlive,
                false
            ),
            false
        );
    }
}

function getGridAsString(grid: Grid): string
{
    return grid.cells.reduce(
        (stringifiedGrid: string, column: Cell[]) => stringifiedGrid + column.reduce(
            (stringifiedColumn: string, cell: Cell) => stringifiedColumn + (cell.isAlive ? 'X' : '0'),
            ''
        ) + '\n',
        ''
    );
}

function run(grid: Grid): void
{
    while(grid.hasAliveCells()) {
        setTimeout(() => {
            console.log(getGridAsString(grid))
        }, 500);

        grid = grid.nextState();
    }
}

console.log(getGridAsString(
    new Grid([
        [ Cell.alive(), Cell.alive() ],
        [ Cell.alive(), Cell.dead()]
    ])
));
