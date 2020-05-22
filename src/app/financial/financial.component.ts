import { Component } from '@angular/core';

@Component({
  selector: 'financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss']
})



export class FinancialComponent {
  ageGroups = [
    {id:1, group:'65-74'},
    {id:2, group:'75+'},
  ];

  answer= ['','','']

  smoke = [
    {id:1, answer:'Yes'},
    {id:2, answer:'No'},
  ];

  drink = [
    {id:1, answer:'Yes'},
    {id:2, answer:'No'},
  ];


  getValue(dom: any){
    let ageValue = dom.value.ageGroup;
    let smokeOrnot = dom.value.smokeOrnot;
    let drinkOrnot = dom.value.drinkOrnot;
    this.answer= [ageValue, smokeOrnot,drinkOrnot]
    console.log(this.answer[0], this.answer[1], this.answer[2])
    return this.answer
  }

  print(){
    
  }


  constructor() { }

}
