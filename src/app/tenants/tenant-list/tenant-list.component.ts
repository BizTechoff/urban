import { Component, OnInit } from '@angular/core'
import { SortEvent, PageEvent } from '../../common/components/base-table/table.interfaces'
import { UIToolsService } from '../../common/UIToolsService'
import { terms } from '../../terms'
import { Tenant } from '../tenant'
import { TenantsService } from '../tenants.service'

@Component({
  selector: 'app-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrl: './tenant-list.component.scss'
})
export class TenantListComponent implements OnInit {
  tenants: Tenant[] = []
  loading = false
  totalRecords = 0
  currentPage = 1
  pageSize = 30
  tenantEntity = Tenant
  currentFilter = ''
  currentSort: SortEvent | null = null

  constructor(private ui: UIToolsService, private tenantsService: TenantsService) {}

  async ngOnInit() { await this.loadTenants() }
  async loadTenants() {
    this.loading = true
    try {
      const response = await this.tenantsService.getTenants({
        filter: this.currentFilter,
        sortField: this.currentSort?.field,
        sortDirection: this.currentSort?.direction,
        page: this.currentPage,
        pageSize: this.pageSize
      })
      this.tenants = response.tenants
      this.totalRecords = response.totalRecords
    } catch (error) { this.ui.error(error?.toString()) } finally { this.loading = false }
  }
  async onSort(event: SortEvent) { this.currentSort = event; this.currentPage = 1; await this.loadTenants() }
  async onFilter(searchText: string) { this.currentFilter = searchText; this.currentPage = 1; await this.loadTenants() }
  async onPageChange(event: PageEvent) { this.currentPage = event.page; this.pageSize = event.pageSize; await this.loadTenants() }
  async onRefresh() { await this.loadTenants() }
  async addTenant() { const changed = await this.ui.openTenantDetails(); if (changed) { this.ui.info('הדייר נוסף בהצלחה'); await this.loadTenants() } }
  async editTenant(tenant: Tenant) { const changed = await this.ui.openTenantDetails(tenant.id); if (changed) { this.ui.info('הדייר עודכן בהצלחה'); await this.loadTenants() } }
  async deleteTenant(tenant: Tenant) {
    const confirmed = await this.ui.yesNoQuestion(`${terms.areYouSureYouWouldLikeToDelete} ${tenant.firstName} ${tenant.lastName}?`, true)
    if (confirmed) {
      try { await this.tenantsService.deleteTenant(tenant.id); this.ui.info('הדייר נמחק בהצלחה'); await this.loadTenants() }
      catch (error) { this.ui.error(error) }
    }
  }
}
