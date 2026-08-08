import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums/user-role.enum';

import { TicketsService } from '../tickets/tickets.service';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { BookingStatus } from '../bookings/enums/booking-status.enum';

import { Payment } from '../payments/entities/payment.entity';
import { PaymentStatus } from '../payments/enums/payment-status.enum';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly ticketsService: TicketsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,

    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async getAllUsers() {
    return this.usersService.findAll();
  }

  async makeVendor(id: number) {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = UserRole.VENDOR;

    return this.usersService.save(user);
  }

  async makeAdmin(id: number) {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = UserRole.ADMIN;

    return this.usersService.save(user);
  }

  // Pending tickets
  async getPendingTickets() {
    return this.ticketsService.findPendingTickets();
  }

  async approveTicket(id: number) {
    return this.ticketsService.approveTicket(id);
  }

  async rejectTicket(id: number) {
    return this.ticketsService.rejectTicket(id);
  }

  // Find all bookings
  async findAllBookings() {
    return this.bookingRepository.find({
      relations: {
        user: true,
        ticket: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // Confirm booking
  async confirmBooking(id: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (
      booking.bookingStatus === BookingStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Cancelled booking cannot be confirmed',
      );
    }

    booking.bookingStatus =
      BookingStatus.CONFIRMED;

    return this.bookingRepository.save(booking);
  }

  // Admin Dashboard
  async getDashboard() {
    const users =
      await this.userRepository.find();

    const tickets =
      await this.ticketRepository.find();

    const bookings =
      await this.bookingRepository.find();

    const payments =
      await this.paymentRepository.find({
        where: {
          paymentStatus: PaymentStatus.SUCCESS,
        },
      });

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

    const totalRevenue = payments.reduce(
      (total, payment) =>
        total + Number(payment.amount),
      0,
    );

    return {
      statistics: {
        totalUsers: users.length,
        totalTickets: tickets.length,
        pendingTickets: pendingTickets.length,
        approvedTickets: approvedTickets.length,
        rejectedTickets: rejectedTickets.length,
        totalBookings: bookings.length,
        totalPayments: payments.length,
        totalRevenue,
      },
    };
  }
}