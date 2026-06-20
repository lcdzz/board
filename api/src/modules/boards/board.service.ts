// board.service.ts
import prisma from '../../plugins/db';
import { NotFoundError } from '../../shared';
import { CreateBoardDto, UpdateBoardDto } from './board.types';

export const boardService = {
  async findAll() {
    return prisma.board.findMany({ orderBy: { createdDate: 'asc' } });
  },

  async findById(id: string) {
    const board = await prisma.board.findUnique({ where: { id } });
    if (!board) throw new NotFoundError();
    return prisma.board.findUnique({ where: { id } });
  },

  async exists(id: string): Promise<boolean> {
    const count = await prisma.board.count({ where: { id } });
    return count > 0;
  },

  async create(data: CreateBoardDto) {
    return prisma.board.create({ data });
  },

  async update(id: string, data: UpdateBoardDto) {
    const exists = await this.exists(id);
    if (!exists) throw new NotFoundError();
    return prisma.board.update({ where: { id }, data });
  },

  async delete(id: string) {
    const exists = await this.exists(id);
    if (!exists) throw new NotFoundError();
    await prisma.board.delete({ where: { id } });
  },
};
