import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UsersService } from '../users/users.service';
import { VerificationStatus } from './enums/verification-status.enum';
import { FilterTicketDto } from './dto/filter-ticket.dto';


@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: number, dto: CreateTicketDto) {
    const vendor = await this.usersService.findById(userId);

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const ticket = this.ticketRepository.create({
      ...dto,
      vendor,
    });

    return this.ticketRepository.save(ticket);
  }

  async findMyTickets(userId: number) {
    return this.ticketRepository.find({
      where: {
        vendor: {
          id: userId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
//update the ticket 
 async update(
  ticketId: number,
  vendorId: number,
  dto: UpdateTicketDto,
) {
  const ticket = await this.ticketRepository.findOne({
    where: {
      id: ticketId,
      vendor: {
        id: vendorId,
      },
    },
  });

  if (!ticket) {
    throw new NotFoundException(
      'Ticket not found or you do not own this ticket',
    );
  }

  Object.assign(ticket, dto);

  return this.ticketRepository.save(ticket);
}

//remove

  async remove(
  ticketId: number,
  vendorId: number,
) {
  const ticket = await this.ticketRepository.findOne({
    where: {
      id: ticketId,
      vendor: {
        id: vendorId,
      },
    },
  });

  if (!ticket) {
    throw new NotFoundException(
      'Ticket not found or you do not own this ticket',
    );
  }

  await this.ticketRepository.remove(ticket);

  return {
    message: 'Ticket deleted successfully',
  };
}
//pending tickets 
async findPendingTickets() {
  return this.ticketRepository.find({
    where: {
      verificationStatus: VerificationStatus.PENDING,
    },
    order: {
      createdAt: 'DESC',
    },
  });
}

async approveTicket(id: number) {
  const ticket = await this.ticketRepository.findOne({
    where: { id },
  });

  if (!ticket) {
    throw new NotFoundException('Ticket not found');
  }

  ticket.verificationStatus = VerificationStatus.APPROVED;

  return this.ticketRepository.save(ticket);
}

async rejectTicket(id: number) {
  const ticket = await this.ticketRepository.findOne({
    where: { id },
  });

  if (!ticket) {
    throw new NotFoundException('Ticket not found');
  }

  ticket.verificationStatus = VerificationStatus.REJECTED;

  return this.ticketRepository.save(ticket);
}
//find all 
async findAll(filter: FilterTicketDto) {
  const page = Number(filter.page) || 1;
  const limit = 10;

  const query = this.ticketRepository
    .createQueryBuilder('ticket')
    .leftJoinAndSelect('ticket.vendor', 'vendor')
    .where('ticket.verificationStatus = :status', {
      status: VerificationStatus.APPROVED,
    });

  if (filter.from) {
    query.andWhere('LOWER(ticket.from) LIKE LOWER(:from)', {
      from: `%${filter.from}%`,
    });
  }

  if (filter.to) {
    query.andWhere('LOWER(ticket.to) LIKE LOWER(:to)', {
      to: `%${filter.to}%`,
    });
  }

  if (filter.transportType) {
    query.andWhere(
      'ticket.transportType = :transportType',
      {
        transportType: filter.transportType,
      },
    );
  }

  if (filter.sort === 'price_asc') {
    query.orderBy('ticket.price', 'ASC');
  } else if (filter.sort === 'price_desc') {
    query.orderBy('ticket.price', 'DESC');
  } else {
    query.orderBy('ticket.createdAt', 'DESC');
  }

  query.skip((page - 1) * limit);
  query.take(limit);

  const [tickets, total] = await query.getManyAndCount();

  return {
    data: tickets,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

async findOne(id: number) {
  const ticket = await this.ticketRepository.findOne({
    where: {
      id,
      verificationStatus: VerificationStatus.APPROVED,
    },
    relations: {
      vendor: true,
    },
  });

  if (!ticket) {
    throw new NotFoundException('Ticket not found');
  }

  return ticket;
}
async findById(id: number) {
  const ticket = await this.ticketRepository.findOne({
    where: { id },
    relations: {
      vendor: true,
    },
  });

  if (!ticket) {
    throw new NotFoundException('Ticket not found');
  }

  return ticket;
}
//update ticket 
async updateTicket(ticket: Ticket) {
  return this.ticketRepository.save(ticket);
}
}