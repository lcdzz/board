import prisma from '@plugins/db';
import { NotFoundError, ValidationError } from '@shared/errors';
import { CreateCardDto, MoveCardDto, UpdateCardDto } from './card.types';
import { columnService } from '@modules/columns';
import type { Prisma } from '@prisma/client';

type CardSequenceUpdate = {
  id: string;
  sequence: number;
  columnId?: string;
};

class CardService {
  private static readonly TEMP_CARD_SEQUENCE_BASE = -1000000;

  async findAll() {
    return prisma.card.findMany({ orderBy: { sequence: 'asc' } });
  }

  async findById(id: string) {
    const card = await prisma.card.findUnique({ where: { id } });
    if (!card) throw new NotFoundError();
    return card;
  }

  async exists(id: string): Promise<boolean> {
    const count = await prisma.card.count({ where: { id } });
    return count > 0;
  }

  async create(dto: CreateCardDto) {
    if (!(await columnService.exists(dto.columnId))) throw new ValidationError("Column doesn't exist.");

    const count = await prisma.card.count({ where: { columnId: dto.columnId } });
    return prisma.card.create({
      data: {
        ...dto,
        sequence: count,
        createdDtUtc: new Date(),
      },
    });
  }

  async update(id: string, dto: UpdateCardDto) {
    if (!(await this.exists(id))) throw new NotFoundError();
    return prisma.card.update({
      where: { id },
      data: {
        ...dto,
        lastUpdatedDtUtc: new Date(),
      },
    });
  }

  async move(id: string, dto: MoveCardDto) {
    const card = await this.findById(id);
    if (!(await columnService.exists(dto.columnId))) throw new ValidationError("Column doesn't exist.");

    const sourceColumnId = card.columnId;
    const targetColumnId = dto.columnId;

    if (sourceColumnId === targetColumnId) {
      const cards = await prisma.card.findMany({
        where: { columnId: sourceColumnId },
        orderBy: { sequence: 'asc' },
      });

      const reordered = cards.filter((item) => item.id !== id);
      const targetIndex = Math.max(0, Math.min(dto.sequence, reordered.length));
      reordered.splice(targetIndex, 0, card);

      const updates = reordered.map((item, index) => ({ id: item.id, sequence: index }));

      await prisma.$transaction(async (tx) => {
        await this.applyCardResequencing(tx, updates);
      });

      return prisma.card.findUnique({ where: { id } });
    }

    const sourceCards = await prisma.card.findMany({
      where: { columnId: sourceColumnId, NOT: { id } },
      orderBy: { sequence: 'asc' },
    });

    const targetCards = await prisma.card.findMany({
      where: { columnId: targetColumnId },
      orderBy: { sequence: 'asc' },
    });

    const clampedIndex = Math.max(0, Math.min(dto.sequence, targetCards.length));
    const reorderedTarget = [...targetCards.slice(0, clampedIndex), card, ...targetCards.slice(clampedIndex)];

    const sourceUpdates = sourceCards.map((item, index) => ({ id: item.id, sequence: index }));
    const targetUpdates = reorderedTarget.map((item, index) => ({
      id: item.id,
      sequence: index,
      columnId: item.id === id ? targetColumnId : item.columnId,
    }));

    await prisma.$transaction(async (tx) => {
      await this.applyCardResequencing(tx, [...sourceUpdates, ...targetUpdates]);
    });

    return prisma.card.findUnique({ where: { id } });
  }

  async delete(id: string) {
    const card = await prisma.card.findUnique({ where: { id } });
    if (!card) throw new NotFoundError();

    const remainingCards = await prisma.card.findMany({
      where: { columnId: card.columnId, NOT: { id } },
      orderBy: { sequence: 'asc' },
    });

    await prisma.$transaction(async (tx) => {
      await tx.card.delete({ where: { id } });

      if (remainingCards.length > 0) {
        const updates = remainingCards.map((item, index) => ({ id: item.id, sequence: index }));
        await this.applyCardResequencing(tx, updates);
      }
    });
  }

  private async applyCardResequencing(tx: Prisma.TransactionClient, updates: CardSequenceUpdate[]) {
    for (let index = 0; index < updates.length; index += 1) {
      const update = updates[index];
      await tx.card.update({
        where: { id: update.id },
        data: {
          sequence: CardService.TEMP_CARD_SEQUENCE_BASE - index,
          ...(update.columnId ? { columnId: update.columnId } : {}),
        },
      });
    }

    for (const update of updates) {
      await tx.card.update({
        where: { id: update.id },
        data: {
          sequence: update.sequence,
          ...(update.columnId ? { columnId: update.columnId } : {}),
        },
      });
    }
  }
}

export const cardService = new CardService();
