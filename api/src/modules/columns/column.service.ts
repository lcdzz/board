import { boardService } from '@modules/boards';
import prisma from '@plugins/db';
import type { Prisma } from '@prisma/client';
import { NotFoundError, ValidationError } from '@shared/errors';

import { CreateColumnDto, MoveColumnDto, UpdateColumnDto } from './column.types';

type ColumnSequenceUpdate = {
  id: string;
  sequence: number;
};

class ColumnService {
  private static readonly TEMP_COLUMN_SEQUENCE_BASE = -1000000;

  async findAll() {
    return prisma.column.findMany({ orderBy: { sequence: 'asc' } });
  }

  async findById(id: string) {
    const column = await prisma.column.findUnique({ where: { id } });
    if (!column) throw new NotFoundError();
    return column;
  }

  async exists(id: string): Promise<boolean> {
    const count = await prisma.column.count({ where: { id } });
    return count > 0;
  }

  async create(dto: CreateColumnDto) {
    if (!(await boardService.exists(dto.boardId))) throw new ValidationError("Board doesn't exist.");

    const count = await prisma.column.count({ where: { boardId: dto.boardId } });
    return prisma.column.create({
      data: {
        ...dto,
        sequence: count,
        createdDtUtc: new Date(),
      },
    });
  }

  async update(id: string, dto: UpdateColumnDto) {
    if (!(await this.exists(id))) throw new NotFoundError();
    return prisma.column.update({
      where: { id },
      data: {
        ...dto,
        lastUpdatedDtUtc: new Date(),
      },
    });
  }

  async move(id: string, dto: MoveColumnDto) {
    const column = await this.findById(id);

    const columns = await prisma.column.findMany({
      where: { boardId: column.boardId },
      orderBy: { sequence: 'asc' },
    });

    const reordered = columns.filter((item) => item.id !== id);
    const targetIndex = Math.max(0, Math.min(dto.sequence, reordered.length));
    reordered.splice(targetIndex, 0, column);

    const updates = reordered.map((item, index) => ({ id: item.id, sequence: index }));

    await prisma.$transaction(async (tx) => {
      await this.applyColumnResequencing(tx, updates);
    });

    return prisma.column.findUnique({ where: { id } });
  }

  async delete(id: string) {
    const column = await prisma.column.findUnique({ where: { id } });
    if (!column) throw new NotFoundError();

    const remainingColumns = await prisma.column.findMany({
      where: { boardId: column.boardId, NOT: { id } },
      orderBy: { sequence: 'asc' },
    });

    await prisma.$transaction(async (tx) => {
      await tx.column.delete({ where: { id } });

      if (remainingColumns.length > 0) {
        const updates = remainingColumns.map((item, index) => ({ id: item.id, sequence: index }));
        await this.applyColumnResequencing(tx, updates);
      }
    });
  }

  private async applyColumnResequencing(tx: Prisma.TransactionClient, updates: ColumnSequenceUpdate[]) {
    for (let index = 0; index < updates.length; index += 1) {
      const update = updates[index];
      await tx.column.update({
        where: { id: update.id },
        data: { sequence: ColumnService.TEMP_COLUMN_SEQUENCE_BASE - index },
      });
    }

    for (const update of updates) {
      await tx.column.update({
        where: { id: update.id },
        data: { sequence: update.sequence },
      });
    }
  }
}

export const columnService = new ColumnService();
