import { Board, Card, Column } from '@prisma/client';

export type CreateBoardDto = {
  name: string;
};

export type UpdateBoardDto = CreateBoardDto;

export type BoardWithDetails = Board & {
  columns: (Column & {
    cards: Card[];
  })[];
};
