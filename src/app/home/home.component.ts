import { Component, OnInit } from '@angular/core'
import { remult } from 'remult'
import { SignInController } from '../users/SignInController'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  signer = new SignInController()

  constructor() { }

  ngOnInit() { }

  async signIn() {
    remult.user = await this.signer.signIn()
  }

}
