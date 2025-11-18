import {
  Entity,
  Fields,
  IdEntity,
  Relations,
  Validators
} from 'remult'
import { terms } from '../terms'
import { Project } from '../projects/project'

@Entity<Building>('buildings', {
  allowApiCrud: true,
  defaultOrderBy: { block: 'asc', plot: 'asc', subPlot: 'asc' }
})
export class Building extends IdEntity {

  @Relations.toOne<Building, Project>(() => Project, {
    caption: terms.project
  })
  project!: Project

  @Fields.string({
    validate: [Validators.required(terms.requiredFiled)],
    caption: terms.block
  })
  block = ''

  @Fields.string({
    validate: [Validators.required(terms.requiredFiled)],
    caption: terms.plot
  })
  plot = ''

  @Fields.string({
    caption: terms.subPlot
  })
  subPlot = ''

  @Fields.date({
    allowApiUpdate: false,
    caption: terms.createDate
  })
  createDate = new Date()
}
