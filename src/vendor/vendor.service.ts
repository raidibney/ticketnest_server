import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,

    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async getDashboard(vendorId: number) {
    // Find vendor
    const vendor = await this.userRepository.findOne({
      where: {
        id: vendorId,
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    // Find vendor's tickets
    const tickets = await this.ticketRepository.find({
      where: {
        vendor: {
          id: vendorId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    // Find bookings for vendor's tickets
    const bookings = await this.bookingRepository.find({
      relations: {
        ticket: true,
        user: true,
      },
    });

    const vendorBookings = bookings.filter(
      (booking) =>
        booking.ticket &&
        booking.ticket.vendor &&
        booking.ticket.vendor.id === vendorId,
    );

    const pendingTickets = tickets.filter(
      (ticket) =>
        ticket.verificationStatus === 'PENDING',
    );

    const approvedTickets = tickets.filter(
      (ticket) =>
        ticket.verificationStatus === 'APPROVED',
    );

    const rejectedTickets = tickets.filter(
      (ticket) =>
        ticket.verificationStatus === 'REJECTED',
    );

    return {
      vendor: {
        id: vendor.id,
        email: vendor.email,
        role: vendor.role,
      },

      statistics: {
        totalTickets: tickets.length,
        pendingTickets: pendingTickets.length,
        approvedTickets: approvedTickets.length,
        rejectedTickets: rejectedTickets.length,
        totalBookings: vendorBookings.length,
      },

      recentTickets: tickets.slice(0, 5),

      recentBookings: vendorBookings.slice(0, 5),
    };
  }
}