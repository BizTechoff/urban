import { Injectable } from '@angular/core'
import { TenantsController, GetTenantsRequest, GetTenantsResponse } from '../../shared/controllers/TenantsController'
import { Tenant } from './tenant'
import { remult } from 'remult'

@Injectable({
  providedIn: 'root'
})
export class TenantsService {

  async getTenants(request: GetTenantsRequest): Promise<GetTenantsResponse> {
    return await TenantsController.getTenants(request)
  }

  getTenantsLive(request: GetTenantsRequest) {
    const where: any = {}

    if (request.filter) {
      where.$or = [
        { firstName: { $contains: request.filter } },
        { lastName: { $contains: request.filter } },
        { mobile: { $contains: request.filter } }
      ]
    }

    if (request.apartmentId) where.apartment = request.apartmentId

    const queryOptions: any = { where }

    if (request.sortField) {
      queryOptions.orderBy = { [request.sortField]: request.sortDirection || 'asc' }
    }

    if (request.page && request.pageSize) {
      queryOptions.page = request.page
      queryOptions.limit = request.pageSize
    }

    return remult.repo(Tenant).liveQuery(queryOptions)
  }

  async deleteTenant(tenantId: string): Promise<void> {
    return await TenantsController.deleteTenant(tenantId)
  }
}
