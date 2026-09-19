// FR-36: Child & Parent Support, Dispute Mechanism & Transparent 72h SLA Tracking

export type SupportTicketType = 'false_block' | 'dispute_monitoring' | 'technical_issue';
export type SupportTicketStatus = 'open' | 'in_review' | 'resolved' | 'closed';

export interface SupportTicket {
  ticketId: string;
  creatorId: string;
  creatorRole: 'child' | 'guardian';
  childId: string;
  type: SupportTicketType;
  title: string;
  description: string;
  status: SupportTicketStatus;
  createdAt: string;
  slaDeadline: string; // 72 hours SLA (FR-36)
  resolution?: string;
  resolvedAt?: string;
  isVisibleToChild: boolean; // Child can always see their own tickets and general status
}

export class SupportService {
  private tickets: Map<string, SupportTicket> = new Map();

  public createTicket(params: {
    creatorId: string;
    creatorRole: 'child' | 'guardian';
    childId: string;
    type: SupportTicketType;
    title: string;
    description: string;
  }): SupportTicket {
    const now = new Date();
    const deadline = new Date(now.getTime() + 72 * 60 * 60 * 1000); // 72h SLA

    const ticket: SupportTicket = {
      ticketId: `tkt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      creatorId: params.creatorId,
      creatorRole: params.creatorRole,
      childId: params.childId,
      type: params.type,
      title: params.title,
      description: params.description,
      status: 'open',
      createdAt: now.toISOString(),
      slaDeadline: deadline.toISOString(),
      isVisibleToChild: true,
    };

    this.tickets.set(ticket.ticketId, ticket);
    return ticket;
  }

  public getTicket(ticketId: string): SupportTicket | null {
    return this.tickets.get(ticketId) || null;
  }

  public getTicketsForUser(userId: string): SupportTicket[] {
    return Array.from(this.tickets.values()).filter(
      (t) => t.creatorId === userId || t.childId === userId
    );
  }

  public resolveTicket(ticketId: string, resolution: string): SupportTicket {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) {
      throw new Error(`Chipta topilmadi: ${ticketId}`);
    }

    ticket.status = 'resolved';
    ticket.resolution = resolution;
    ticket.resolvedAt = new Date().toISOString();
    return ticket;
  }

  public checkSlaBreach(ticketId: string): boolean {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) return false;
    if (ticket.status === 'resolved' || ticket.status === 'closed') return false;
    return new Date().getTime() > new Date(ticket.slaDeadline).getTime();
  }
}
