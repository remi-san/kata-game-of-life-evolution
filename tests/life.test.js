import { Cell, Grid } from '../src/life.js';

describe('Cell tests', () => {

    it('a cell becomes alive if it has exactly three alive neighbors', () => {
        let cell = Cell.dead();
        expect(
            cell.nextState([
                Cell.alive(),
                Cell.alive(),
                Cell.alive(),
                Cell.dead(),
                Cell.dead(),
                Cell.dead(),
                Cell.dead(),
                Cell.dead()
            ]).isAlive
        ).toBe(true);
    });

    it('a cell becomes dead if there are more than three alive neighbors', () => {
        let cell = Cell.alive();
        expect(
            cell.nextState([
                Cell.alive(),
                Cell.alive(),
                Cell.alive(),
                Cell.alive(),
                Cell.alive(),
                Cell.alive(),
                Cell.alive(),
                Cell.alive(),
            ]).isAlive
        ).toBe(false);
    });

    it('a cell becomes dead if there are less than two alive neighbors', () => {
        let cell = Cell.alive();
        expect(
            cell.nextState([
                Cell.alive(),
                Cell.dead(),
                Cell.dead(),
                Cell.dead(),
                Cell.dead(),
                Cell.dead(),
                Cell.dead(),
                Cell.dead(),
            ]).isAlive
        ).toBe(false);
    });

    it('a cell stays in the same state if there are exactly two alive neighbors', () => {
        let cell = Cell.alive();
        expect(
            cell.nextState([
                Cell.alive(),
                Cell.alive(),
                Cell.dead(),
                Cell.dead(),
                Cell.dead(),
                Cell.dead(),
                Cell.dead(),
                Cell.dead(),
            ]).isAlive
        ).toBe(true);
    });
});

describe('Grid tests', () => {

    it('a grid can return the cell at given position', () => {
        let expectedCell = Cell.alive();
        let grid = new Grid([
            [ expectedCell ]
        ]);
        expect(grid.cellAt(0,0)).toBe(expectedCell);
    });

    it('a grid can give neighbors of a position', () => {
        let grid = new Grid([
            [ Cell.alive(), Cell.alive() ],
            [ Cell.dead(), Cell.dead()]
        ]);
        expect(
            grid.cellNeighborsAt(0,0)
        ).toEqual([
            Cell.dead(),
            Cell.dead(),
            Cell.dead(),
            Cell.dead(),
            Cell.alive(),
            Cell.dead(),
            Cell.dead(),
            Cell.dead()
        ]);
    });

    it('a grid can give its next state', () => {
        let grid = new Grid([
            [ Cell.alive(), Cell.alive() ],
            [ Cell.alive(), Cell.dead()]
        ]);

        expect(
            grid.nextState()
        ).toEqual(
            new Grid([
                [ Cell.alive(), Cell.alive() ],
                [ Cell.alive(), Cell.alive()]
            ])
        );
    });

    it('a grid can tell if it still has a living cell', () => {
        expect(
            new Grid([
                [ Cell.alive(), Cell.alive() ],
                [ Cell.alive(), Cell.dead()]
            ]).hasAliveCells()
        ).toBe(true);

        expect(
            new Grid([
                [ Cell.dead(), Cell.dead() ],
                [ Cell.dead(), Cell.dead()]
            ]).hasAliveCells()
        ).toBe(false);
    });
});