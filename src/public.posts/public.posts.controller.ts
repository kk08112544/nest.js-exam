import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { PublicPostsService } from './public.posts.service';
import { CreatePublicPostDto } from './dto/create-public.post.dto';
import { UpdatePublicPostDto } from './dto/update-public.post.dto';


@Controller('public.posts')
export class PublicPostsController {
  constructor(private readonly publicPostsService: PublicPostsService) {}

  @Post('/createPost')
  create(@Body() createPublicPostDto: CreatePublicPostDto) {
    return this.publicPostsService.create(createPublicPostDto);
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
