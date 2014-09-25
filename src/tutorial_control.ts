///<reference path="element_position_observer.ts"/>
///<reference path="background_mask_control.ts"/>
///<reference path="tutorial_hint_control.ts"/>
module Tutorial {
  export class TutorialView extends Backbone.View{
    model:TutorialControl;
    initialize(){
    }
    quit(){
      this.model.background_mask_control.getEl().remove();
    }
    render(){
      this.model.background_mask_control.getCentralElement().append(this.model.tutorial_hint_control.getEl());
      $(document.body).append(this.model.background_mask_control.getEl());
      return this;
    }
  }
  export class TutorialControl extends Control {
    view: TutorialView;
    background_mask_control : Tutorial.BackgroundMaskControl;
    element_position_observer : Tutorial.ElementPositionObserver;
    tutorial_hint_control : Tutorial.TutorialHintControl;
    defaults(){
      return {
        visible:false,
        element:null,
        css_class:"side-E",
        html:"",
      }
    }
    initialize(){
      this.element_position_observer = new Tutorial.ElementPositionObserver();
      this.element_position_observer.syncWith(this,'element');

      this.background_mask_control = new Tutorial.BackgroundMaskControl();
      _.each(['left','top','width','height'],(prop)=>{
        this.background_mask_control.syncWith(this.element_position_observer,prop);
      });
      this.background_mask_control.syncWith(this,'visible');

      this.tutorial_hint_control = new Tutorial.TutorialHintControl();

      _.each(['css_class','html','prevLabel','nextLabel','exitLabel'],(prop)=>{
        this.tutorial_hint_control.syncWith(this,prop);
      });

      this.view = new TutorialView({model:this});
      this.view.render();

      this.forwardEvent(this.tutorial_hint_control,'next');
      this.forwardEvent(this.tutorial_hint_control,'prev');
      this.forwardEvent(this.tutorial_hint_control,'exit');

      this.listenTo(this,'change:element',(model,element)=>{
        var current=$(element);
        var old=$('.tutorial_highlight');
        old.removeClass('tutorial_highlight');
        current.addClass('tutorial_highlight');
      });
    }
  }
}
