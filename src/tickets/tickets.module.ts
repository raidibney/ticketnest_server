import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ticket } from './entities/ticket.entity';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { UsersModule } from '../users/users.module';
import { PublicTicketsController } from './public-tickets.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    UsersModule,
  ],
  controllers: [
  TicketsController,
  PublicTicketsController,
],
  providers: [TicketsService],
  exports: [TicketsService], 
})
export class TicketsModule {}