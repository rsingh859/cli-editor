export type CellTypes = 'code' | 'text';
export type DirectionType = 'up' | 'down';

export interface Cell {
    id: string;
    type: CellTypes;
    content: string;
}