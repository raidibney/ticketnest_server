import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
  ) {}

  @Post()
  create(
    @CurrentUser() user: any,
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingsService.create(
      user.id,
      dto,
    );
  }
@Get('my')
findMyBookings(@CurrentUser() user: any) {
  return this.bookingsService.findMyBookings(user.id);
}

@Get(':id')
findOne(
  @Param('id', ParseIntPipe) id: number,
  @CurrentUser() user: any,
) {
  return this.bookingsService.findOne(
    id,
    user.id,
  );
}
  @Patch(':id/cancel')
cancel(
  @Param('id', ParseIntPipe) id: number,
  @CurrentUser() user: any,
) {
  return this.bookingsService.cancel(
    id,
    user.id,
  );
}
}