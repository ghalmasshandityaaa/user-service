import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { UserDto } from '../dto/user.dto';
import { PaginationOptions } from '../helpers/pagination.helper';
import { PrismaService } from './prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly db: PrismaService) { }

  async users(pagination: PaginationOptions, keyword: string) {
    try {
      const users = await this.db.$transaction([
        this.db.users.count({
          where: {
            OR: [
              { fullname: { contains: keyword } },
              { email: { contains: keyword } },
            ]
          },
        }),
        this.db.users.findMany({
          where: {
            OR: [
              { fullname: { contains: keyword } },
              { email: { contains: keyword } },
            ]
          },
          orderBy: { fullname: 'asc' },
          skip: pagination.queryPage,
          take: pagination.limit,
        }),
      ]);

      return { result: users[1], total: users[0] };
    } catch (e) {
      Logger.error(e.message, 'UserService.users');
      throw e;
    }
  }

  async getUser(id: number) {
    try {
      const user = await this.db.users.findFirst({ where: { id } });
      if (!user) throw Error('user not found');

      user.createdAt = moment.utc(user.createdAt).add(7, 'h').toDate();
      user.updatedAt = moment.utc(user.updatedAt).add(7, 'h').toDate();

      return user;
    } catch (e) {
      Logger.error(e.message, 'UserService.getUser');
      throw e;
    }
  }

  async createUser(user: UserDto) {
    try {
      const checkUser = await this.db.users.findFirst({
        where: {
          OR: [
            { email: user.email },
            { username: user.username },
          ],
        },
      });

      if (checkUser) throw Error('email or username is already registered');

      await this.db.users.create({
        data: {
          ...user,
          isActive: true,
        },
      });

      return 'Successfully create user';
    } catch (e) {
      Logger.error(e.message, 'UserService.createUser');
      throw e;
    }
  }

  async updateUser(id: number, params: UserDto) {
    try {
      const user = await this.db.users.findFirst({ where: { id } });
      if (!user) throw Error('user not found');

      const checkUser = await this.db.users.findFirst({
        where: {
          AND: [
            {
              NOT: { id: id },
            },
            {
              OR: [
                { email: params.email },
                { username: params.username },
              ],
            },
          ],
        },
      });

      if (checkUser) throw Error('email or username is already registered');

      await this.db.users.update({
        where: { id },
        data: { ...params },
      });

      return 'Successfully updated user';
    } catch (e) {
      Logger.error(e.message, 'UserService.updateUser');
      throw e;
    }
  }

  async deleteUser(id: number) {
    try {
      const user = await this.db.users.findFirst({ where: { id } });
      if (!user) throw Error('user not found');

      await this.db.users.delete({ where: { id } });

      return 'Successfully deleted user';
    } catch (e) {
      Logger.error(e.message, 'UserService.deleteUser');
      throw e;
    }
  }
}
