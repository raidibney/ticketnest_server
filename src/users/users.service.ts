import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Booking } from 'src/bookings/entities/booking.entity';


@Injectable()
export class UsersService {
  constructor(
  @InjectRepository(User)
  private readonly userRepository: Repository<User>,

  @InjectRepository(Booking)
  private readonly bookingRepository: Repository<Booking>,
) {}

  async create(userData: Partial<User>) {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findById(id: number) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async getProfile(id: number) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }

  async updateProfile(id: number, dto: UpdateProfileDto) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, dto);

    const updated = await this.userRepository.save(user);

    const { password, ...result } = updated;
    return result;
  }

  async changePassword(id: number, dto: ChangePasswordDto) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );

    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);

    await this.userRepository.save(user);

    return {
      message: 'Password updated successfully',
    };
  }
  async findAll() {
  return this.userRepository.find();
}

async save(user: User) {
  return this.userRepository.save(user);
}

//user dashboard 
async getDashboard(userId: number) {
  const user = await this.userRepository.findOne({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const bookings = await this.bookingRepository.find({
    where: {
      user: {
        id: userId,
      },
    },
    relations: {
      ticket: true,
    },
    order: {
      createdAt: 'DESC',
    },
  });

  const { password, ...profile } = user;

  return {
    profile,
    totalBookings: bookings.length,
    recentBookings: bookings.slice(0, 5),
  };
}


}