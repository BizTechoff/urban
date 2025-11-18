import { Injectable } from '@angular/core'
import { ApartmentsController, GetApartmentsRequest, GetApartmentsResponse } from '../../shared/controllers/ApartmentsController'
import { Apartment } from './apartment'
import { remult } from 'remult'

@Injectable({
  providedIn: 'root'
})
export class ApartmentsService {

  async getApartments(request: GetApartmentsRequest): Promise<GetApartmentsResponse> {
    return await ApartmentsController.getApartments(request)
  }

  getApartmentsLive(request: GetApartmentsRequest) {
    const where: any = {}
    if (request.buildingId) where.building = request.buildingId

    const queryOptions: any = { where }

    if (request.sortField) {
      queryOptions.orderBy = { [request.sortField]: request.sortDirection || 'asc' }
    }

    if (request.page && request.pageSize) {
      queryOptions.page = request.page
      queryOptions.limit = request.pageSize
    }

    return remult.repo(Apartment).liveQuery(queryOptions)
  }

  async deleteApartment(apartmentId: string): Promise<void> {
    return await ApartmentsController.deleteApartment(apartmentId)
  }
}
