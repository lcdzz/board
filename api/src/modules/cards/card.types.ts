export type CreateCardDto = {
  columnId: string;
  name: string;
  description?: string;
};

export type UpdateCardDto = {
  name: string;
  description?: string;
};

export type MoveCardDto = {
  columnId: string;
  sequence: number;
};
