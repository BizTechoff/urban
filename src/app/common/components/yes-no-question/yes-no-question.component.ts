import { Component } from '@angular/core';

@Component({
  selector: 'app-yes-no-question',
  templateUrl: './yes-no-question.component.html',
  styleUrl: './yes-no-question.component.scss'
})
export class YesNoQuestionComponent {
  args = { message: '', isQuestion: true }
}
