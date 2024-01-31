// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserService } from './user.service';
import { User_prisma } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Post('create')
  create(@Body() createUserDto) {
    return this.UserService.createUser(createUserDto);
  }

  @Get('allList')
  findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
  ): Promise<User_prisma[]> {
    return this.UserService.users({
      skip,
      take,
    });
  }

  @Get('info')
  findOne(
    @Query('id') id: number,
    // @Query('name') name: string,
  ): Promise<User_prisma> {
    return this.UserService.user({ id: +id });
  }

  // @Post('del')
  // remove(@Body() req) {
  //   return this.UserService.deleteUser(req.id);
  // }
}
