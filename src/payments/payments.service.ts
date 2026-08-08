import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus } from './enums/payment-status.enum';

import { BookingsService } from '../bookings/bookings.service';
import { BookingStatus } from '../bookings/enums/booking-status.enum';


@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    private readonly bookingsService: BookingsService,
  ) {}

  async create(
    userId: number,
    dto: CreatePaymentDto,
  ) {
    // 1. Find the booking
    const booking = await this.bookingsService.findOne(
      dto.bookingId,
      userId,
    );

    // 2. Make sure booking isn't cancelled
    if (
      booking.bookingStatus === BookingStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Cancelled booking cannot be paid',
      );
    }

    // 3. Check if payment already exists
    const existingPayment =
      await this.paymentRepository.findOne({
        where: {
          booking: {
            id: booking.id,
          },
        },
      });

    if (existingPayment) {
      throw new BadRequestException(
        'Payment already exists for this booking',
      );
    }

    // 4. Get amount directly from booking
    const amount = Number(booking.totalPrice);

    // 5. Create payment
    const payment = this.paymentRepository.create({
      amount,
      paymentStatus: PaymentStatus.SUCCESS,
      transactionId: `TXN-${Date.now()}`,
      booking,
    });

    // 6. Save payment
    const savedPayment =
      await this.paymentRepository.save(payment);

    // 7. Payment successful → confirm booking
    booking.bookingStatus =
      BookingStatus.CONFIRMED;

    await this.bookingsService.updateBooking(
      booking,
    );

    return savedPayment;
  }
  
}