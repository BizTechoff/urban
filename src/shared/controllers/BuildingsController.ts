import { BackendMethod, Controller, ControllerBase, remult } from 'remult'
import { Building } from '../../app/buildings/building'

export interface GetBuildingsRequest {
  filter?: string
  projectId?: string
  sortField?: string
  sortDirection?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface GetBuildingsResponse {
  buildings: Building[]
  totalRecords: number
}

@Controller('buildings')
export class BuildingsController extends ControllerBase {

  @BackendMethod({ allowed: true })
  static async getBuildings(request: GetBuildingsRequest): Promise<GetBuildingsResponse> {
    const {
      filter = '',
      projectId,
      sortField,
      sortDirection = 'asc',
      page = 1,
      pageSize = 30
    } = request

    // Build where clause
    const where: any = {}

    if (filter) {
      where.block = { $contains: filter }
    }

    if (projectId) {
      where.project = projectId
    }

    // Build query options
    const queryOptions: any = {
      where,
      page,
      limit: pageSize,
    }

    if (sortField) {
      queryOptions.orderBy = { [sortField]: sortDirection }
    }

    const buildings = await remult.repo(Building).find(queryOptions)
    const totalRecords = await remult.repo(Building).count(where)

    return {
      buildings,
      totalRecords
    }
  }

  @BackendMethod({ allowed: true })
  static async deleteBuilding(buildingId: string): Promise<void> {
    await remult.repo(Building).delete(buildingId)
  }

  @BackendMethod({ allowed: true })
  static async createBuilding(buildingData: {
    projectId: string
    block: string
    plot: string
    subPlot: string
  }): Promise<Building> {
    const building = remult.repo(Building).create()
    building.project = buildingData.projectId as any
    building.block = buildingData.block
    building.plot = buildingData.plot
    building.subPlot = buildingData.subPlot
    await building.save()
    return building
  }

  @BackendMethod({ allowed: true })
  static async updateBuilding(
    buildingId: string,
    buildingData: {
      projectId: string
      block: string
      plot: string
      subPlot: string
    }
  ): Promise<Building> {
    const building = await remult.repo(Building).findId(buildingId)
    if (!building) {
      throw new Error('בניין לא נמצא')
    }
    building.project = buildingData.projectId as any
    building.block = buildingData.block
    building.plot = buildingData.plot
    building.subPlot = buildingData.subPlot
    await building.save()
    return building
  }
}
