///<reference path="tutorial_control.ts"/>
module Tutorial {
  export class TutorialPlayerControl extends Control {
    tutorial_control:Tutorial.TutorialControl;
    defaults(){
      return {
        step:0,
        steps:[],
        prevLabel: 'Back',
        nextLabel: 'Next',
        exitLabel: 'Exit',
      }
    }
    private updateTutorial(){
      var step=this.get('step');
      var steps=this.get('steps');
      if(step<steps.length){
        var merged = _.extend(this.pick(['prevLabel','nextLabel','exitLabel']),this.tutorial_control.defaults(),{visible:true},steps[step]);
        this.tutorial_control.set(merged);
      }else{
        this.end();
      }
    }
    private end(){
      if(this.tutorial_control){
        this.tutorial_control.quit();
        this.tutorial_control=null;
      }
    }
    public isRunning(){
      return this.tutorial_control && this.tutorial_control.get('visible');
    }
    initialize(){
      this.tutorial_control = new Tutorial.TutorialControl();
      this.listenTo(this.tutorial_control,"next",()=>{
        var step=Math.min(this.get('steps').length,this.get('step')+1);
        this.set('step',step);
      });
      this.listenTo(this.tutorial_control,"prev",()=>{
        var step=this.get('step')-1;
        if(0<=step){
          this.set('step',step);
        }
      });
      this.listenTo(this.tutorial_control,"exit",()=>{
        this.end();
      });
      this.listenTo(this,'change:step',this.updateTutorial);
      this.updateTutorial();
    }
  }
}
