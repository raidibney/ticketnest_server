import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

import { TransportType } from '../enums/transport-type.enum';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  from: string;

  @IsNotEmpty()
  @IsString()
  to: string;

  @IsEnum(TransportType)
  transportType: TransportType;

  @IsNumber()
  @Min(1)
  price: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsDateString()
  departureDateTime: Date;

  @IsArray()
  perks: string[];

  @IsString()
  image: string;
}