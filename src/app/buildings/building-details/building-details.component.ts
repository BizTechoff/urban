import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { remult } from 'remult'
import { BuildingsController } from '../../../shared/controllers/BuildingsController'
import { terms } from '../../terms'
import { Building } from '../building'

@Component({
  selector: 'app-building-details',
  templateUrl: './building-details.component.html',
  styleUrl: './building-details.component.scss'
})
export class BuildingDetailsComponent implements OnInit {
  args = { buildingId: '', projectId: '' }
  building = remult.repo(Building).create()
  isNew = true
  terms = terms
  changed = false

  constructor(private dialogRef: MatDialogRef<BuildingDetailsComponent>) { }

  async ngOnInit() {
    if (!this.args) this.args = { buildingId: '', projectId: '' }
    if (this.args.buildingId) {
      const b = await remult.repo(Building).findId(this.args.buildingId, { useCache: false })
      if (!b) throw new Error(`buildingId '${this.args.buildingId}' NOT-FOUND`)
      this.building = b
      this.isNew = false
    } else if (this.args.projectId) {
      this.building.project = this.args.projectId as any
    }
  }

  async save() {
    try {
      if (this.isNew) {
        await BuildingsController.createBuilding({
          projectId: this.building.project as any,
          block: this.building.block,
          plot: this.building.plot,
          subPlot: this.building.subPlot
        })
      } else {
        await BuildingsController.updateBuilding(this.building.id, {
          projectId: this.building.project as any,
          block: this.building.block,
          plot: this.building.plot,
          subPlot: this.building.subPlot
        })
      }
      this.changed = true
      this.close()
    } catch (error: any) {
      throw error
    }
  }

  close() {
    this.dialogRef.close(this.changed)
  }

  cancel() {
    this.dialogRef.close(false)
  }
}
