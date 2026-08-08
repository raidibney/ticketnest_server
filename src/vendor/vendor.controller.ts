import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { VendorService } from './vendor.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@Controller('vendor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.VENDOR)
export class VendorController {
  constructor(
    private readonly vendorService: VendorService,
  ) {}

  @Get('dashboard')
  getDashboard(@CurrentUser() user: any) {
    return this.vendorService.getDashboard(user.id);
  }
}