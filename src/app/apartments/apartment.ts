import {
  Entity,
  Fields,
  IdEntity,
  Relations,
  Validators
} from 'remult'
import { terms } from '../terms'
import { Building } from '../buildings/building'

@Entity<Apartment>('apartments', {
  allowApiCrud: true,
  defaultOrderBy: { floor: 'asc' }
})
export class Apartment extends IdEntity {

  @Relations.toOne<Apartment, Building>(() => Building, {
    caption: terms.building
  })
  building!: Building

  @Fields.number({
    validate: [Validators.required(terms.requiredFiled)],
    caption: terms.floor
  })
  floor = 0

  @Fields.string({
    caption: terms.propertyType
  })
  propertyType = ''

  @Fields.number({
    caption: terms.apartmentSize
  })
  size = 0

  @Fields.date({
    allowApiUpdate: false,
    caption: terms.createDate
  })
  createDate = new Date()
}
