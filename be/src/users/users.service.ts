import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { Like } from '../entities/like.entity';
import { CreateUserDto } from '../dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
  ) {}

  async findByWallet(wallet_address: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { wallet_address: wallet_address.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUserStats(wallet_address: string) {
    const normalizedAddress = wallet_address.toLowerCase();

    // Get posts count
    const postsCount = await this.postsRepository.count({
      where: { wallet_address: normalizedAddress },
    });

    // Get likes given count
    const likesGivenCount = await this.likesRepository.count({
      where: { wallet_address: normalizedAddress },
    });

    return {
      wallet_address: normalizedAddress,
      posts_count: postsCount,
      likes_given_count: likesGivenCount,
    };
  }

  async createOrUpdate(createUserDto: CreateUserDto): Promise<User> {
    const { wallet_address, ...userData } = createUserDto;
    const normalizedAddress = wallet_address.toLowerCase();

    const existingUser = await this.usersRepository.findOne({
      where: { wallet_address: normalizedAddress },
    });

    if (existingUser) {
      // Update existing user
      await this.usersRepository.update(normalizedAddress, userData);
      return this.findByWallet(normalizedAddress);
    } else {
      // Create new user
      const newUser = this.usersRepository.create({
        wallet_address: normalizedAddress,
        ...userData,
      });
      return this.usersRepository.save(newUser);
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
