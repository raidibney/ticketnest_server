import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { TicketsService } from './tickets.service';
import { FilterTicketDto } from './dto/filter-ticket.dto';

@Controller('tickets')
export class PublicTicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
  ) {}

  @Get()
  findAll(
    @Query() filter: FilterTicketDto,
  ) {
    return this.ticketsService.findAll(filter);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ticketsService.findOne(id);
  }
}