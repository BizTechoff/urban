import {
  Entity,
  Fields,
  IdEntity,
  Relations,
  Validators
} from 'remult'
import { terms } from '../terms'
import { Apartment } from '../apartments/apartment'

@Entity<Tenant>('tenants', {
  allowApiCrud: true,
  defaultOrderBy: { lastName: 'asc', firstName: 'asc' }
})
export class Tenant extends IdEntity {

  @Relations.toOne<Tenant, Apartment>(() => Apartment, {
    caption: terms.apartment
  })
  apartment!: Apartment

  @Fields.string({
    validate: [Validators.required(terms.requiredFiled)],
    caption: terms.firstName
  })
  firstName = ''

  @Fields.string({
    validate: [Validators.required(terms.requiredFiled)],
    caption: terms.lastName
  })
  lastName = ''

  @Fields.string({
    caption: terms.idNumber
  })
  idNumber = ''

  @Fields.string({
    validate: [Validators.required(terms.requiredFiled)],
    caption: terms.mobile
  })
  mobile = ''

  @Fields.string({
    caption: terms.additionalPhone
  })
  additionalPhone = ''

  @Fields.boolean({
    caption: terms.isRepresentative
  })
  isRepresentative = false

  @Fields.boolean({
    caption: terms.isCommitteeMember
  })
  isCommitteeMember = false

  @Fields.boolean({
    caption: terms.isElderly
  })
  isElderly = false

  @Fields.string({
    caption: terms.actualAddress
  })
  actualAddress = ''

  @Fields.string({
    caption: terms.tenantStatus
  })
  status = '' // מעוניין/מת/נגד

  @Fields.number({
    caption: terms.propertyPercentage
  })
  propertyPercentage = 0

  @Fields.string({
    caption: terms.notes
  })
  notes = ''

  @Fields.date({
    allowApiUpdate: false,
    caption: terms.createDate
  })
  createDate = new Date()
}
