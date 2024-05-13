import { Injectable } from '@nestjs/common';
import { CreatePublicPostDto } from './dto/create-public.post.dto';
import { UpdatePublicPostDto } from './dto/update-public.post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/public.post.entity';
import { Repository } from 'typeorm';
import { format } from 'date-fns-tz';
import { HttpException, HttpStatus } from '@nestjs/common';


@Injectable()
export class PublicPostsService {
  
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ){}

  async create(createPublicPostDto: CreatePublicPostDto) {
    // try {
      // Check if title is provided
      if (!createPublicPostDto.title) {
        throw new HttpException({ error: 'Title is required' }, HttpStatus.BAD_REQUEST);
      } else if (!createPublicPostDto.content) {
        throw new HttpException({ error: 'Content is required' }, HttpStatus.BAD_REQUEST);
      }
  
      const post = await this.postRepository.create(createPublicPostDto);
      // Save the post to the database
      await this.postRepository.save(post);
  
      // Extract the desired properties from the created post object
      const { id, title, content, published, created_at } = post;
      const formattedCreatedAt = format(created_at, 'yyyy-MM-dd\' T \'HH:mm:ss', { timeZone: 'Asia/Bangkok' });
      // Format the response object
      const response = {
        id,
        title,
        content,
        published,
        created_at: formattedCreatedAt,
      };
  
      return response;
   
  }
  
  findAll() {
    return this.postRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} publicPost`;
  }

  async update(id: string, updatePublicPostDto: UpdatePublicPostDto) {
    let post = await this.postRepository.findOneBy({id:id})
    // console.log(attraction.id)
    if (updatePublicPostDto.hasOwnProperty('published')) {
      post.published = updatePublicPostDto.published; // ตั้งค่า published ใหม่
  }
    post = {
      ... post,
      ... UpdatePublicPostDto
    }
    const toUpDate = await this.postRepository.save(post)
    return toUpDate;
  }

  async remove(id: string) {
    const toDelete = await this.postRepository.delete(id);
    return toDelete;
  }
}
