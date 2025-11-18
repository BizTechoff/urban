import { BackendMethod, Controller, ControllerBase, remult } from 'remult'
import { Apartment } from '../../app/apartments/apartment'

export interface GetApartmentsRequest {
  filter?: string
  buildingId?: string
  sortField?: string
  sortDirection?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface GetApartmentsResponse {
  apartments: Apartment[]
  totalRecords: number
}

@Controller('apartments')
export class ApartmentsController extends ControllerBase {

  @BackendMethod({ allowed: true })
  static async getApartments(request: GetApartmentsRequest): Promise<GetApartmentsResponse> {
    const {
      filter = '',
      buildingId,
      sortField,
      sortDirection = 'asc',
      page = 1,
      pageSize = 30
    } = request

    const where: any = {}

    if (buildingId) {
      where.building = buildingId
    }

    const queryOptions: any = {
      where,
      page,
      limit: pageSize,
    }

    if (sortField) {
      queryOptions.orderBy = { [sortField]: sortDirection }
    }

    const apartments = await remult.repo(Apartment).find(queryOptions)
    const totalRecords = await remult.repo(Apartment).count(where)

    return {
      apartments,
      totalRecords
    }
  }

  @BackendMethod({ allowed: true })
  static async deleteApartment(apartmentId: string): Promise<void> {
    await remult.repo(Apartment).delete(apartmentId)
  }

  @BackendMethod({ allowed: true })
  static async createApartment(apartmentData: {
    buildingId: string
    floor: number
    propertyType: string
    size: number
  }): Promise<Apartment> {
    const apartment = remult.repo(Apartment).create()
    apartment.building = apartmentData.buildingId as any
    apartment.floor = apartmentData.floor
    apartment.propertyType = apartmentData.propertyType
    apartment.size = apartmentData.size
    await apartment.save()
    return apartment
  }

  @BackendMethod({ allowed: true })
  static async updateApartment(
    apartmentId: string,
    apartmentData: {
      buildingId: string
      floor: number
      propertyType: string
      size: number
    }
  ): Promise<Apartment> {
    const apartment = await remult.repo(Apartment).findId(apartmentId)
    if (!apartment) {
      throw new Error('דירה לא נמצאה')
    }
    apartment.building = apartmentData.buildingId as any
    apartment.floor = apartmentData.floor
    apartment.propertyType = apartmentData.propertyType
    apartment.size = apartmentData.size
    await apartment.save()
    return apartment
  }
}
