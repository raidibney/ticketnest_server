import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';

import { User } from '../users/entities/user.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Ticket,
      Booking,
    ]),
  ],
  controllers: [VendorController],
  providers: [VendorService],
})
export class VendorModule {}