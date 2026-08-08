import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { TicketsService } from '../tickets/tickets.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
 constructor(
  private readonly adminService: AdminService,
  private readonly ticketsService: TicketsService,
) {}

  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/make-vendor')
  makeVendor(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.adminService.makeVendor(id);
  }

  @Patch('users/:id/make-admin')
  makeAdmin(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.adminService.makeAdmin(id);
  }

@Get('tickets/pending')
getPendingTickets() {
  return this.adminService.getPendingTickets();
}

@Patch('tickets/:id/approve')
approveTicket(@Param('id', ParseIntPipe) id: number) {
  return this.adminService.approveTicket(id);
}

@Patch('tickets/:id/reject')
rejectTicket(@Param('id', ParseIntPipe) id: number) {
  return this.adminService.rejectTicket(id);
}

@Get('bookings')
findAllBookings() {
  return this.adminService.findAllBookings();
}

@Patch('bookings/:id/confirm')
confirmBooking(
  @Param('id', ParseIntPipe) id: number,
) {
  return this.adminService.confirmBooking(id);
}

@Get('dashboard')
getDashboard() {
  return this.adminService.getDashboard();
}
}