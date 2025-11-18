import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { remult } from 'remult'
import { ApartmentsController } from '../../../shared/controllers/ApartmentsController'
import { terms } from '../../terms'
import { Apartment } from '../apartment'

@Component({
  selector: 'app-apartment-details',
  templateUrl: './apartment-details.component.html',
  styleUrl: './apartment-details.component.scss'
})
export class ApartmentDetailsComponent implements OnInit {
  args = { apartmentId: '', buildingId: '' }
  apartment = remult.repo(Apartment).create()
  isNew = true
  terms = terms
  changed = false

  constructor(private dialogRef: MatDialogRef<ApartmentDetailsComponent>) { }

  async ngOnInit() {
    if (!this.args) this.args = { apartmentId: '', buildingId: '' }
    if (this.args.apartmentId) {
      const a = await remult.repo(Apartment).findId(this.args.apartmentId, { useCache: false })
      if (!a) throw new Error(`apartmentId '${this.args.apartmentId}' NOT-FOUND`)
      this.apartment = a
      this.isNew = false
    } else if (this.args.buildingId) {
      this.apartment.building = this.args.buildingId as any
    }
  }

  async save() {
    try {
      if (this.isNew) {
        await ApartmentsController.createApartment({
          buildingId: this.apartment.building as any,
          floor: this.apartment.floor,
          propertyType: this.apartment.propertyType,
          size: this.apartment.size
        })
      } else {
        await ApartmentsController.updateApartment(this.apartment.id, {
          buildingId: this.apartment.building as any,
          floor: this.apartment.floor,
          propertyType: this.apartment.propertyType,
          size: this.apartment.size
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
