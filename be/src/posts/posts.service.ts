import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { Like } from '../entities/like.entity';
import { Comment } from '../entities/comment.entity';
import { CreatePostDto, LikePostDto, CreateCommentDto } from '../dto/post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postsRepository.create({
      wallet_address: createPostDto.wallet_address.toLowerCase(),
      content: createPostDto.content,
    });
    return this.postsRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postsRepository.find({
      relations: ['user', 'likes', 'comments', 'comments.user'],
      order: { timestamp: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user', 'likes', 'likes.user', 'comments', 'comments.user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async likePost(postId: number, likePostDto: LikePostDto): Promise<Like> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.likesRepository.findOne({
      where: {
        post_id: postId,
        wallet_address: likePostDto.wallet_address.toLowerCase(),
      },
    });

    if (existingLike) {
      throw new ConflictException('Post already liked');
    }

    const like = this.likesRepository.create({
      post_id: postId,
      wallet_address: likePostDto.wallet_address.toLowerCase(),
    });

    return this.likesRepository.save(like);
  }

  async unlikePost(postId: number, likePostDto: LikePostDto): Promise<void> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.likesRepository.findOne({
      where: {
        post_id: postId,
        wallet_address: likePostDto.wallet_address.toLowerCase(),
      },
    });

    if (!existingLike) {
      throw new NotFoundException('Like not found');
    }

    await this.likesRepository.remove(existingLike);
  }

  async commentOnPost(
    postId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = this.commentsRepository.create({
      post_id: postId,
      wallet_address: createCommentDto.wallet_address.toLowerCase(),
      content: createCommentDto.content,
    });

    return this.commentsRepository.save(comment);
  }
}
