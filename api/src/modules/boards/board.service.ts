import prisma from '@plugins/db';
import { NotFoundError } from '@shared/errors';
import { BoardWithDetails, CreateBoardDto, UpdateBoardDto } from './board.types';

class BoardService {
  async findAll() {
    return prisma.board.findMany({ orderBy: { name: 'asc' } });
  }

  async findByIdWithDetails(id: string): Promise<BoardWithDetails> {
    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        columns: {
          orderBy: { sequence: 'asc' },
          include: {
            cards: {
              orderBy: { sequence: 'asc' },
            },
          },
        },
      },
    });

    if (!board) throw new NotFoundError(`Board ${id} not found`);
    return board;
  }

  async exists(id: string): Promise<boolean> {
    const count = await prisma.board.count({ where: { id } });
    return count > 0;
  }

  async create(dto: CreateBoardDto) {
    return prisma.board.create({ data: { ...dto, createdDtUtc: new Date() } });
  }

  async update(id: string, dto: UpdateBoardDto) {
    const exists = await this.exists(id);
    if (!exists) throw new NotFoundError();
    return prisma.board.update({ where: { id }, data: { ...dto, lastUpdatedDtUtc: new Date() } });
  }

  async delete(id: string) {
    const exists = await this.exists(id);
    if (!exists) throw new NotFoundError();
    await prisma.board.delete({ where: { id } });
  }
}

export const boardService = new BoardService();
