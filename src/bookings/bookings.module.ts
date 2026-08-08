import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

import { Booking } from './entities/booking.entity';

import { UsersModule } from '../users/users.module';
import { TicketsModule } from '../tickets/tickets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    UsersModule,
    TicketsModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
   exports: [BookingsService],
})
export class BookingsModule {}