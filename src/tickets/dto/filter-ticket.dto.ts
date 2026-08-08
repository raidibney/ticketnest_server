import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { TransportType } from '../enums/transport-type.enum';

export class FilterTicketDto {
  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @IsEnum(TransportType)
  transportType?: TransportType;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsString()
  sort?: string;
}