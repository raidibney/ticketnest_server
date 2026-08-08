import {
  IsInt,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  ticketId: number;

  @IsInt()
  @Min(1)
  seatCount: number;
}