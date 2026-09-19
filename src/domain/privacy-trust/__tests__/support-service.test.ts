import { describe, it, expect } from 'vitest';
import { SupportService } from '../support-service';

describe('SupportService (FR-36)', () => {
  it('creates tickets with transparent 72-hour SLA deadline', () => {
    const service = new SupportService();
    const ticket = service.createTicket({
      creatorId: 'child-1',
      creatorRole: 'child',
      childId: 'child-1',
      type: 'false_block',
      title: 'Ta’lim sayti xato bloklandi',
      description: 'khanacademy.org dars qilishim uchun kerak',
    });

    expect(ticket.ticketId).toMatch(/^tkt-/);
    expect(ticket.status).toBe('open');
    expect(ticket.isVisibleToChild).toBe(true);

    const createdTime = new Date(ticket.createdAt).getTime();
    const slaTime = new Date(ticket.slaDeadline).getTime();
    const diffHours = (slaTime - createdTime) / (1000 * 60 * 60);
    expect(Math.round(diffHours)).toBe(72);
  });

  it('allows resolution of tickets and marks resolved timestamp', () => {
    const service = new SupportService();
    const ticket = service.createTicket({
      creatorId: 'child-1',
      creatorRole: 'child',
      childId: 'child-1',
      type: 'dispute_monitoring',
      title: 'Kechki rejim bo‘yicha e’tiroz',
      description: 'Darslar kechroq tugaganligi sababli 1 soat qo‘shimcha kerak',
    });

    const resolved = service.resolveTicket(ticket.ticketId, 'Vasiy bilan kelishildi: 30 daqiqa uzaytirildi.');
    expect(resolved.status).toBe('resolved');
    expect(resolved.resolution).toContain('30 daqiqa');
    expect(resolved.resolvedAt).toBeDefined();

    const isBreached = service.checkSlaBreach(ticket.ticketId);
    expect(isBreached).toBe(false);
  });
});
