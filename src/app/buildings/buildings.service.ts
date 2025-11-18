import { Injectable } from '@angular/core'
import { BuildingsController, GetBuildingsRequest, GetBuildingsResponse } from '../../shared/controllers/BuildingsController'
import { Building } from './building'
import { remult } from 'remult'

@Injectable({
  providedIn: 'root'
})
export class BuildingsService {

  async getBuildings(request: GetBuildingsRequest): Promise<GetBuildingsResponse> {
    return await BuildingsController.getBuildings(request)
  }

  getBuildingsLive(request: GetBuildingsRequest) {
    const where: any = {}
    if (request.filter) where.block = { $contains: request.filter }
    if (request.projectId) where.project = request.projectId

    const queryOptions: any = { where }

    if (request.sortField) {
      queryOptions.orderBy = { [request.sortField]: request.sortDirection || 'asc' }
    }

    if (request.page && request.pageSize) {
      queryOptions.page = request.page
      queryOptions.limit = request.pageSize
    }

    return remult.repo(Building).liveQuery(queryOptions)
  }

  async deleteBuilding(buildingId: string): Promise<void> {
    return await BuildingsController.deleteBuilding(buildingId)
  }
}
