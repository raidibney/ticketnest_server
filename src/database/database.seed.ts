import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseSeed implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    await this.createUser(
      'Admin',
      'admin@gmail.com',
      UserRole.ADMIN,
    );

    await this.createUser(
      'Vendor',
      'vendor@gmail.com',
      UserRole.VENDOR,
    );

    await this.createUser(
      'User',
      'user@gmail.com',
      UserRole.USER,
    );
  }

  private async createUser(
    name: string,
    email: string,
    role: UserRole,
  ) {
    const existing = await this.usersService.findByEmail(email);

    if (existing) {
      return;
    }

    const password = await bcrypt.hash('123456', 10);

    await this.usersService.create({
      name,
      email,
      password,
      role,
    });
  }
}