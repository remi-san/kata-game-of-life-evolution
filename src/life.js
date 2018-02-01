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

export class Cell {

    isAlive: bool;

    constructor(isAlive: bool){
        this.isAlive = isAlive;
    }

    nextState(neighbors: Neighbors): Cell
    {
        const aliveNeighbors = neighbors.filter(cell => cell.isAlive);

        if (aliveNeighbors.length === 2) return this;

        if (aliveNeighbors.length === 3) return Cell.alive();

        return Cell.dead();
    }

    static alive(): Cell
    {
        return new Cell(true);
    }

    static dead(): Cell
    {
        return new Cell(false);
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

    hasAliveCells(): boolean
    {
        return this.cells.reduce(
            (hasAliveCells: boolean, column: Cell[]) => column.reduce(
                (hasAliveCells: boolean, cell: Cell) => hasAliveCells || cell.isAlive,
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
