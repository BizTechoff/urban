import { Component, OnInit } from '@angular/core'
import { SortEvent, PageEvent } from '../../common/components/base-table/table.interfaces'
import { UIToolsService } from '../../common/UIToolsService'
import { terms } from '../../terms'
import { Apartment } from '../apartment'
import { ApartmentsService } from '../apartments.service'
import { BusyService } from '../../common/components/wait/busyService'

@Component({
  selector: 'app-apartment-list',
  templateUrl: './apartment-list.component.html',
  styleUrl: './apartment-list.component.scss'
})
export class ApartmentListComponent implements OnInit {
  apartments: Apartment[] = []
  loading = false
  totalRecords = 0
  currentPage = 1
  pageSize = 30
  apartmentEntity = Apartment
  currentFilter = ''
  currentSort: SortEvent | null = null

  constructor(private ui: UIToolsService, private apartmentsService: ApartmentsService) {}

  async ngOnInit() { await this.loadApartments() }
  async loadApartments() {
    this.loading = true
    try {
      const response = await this.apartmentsService.getApartments({
        filter: this.currentFilter,
        sortField: this.currentSort?.field,
        sortDirection: this.currentSort?.direction,
        page: this.currentPage,
        pageSize: this.pageSize
      })
      this.apartments = response.apartments
      this.totalRecords = response.totalRecords
    } catch (error) {
      this.ui.error(error?.toString())
    } finally {
      this.loading = false
    }
  }
  async onSort(event: SortEvent) { this.currentSort = event; this.currentPage = 1; await this.loadApartments() }
  async onFilter(searchText: string) { this.currentFilter = searchText; this.currentPage = 1; await this.loadApartments() }
  async onPageChange(event: PageEvent) { this.currentPage = event.page; this.pageSize = event.pageSize; await this.loadApartments() }
  async onRefresh() { await this.loadApartments() }
  async addApartment() { const changed = await this.ui.openApartmentDetails(); if (changed) { this.ui.info('הדירה נוספה בהצלחה'); await this.loadApartments() } }
  async editApartment(apartment: Apartment) { const changed = await this.ui.openApartmentDetails(apartment.id); if (changed) { this.ui.info('הדירה עודכנה בהצלחה'); await this.loadApartments() } }
  async deleteApartment(apartment: Apartment) {
    const confirmed = await this.ui.yesNoQuestion(`${terms.areYouSureYouWouldLikeToDelete} דירה בקומה ${apartment.floor}?`, true)
    if (confirmed) {
      try { await this.apartmentsService.deleteApartment(apartment.id); this.ui.info('הדירה נמחקה בהצלחה'); await this.loadApartments() }
      catch (error) { this.ui.error(error) }
    }
  }
}
