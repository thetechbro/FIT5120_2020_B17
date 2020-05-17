import { Component, OnInit } from '@angular/core';

declare var tableau: any;

@Component({
  selector: 'tableau2',
  templateUrl: './tableau75.component.html',
  styleUrls: ['./tableau75.component.scss']
})
export class Tableau75Component implements OnInit {
  viz: any;
  ngOnInit(): void {
      var placeholderDiv = document.getElementById('vizContainer');
    // Replace this url with the url of your Tableau dashboard
      var url = 'https://public.tableau.com/views/ConsumerPatternofAgeGroup75/1_1?:display_count=y&publish=yes&:origin=viz_share_link';
      var options = {
              hideTabs: true,
              width: "100%",
              height: "700px",
              onFirstInteractive: function() {
                    // The viz is now ready and can be safely used.
                    console.log("Run this code when the viz has finished loading.");
              }
      };
      // Creating a viz object and embed it in the container div.
      this.viz = new tableau.Viz(placeholderDiv, url, options);
    }

}
  