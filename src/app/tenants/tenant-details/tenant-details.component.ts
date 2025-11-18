import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { remult } from 'remult'
import { TenantsController } from '../../../shared/controllers/TenantsController'
import { terms } from '../../terms'
import { Tenant } from '../tenant'
import { DialogConfig } from '../../common/dialogConfig'

@DialogConfig({
  maxHeight: '85vh',
  maxWidth: '600px',
  panelClass: 'tenant-details-dialog'
})
@Component({
  selector: 'app-tenant-details',
  templateUrl: './tenant-details.component.html',
  styleUrl: './tenant-details.component.scss'
})
export class TenantDetailsComponent implements OnInit {
  args = { tenantId: '', apartmentId: '' }
  tenant = remult.repo(Tenant).create()
  isNew = true
  terms = terms
  changed = false

  constructor(private dialogRef: MatDialogRef<TenantDetailsComponent>) { }

  async ngOnInit() {
    if (!this.args) this.args = { tenantId: '', apartmentId: '' }
    if (this.args.tenantId) {
      const t = await remult.repo(Tenant).findId(this.args.tenantId, { useCache: false })
      if (!t) throw new Error(`tenantId '${this.args.tenantId}' NOT-FOUND`)
      this.tenant = t
      this.isNew = false
    } else if (this.args.apartmentId) {
      this.tenant.apartment = this.args.apartmentId as any
    }
  }

  async save() {
    try {
      if (this.isNew) {
        await TenantsController.createTenant({
          apartmentId: this.tenant.apartment as any,
          firstName: this.tenant.firstName,
          lastName: this.tenant.lastName,
          idNumber: this.tenant.idNumber,
          mobile: this.tenant.mobile,
          additionalPhone: this.tenant.additionalPhone,
          isRepresentative: this.tenant.isRepresentative,
          isCommitteeMember: this.tenant.isCommitteeMember,
          isElderly: this.tenant.isElderly,
          actualAddress: this.tenant.actualAddress,
          status: this.tenant.status,
          propertyPercentage: this.tenant.propertyPercentage,
          notes: this.tenant.notes
        })
      } else {
        await TenantsController.updateTenant(this.tenant.id, {
          apartmentId: this.tenant.apartment as any,
          firstName: this.tenant.firstName,
          lastName: this.tenant.lastName,
          idNumber: this.tenant.idNumber,
          mobile: this.tenant.mobile,
          additionalPhone: this.tenant.additionalPhone,
          isRepresentative: this.tenant.isRepresentative,
          isCommitteeMember: this.tenant.isCommitteeMember,
          isElderly: this.tenant.isElderly,
          actualAddress: this.tenant.actualAddress,
          status: this.tenant.status,
          propertyPercentage: this.tenant.propertyPercentage,
          notes: this.tenant.notes
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
