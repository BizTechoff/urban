import { BackendMethod, Controller, ControllerBase, remult } from 'remult'
import { Tenant } from '../../app/tenants/tenant'

export interface GetTenantsRequest {
  filter?: string
  apartmentId?: string
  sortField?: string
  sortDirection?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface GetTenantsResponse {
  tenants: Tenant[]
  totalRecords: number
}

@Controller('tenants')
export class TenantsController extends ControllerBase {

  @BackendMethod({ allowed: true })
  static async getTenants(request: GetTenantsRequest): Promise<GetTenantsResponse> {
    const {
      filter = '',
      apartmentId,
      sortField,
      sortDirection = 'asc',
      page = 1,
      pageSize = 30
    } = request

    const where: any = {}

    if (filter) {
      where.$or = [
        { firstName: { $contains: filter } },
        { lastName: { $contains: filter } },
        { mobile: { $contains: filter } }
      ]
    }

    if (apartmentId) {
      where.apartment = apartmentId
    }

    const queryOptions: any = {
      where,
      page,
      limit: pageSize,
    }

    if (sortField) {
      queryOptions.orderBy = { [sortField]: sortDirection }
    }

    const tenants = await remult.repo(Tenant).find(queryOptions)
    const totalRecords = await remult.repo(Tenant).count(where)

    return {
      tenants,
      totalRecords
    }
  }

  @BackendMethod({ allowed: true })
  static async deleteTenant(tenantId: string): Promise<void> {
    await remult.repo(Tenant).delete(tenantId)
  }

  @BackendMethod({ allowed: true })
  static async createTenant(tenantData: {
    apartmentId: string
    firstName: string
    lastName: string
    idNumber: string
    mobile: string
    additionalPhone: string
    isRepresentative: boolean
    isCommitteeMember: boolean
    isElderly: boolean
    actualAddress: string
    status: string
    propertyPercentage: number
    notes: string
  }): Promise<Tenant> {
    const tenant = remult.repo(Tenant).create()
    tenant.apartment = tenantData.apartmentId as any
    tenant.firstName = tenantData.firstName
    tenant.lastName = tenantData.lastName
    tenant.idNumber = tenantData.idNumber
    tenant.mobile = tenantData.mobile
    tenant.additionalPhone = tenantData.additionalPhone
    tenant.isRepresentative = tenantData.isRepresentative
    tenant.isCommitteeMember = tenantData.isCommitteeMember
    tenant.isElderly = tenantData.isElderly
    tenant.actualAddress = tenantData.actualAddress
    tenant.status = tenantData.status
    tenant.propertyPercentage = tenantData.propertyPercentage
    tenant.notes = tenantData.notes
    await tenant.save()
    return tenant
  }

  @BackendMethod({ allowed: true })
  static async updateTenant(
    tenantId: string,
    tenantData: {
      apartmentId: string
      firstName: string
      lastName: string
      idNumber: string
      mobile: string
      additionalPhone: string
      isRepresentative: boolean
      isCommitteeMember: boolean
      isElderly: boolean
      actualAddress: string
      status: string
      propertyPercentage: number
      notes: string
    }
  ): Promise<Tenant> {
    const tenant = await remult.repo(Tenant).findId(tenantId)
    if (!tenant) {
      throw new Error('דייר לא נמצא')
    }
    tenant.apartment = tenantData.apartmentId as any
    tenant.firstName = tenantData.firstName
    tenant.lastName = tenantData.lastName
    tenant.idNumber = tenantData.idNumber
    tenant.mobile = tenantData.mobile
    tenant.additionalPhone = tenantData.additionalPhone
    tenant.isRepresentative = tenantData.isRepresentative
    tenant.isCommitteeMember = tenantData.isCommitteeMember
    tenant.isElderly = tenantData.isElderly
    tenant.actualAddress = tenantData.actualAddress
    tenant.status = tenantData.status
    tenant.propertyPercentage = tenantData.propertyPercentage
    tenant.notes = tenantData.notes
    await tenant.save()
    return tenant
  }
}
