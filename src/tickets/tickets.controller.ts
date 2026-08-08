import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/enums/user-role.enum';

import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.VENDOR)
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
  ) {}

  @Post()
  create(
    @CurrentUser() user: any,
    @Body() dto: CreateTicketDto,
  ) {
    return this.ticketsService.create(user.id, dto);
  }

  @Get('my')
  myTickets(@CurrentUser() user: any) {
    return this.ticketsService.findMyTickets(user.id);
  }
@Patch(':id')
update(
  @Param('id', ParseIntPipe) id: number,
  @CurrentUser() user: any,
  @Body() dto: UpdateTicketDto,
) {
  return this.ticketsService.update(
    id,
    user.id,
    dto,
  );
}
@Delete(':id')
remove(
  @Param('id', ParseIntPipe) id: number,
  @CurrentUser() user: any,
) {
  return this.ticketsService.remove(
    id,
    user.id,
  );
}
}