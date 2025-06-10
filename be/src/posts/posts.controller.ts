import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {
  CreatePostDto,
  LikePostDto,
  CreateCommentDto,
  NewPostDto,
  NewCommentDto,
} from '../dto/post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async getAllPosts() {
    return this.postsService.findAll();
  }

  @Get(':id')
  async getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Body() newPostDto: NewPostDto, @Request() req) {
    const createPostDto: CreatePostDto = {
      wallet_address: req.user.wallet_address,
      content: newPostDto.content,
    };
    return this.postsService.createPost(createPostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async likePost(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const likePostDto: LikePostDto = {
      wallet_address: req.user.wallet_address,
    };
    return this.postsService.likePost(id, likePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  async unlikePost(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const likePostDto: LikePostDto = {
      wallet_address: req.user.wallet_address,
    };
    await this.postsService.unlikePost(id, likePostDto);
    return { message: 'Post unliked successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comment')
  async commentOnPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() newCommentDto: NewCommentDto,
    @Request() req,
  ) {
    const createCommentDto: CreateCommentDto = {
      wallet_address: req.user.wallet_address,
      content: newCommentDto.content,
    };
    return this.postsService.commentOnPost(id, createCommentDto);
  }
}
