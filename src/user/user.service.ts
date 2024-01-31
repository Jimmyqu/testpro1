import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User_prisma, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.User_prismaWhereUniqueInput,
  ): Promise<User_prisma | null> {
    return this.prisma.user_prisma.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.User_prismaWhereUniqueInput;
    where?: Prisma.User_prismaWhereInput;
    orderBy?: Prisma.User_prismaOrderByWithRelationInput;
  }): Promise<User_prisma[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user_prisma.findMany({
      skip: +skip,
      take: +take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(
    data: Prisma.User_prismaCreateInput,
  ): Promise<User_prisma | any> {
    const firstNameRow = await this.prisma.user_prisma.findFirst({
      where: { name: data.name },
    });
    const firstRow = await this.prisma.user_prisma.findFirst({
      where: { email: data.email },
    });
    if (firstNameRow || firstRow) {
      return { msg: '邮箱或者名字已经被注册' };
    }
    return this.prisma.user_prisma.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async queryByUserEmail(email: string): Promise<User_prisma | any> {
    const firstRow = await this.prisma.user_prisma.findUnique({
      where: { email: email },
    });
    return firstRow;
  }

  async updateUser(params: {
    where: Prisma.User_prismaWhereUniqueInput;
    data: Prisma.User_prismaUpdateInput;
  }): Promise<User_prisma> {
    const { where, data } = params;
    return this.prisma.user_prisma.update({
      data,
      where,
    });
  }

  async deleteUser(
    where: Prisma.User_prismaWhereUniqueInput,
  ): Promise<User_prisma> {
    return this.prisma.user_prisma.delete({
      where,
    });
  }
}
