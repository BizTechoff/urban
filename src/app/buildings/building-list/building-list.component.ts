import { Component, OnInit, OnDestroy, NgZone } from '@angular/core'
import { SortEvent, PageEvent } from '../../common/components/base-table/table.interfaces'
import { UIToolsService } from '../../common/UIToolsService'
import { terms } from '../../terms'
import { Building } from '../building'
import { BuildingsService } from '../buildings.service'
import { BusyService } from '../../common/components/wait/busyService'

@Component({
  selector: 'app-building-list',
  templateUrl: './building-list.component.html',
  styleUrl: './building-list.component.scss'
})
export class BuildingListComponent implements OnInit {
  buildings: Building[] = []
  loading = false
  totalRecords = 0
  currentPage = 1
  pageSize = 30
  buildingEntity = Building
  currentFilter = ''
  currentSort: SortEvent | null = null

  constructor(
    private ui: UIToolsService,
    private busyService: BusyService,
    private buildingsService: BuildingsService,
    private ngZone: NgZone
  ) {}

  async ngOnInit() {
    await this.loadBuildings()
  }

  async loadBuildings() {
    this.loading = true
    try {
      const response = await this.buildingsService.getBuildings({
        filter: this.currentFilter,
        sortField: this.currentSort?.field,
        sortDirection: this.currentSort?.direction,
        page: this.currentPage,
        pageSize: this.pageSize
      })
      this.buildings = response.buildings
      this.totalRecords = response.totalRecords
    } catch (error) {
      this.ui.error(error?.toString())
    } finally {
      this.loading = false
    }
  }

  async onSort(event: SortEvent) {
    this.currentSort = event
    this.currentPage = 1
    await this.loadBuildings()
  }

  async onFilter(searchText: string) {
    this.currentFilter = searchText
    this.currentPage = 1
    await this.loadBuildings()
  }

  async onPageChange(event: PageEvent) {
    this.currentPage = event.page
    this.pageSize = event.pageSize
    await this.loadBuildings()
  }

  async onRefresh() {
    await this.loadBuildings()
  }

  async addBuilding() {
    const changed = await this.ui.openBuildingDetails()
    if (changed) {
      this.ui.info('הבניין נוסף בהצלחה')
      await this.loadBuildings()
    }
  }

  async editBuilding(building: Building) {
    const changed = await this.ui.openBuildingDetails(building.id)
    if (changed) {
      this.ui.info('הבניין עודכן בהצלחה')
      await this.loadBuildings()
    }
  }

  async deleteBuilding(building: Building) {
    const confirmed = await this.ui.yesNoQuestion(
      `${terms.areYouSureYouWouldLikeToDelete} ${building.block}/${building.plot}?`,
      true
    )
    if (confirmed) {
      try {
        await this.buildingsService.deleteBuilding(building.id)
        this.ui.info('הבניין נמחק בהצלחה')
        await this.loadBuildings()
      } catch (error) {
        this.ui.error(error)
      }
    }
  }
}
