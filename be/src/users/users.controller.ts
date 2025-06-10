import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from '../dto/auth.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':wallet')
  async getUserProfile(@Param('wallet') wallet: string) {
    return this.usersService.findByWallet(wallet);
  }

  @Get(':wallet/stats')
  async getUserStats(@Param('wallet') wallet: string) {
    return this.usersService.getUserStats(wallet);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrUpdateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    // Create the full DTO with wallet_address from JWT token
    const createUserDto: CreateUserDto = {
      wallet_address: req.user.wallet_address,
      ...updateUserDto,
    };
    return this.usersService.createOrUpdate(createUserDto);
  }
}
