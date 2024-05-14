
import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { PublicPostsService } from './public.posts.service';
import { CreatePublicPostDto } from './dto/create-public.post.dto';
import { UpdatePublicPostDto } from './dto/update-public.post.dto';
import { Post as PostEntity } from './entities/public.post.entity';


@Controller('public.posts')
export class PublicPostsController {
  constructor(private readonly publicPostsService: PublicPostsService) {}

  @Post('/createPost')
  create(@Body() createPublicPostDto: CreatePublicPostDto) {
    return this.publicPostsService.create(createPublicPostDto);
  }

  @Get()
  findAll(){
    return this.publicPostsService.findAll();
  }

  @Get(':published')
  async findPublished(@Param('published') published: boolean) {
    return this.publicPostsService.findpublished(published);
  }

  @Get(':title')
  async findtitle(@Param('title') title: string) {
    return this.publicPostsService.findtitle(title);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicPostsService.findOne(id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePublicPostDto: UpdatePublicPostDto) {
    return this.publicPostsService.update(id, updatePublicPostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicPostsService.remove(id);
  }
}
