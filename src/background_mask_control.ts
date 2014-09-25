///<reference path="control.ts"/>
module Tutorial {
  export class BackgroundMaskView extends Backbone.View{
    model:BackgroundMaskControl;
    className(){return 'background_mask_control';}
    events(){
      return {
        'click' : () => this.trigger('clicked'),
      }
    }
    initialize(){
       this.listenTo(this.model,'change',this.updatePosition);
    }
    getCentralElement(){
      return this.$('.central');
    }
    updatePosition(){
      this.$el.toggleClass('hidden',!this.model.get('visible'));
      var margin = this.model.get('margin');
      var left=this.model.get('left')-margin;
      var top=this.model.get('top')-margin;
      var width=this.model.get('width')+2*margin;
      var height=this.model.get('height')+2*margin;
      var right=left+width;
      var bottom=top+height;
      this.$('.left, .right, .central').css({
        top: top,
        height:height,
      });
      this.$('.left').css({width:left});
      this.$('.right').css({left:right});
      this.$('.top').css({height:top});
      this.$('.bottom').css({top:bottom});
      this.$('.central').css({
        left:left,
        width:width,
      });
    }
    render(){
      var html =
   '<div class="top"></div>'+
   '<div class="left"></div>'+
   '<div class="right"></div>'+
   '<div class="bottom"></div>'+
   '<div class="central">'+
   '  <div class="clipper">'+
   '    <div class="rounded"></div>'+
   '  </div>'+
   '</div>';
      this.$el.html(html);
      this.updatePosition();
      return this;
    }
  }
  export class BackgroundMaskControl extends Control {
    view: BackgroundMaskView;
    defaults(){
      return {
        visible:false,
        left:0,
        top:0,
        width:0,
        height:0,
        margin:10,
      }
    }
    getCentralElement(){
      return this.view.getCentralElement();
    }
    initialize(){
      this.view = new BackgroundMaskView({model:this});
      this.view.render();
      this.listenTo(this.view,'clicked',()=>this.trigger('clicked'));
    }
  }
}
