import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';

import { TicketsModule } from '../tickets/tickets.module';
import { Ticket } from '../tickets/entities/ticket.entity';

import { Booking } from '../bookings/entities/booking.entity';
import { Payment } from '../payments/entities/payment.entity';

@Module({
  imports: [
    UsersModule,
    TicketsModule,

    TypeOrmModule.forFeature([
      User,
      Ticket,
      Booking,
      Payment,
    ]),
  ],

  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}