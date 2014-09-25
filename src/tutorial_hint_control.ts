///<reference path="control.ts"/>
///<reference path="../externals/jquery.d.ts"/>
module Tutorial {
  export class TutorialHintView extends Backbone.View{
    model:TutorialHintControl;
    className(){return 'tutorial_hint_control ' + this.model.get('css_class');}
    events(){
      return {
        'click .next' : () => this.trigger('next'),
        'click .prev' : () => this.trigger('prev'),
        'click .exit' : () => this.trigger('exit'),
      }
    }
    initialize(){
      this.listenTo(this.model,'change',this.render);
    }
    render(){
      var template=
   '<p class="body"><%= d.html %></p>'+
   '<div class="buttons">'+
     '<button class="btn btn-default prev"><%- d.prevLabel %></button>'+
     '<button class="btn btn-primary next"><%- d.nextLabel %></button>'+
     '<button class="btn btn-success exit"><%- d.exitLabel %></button>'+
   '</div>';

      this.$el.html(_.template(template,{variable:'d'})(this.model.toJSON()));
      this.$el.attr('class',this.className());
      return this;
    }
  }
  export class TutorialHintControl extends Control {
    view: TutorialHintView;
    defaults(){
      return {
        html:"",
        css_class:"side-E",
      }
    }
    initialize(){
      this.view = new TutorialHintView({model:this});
      this.view.render();
      this.forwardEvent(this.view,'next');
      this.forwardEvent(this.view,'prev');
      this.forwardEvent(this.view,'exit');
    }
  }
}
