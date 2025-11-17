import { BackendMethod, remult } from 'remult'
import { User } from '../../app/users/user'
import { Roles } from '../../app/users/roles'

export interface GetUsersRequest {
  filter?: string
  sortField?: string
  sortDirection?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface GetUsersResponse {
  users: User[]
  totalRecords: number
}

export class UsersController {
  @BackendMethod({ allowed: true })
  static async getUsers(request: GetUsersRequest): Promise<GetUsersResponse> {
    const {
      filter = '',
      sortField = 'name',
      sortDirection = 'asc',
      page = 1,
      pageSize = 30
    } = request

    // Build where clause for filter
    const where = filter
      ? { name: { $contains: filter } }
      : {}

    // Query users with filters and sorting
    const users = await remult.repo(User).find({
      where,
      orderBy: { [sortField]: sortDirection },
      page,
      limit: pageSize,
    })

    // Get total count for pagination
    const totalRecords = await remult.repo(User).count(where)

    return {
      users,
      totalRecords
    }
  }

  @BackendMethod({ allowed: Roles.admin })
  static async deleteUser(userId: string): Promise<void> {
    await remult.repo(User).delete(userId)
  }

  @BackendMethod({ allowed: Roles.admin })
  static async resetUserPassword(userId: string): Promise<void> {
    const user = await remult.repo(User).findId(userId)
    if (user) {
      await user.resetPassword()
    }
  }
}
