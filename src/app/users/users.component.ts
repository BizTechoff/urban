import { Component, OnInit, OnDestroy } from '@angular/core'
import { User } from './user'
import { Roles } from './roles'
import { terms } from '../terms'
import { remult } from 'remult'
import { BusyService } from '../common/busyService'
import { UIToolsService } from '../common/UIToolsService'
import { SortEvent, PageEvent } from '../common/components/base-table/table.interfaces'
import { UsersService } from './users.service'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = []
  loading = false
  totalRecords = 0
  currentPage = 1
  pageSize = 30

  // Current filters/sorting
  currentFilter = ''
  currentSort: SortEvent = { field: 'name', direction: 'asc' }

  // LiveQuery mode toggle
  useLiveQuery = false  // ברירת מחדל: Regular query
  private liveQueryUnsubscribe?: VoidFunction

  constructor(
    private ui: UIToolsService,
    private busyService: BusyService,
    private usersService: UsersService
  ) {}

  isAdmin() {
    return remult.isAllowed(Roles.admin)
  }
  async ngOnInit() {
    if (this.useLiveQuery) {
      this.loadUsersLive()
    } else {
      await this.loadUsers()
    }
  }

  ngOnDestroy() {
    // Cleanup LiveQuery subscription
    this.liveQueryUnsubscribe?.()
  }

  // Regular Query - דרך Service → Controller → DB
  async loadUsers() {
    this.loading = true
    try {
      // Call service → controller → DB
      const response = await this.usersService.getUsers({
        filter: this.currentFilter,
        sortField: this.currentSort.field,
        sortDirection: this.currentSort.direction,
        page: this.currentPage,
        pageSize: this.pageSize
      })

      this.users = response.users
      this.totalRecords = response.totalRecords
    } catch (error) {
      this.ui.error(error?.toString())
    } finally {
      this.loading = false
    }
  }

  // LiveQuery - עדכונים אוטומטיים בזמן אמת
  loadUsersLive() {
    this.loading = true

    // Unsubscribe from previous subscription
    this.liveQueryUnsubscribe?.()

    // Subscribe to LiveQuery
    const liveQuery = this.usersService.getUsersLive({
      filter: this.currentFilter,
      sortField: this.currentSort.field,
      sortDirection: this.currentSort.direction,
      page: this.currentPage,
      pageSize: this.pageSize
    })

    // Subscribe to changes
    this.liveQueryUnsubscribe = liveQuery.subscribe((info) => {
      this.users = info.items  // LiveQuery מחזיר info.items
      this.loading = false

      // Note: LiveQuery לא מחזיר totalRecords, צריך שליפה נפרדת
      this.loadTotalCount()
    })
  }

  // Helper method לספירה (בשביל LiveQuery)
  private async loadTotalCount() {
    try {
      const where = this.currentFilter ? { name: { $contains: this.currentFilter } } : {}
      this.totalRecords = await remult.repo(User).count(where)
    } catch (error) {
      console.error('Failed to load total count:', error)
    }
  }

  // Event handlers for base-table
  async onSort(event: SortEvent) {
    this.currentSort = event
    this.currentPage = 1 // Reset to first page

    if (this.useLiveQuery) {
      this.loadUsersLive()
    } else {
      await this.loadUsers()
    }
  }

  async onFilter(searchText: string) {
    this.currentFilter = searchText
    this.currentPage = 1 // Reset to first page

    if (this.useLiveQuery) {
      this.loadUsersLive()
    } else {
      await this.loadUsers()
    }
  }

  async onPageChange(event: PageEvent) {
    this.currentPage = event.page
    this.pageSize = event.pageSize

    if (this.useLiveQuery) {
      this.loadUsersLive()
    } else {
      await this.loadUsers()
    }
  }

  async onRefresh() {
    if (this.useLiveQuery) {
      this.loadUsersLive()
    } else {
      await this.loadUsers()
    }
  }

  // Toggle between Regular and LiveQuery modes
  toggleQueryMode() {
    this.useLiveQuery = !this.useLiveQuery

    if (this.useLiveQuery) {
      this.ui.info('מצב LiveQuery הופעל - עדכונים בזמן אמת')
      this.loadUsersLive()
    } else {
      this.ui.info('מצב Regular Query הופעל - קריאות ידניות')
      this.liveQueryUnsubscribe?.()
      this.loadUsers()
    }
  }

  addUser() {
    // TODO: Open add user dialog
    this.ui.info('הוספת משתמש חדש')
  }

  async editUser(user: User) {
    // TODO: Open edit dialog
    this.ui.info('Edit user: ' + user.name)
  }

  async deleteUser(user: User) {
    const confirmed = await this.ui.yesNoQuestion(
      `${terms.areYouSureYouWouldLikeToDelete} ${user.name}?`,
      true
    )

    if (confirmed) {
      try {
        // Call service → controller
        await this.usersService.deleteUser(user.id)
        this.ui.info('המשתמש נמחק בהצלחה')
        await this.loadUsers() // Refresh list
      } catch (error) {
        this.ui.error(error)
      }
    }
  }

  async resetPassword(user: User) {
    const confirmed = await this.ui.yesNoQuestion(
      `${terms.passwordDeleteConfirmOf} ${user.name}?`,
      true
    )

    if (confirmed) {
      try {
        // Call service → controller
        await this.usersService.resetUserPassword(user.id)
        this.ui.info(terms.passwordDeletedSuccessful)
      } catch (error) {
        this.ui.error(error)
      }
    }
  }
}
