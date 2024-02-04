import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  // UseGuards,
  Request,
} from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserService } from './user.service';
// import { AuthGuard } from '../auth/auth.guard';
import { user } from '@prisma/client';
import { Roles } from '../role/roles.decorator';
import { Role } from '../role/role.enum';

@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Post('create')
  create(@Body() createUserDto) {
    return this.UserService.createUser(createUserDto);
  }

  @Get('allList')
  // @UseGuards(AuthGuard)
  @Roles(Role.Two)
  findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
  ): Promise<user[]> {
    return this.UserService.users({
      skip,
      take,
    });
  }

  // @UseGuards(AuthGuard)
  @Get('info')
  @Roles(Role.One)
  findOne(@Request() req, @Query('id') id: number): Promise<user> {
    return this.UserService.user({ id: +id });
  }

  // @Post('del')
  // remove(@Body() req) {
  //   return this.UserService.deleteUser(req.id);
  // }
}
