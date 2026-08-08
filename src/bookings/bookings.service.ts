import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

import { UsersService } from '../users/users.service';
import { TicketsService } from '../tickets/tickets.service';
import { BookingStatus } from './enums/booking-status.enum';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    private readonly usersService: UsersService,

    private readonly ticketsService: TicketsService,
  ) {}

//creating a ticket booking.................................
 async create(
  userId: number,
  dto: CreateBookingDto,
) {
  // 1. Find user
  const user = await this.usersService.findById(userId);

  if (!user) {
    throw new NotFoundException('User not found');
  }

  // 2. Find ticket
  const ticket = await this.ticketsService.findById(dto.ticketId);

  if (!ticket) {
    throw new NotFoundException('Ticket not found');
  }

  // 3. Check if ticket is approved
  if (ticket.verificationStatus !== 'APPROVED') {
    throw new BadRequestException(
      'Ticket is not approved',
    );
  }

  // 4. Check available seats
  if (ticket.quantity < dto.seatCount) {
    throw new BadRequestException(
      'Not enough seats available',
    );
  }

  // 5. Calculate total price
  const totalPrice =
    Number(ticket.price) * dto.seatCount;

  // 6. Reduce available seats
  ticket.quantity -= dto.seatCount;

  // 7. Save updated ticket
  await this.ticketsService.updateTicket(ticket);

  // 8. Create booking
  const booking = this.bookingRepository.create({
    seatCount: dto.seatCount,
    totalPrice,
    user,
    ticket,
  });

  // 9. Save booking
  return this.bookingRepository.save(booking);
}
//find bookings for a specific user
async findMyBookings(userId: number) {
  return this.bookingRepository.find({
    where: {
      user: {
        id: userId,
      },
    },
    relations: {
      ticket: true,
    },
    order: {
      createdAt: 'DESC',
    },
  });
}

//find a specific booking for a specific user
async findOne(
  bookingId: number,
  userId: number,
) {
  const booking = await this.bookingRepository.findOne({
    where: {
      id: bookingId,
      user: {
        id: userId,
      },
    },
    relations: {
      ticket: true,
      user: true,
    },
  });

  if (!booking) {
    throw new NotFoundException(
      'Booking not found or you do not own this booking',
    );
  }

  return booking;
}

//cancel a booking
async cancel(
  bookingId: number,
  userId: number,
) {
  const booking = await this.bookingRepository.findOne({
    where: {
      id: bookingId,
      user: {
        id: userId,
      },
    },
    relations: {
      ticket: true,
    },
  });

  if (!booking) {
    throw new NotFoundException(
      'Booking not found or you do not own this booking',
    );
  }

  if (booking.bookingStatus === BookingStatus.CANCELLED) {
    throw new BadRequestException(
      'Booking is already cancelled',
    );
  }

  booking.bookingStatus = BookingStatus.CANCELLED;

  booking.ticket.quantity += booking.seatCount;

  await this.ticketsService.updateTicket(
    booking.ticket,
  );

  return this.bookingRepository.save(booking);
}

async updateBooking(booking: Booking) {
  return this.bookingRepository.save(booking);
}
}