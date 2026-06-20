export type CreateColumnDto = {
  boardId: string;
  name: string;
};

export type UpdateColumnDto = {
  name: string;
};

export type MoveColumnDto = {
  sequence: number;
};
