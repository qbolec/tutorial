///<reference path="../externals/backbone.d.ts"/>
///<reference path="../externals/underscore.d.ts"/>
module Tutorial {
  export class Control extends Backbone.Model{
    view : Backbone.View;
    getEl(){
      return this.view.$el;
    }
    quit(){
      for(var c in this){
        var child=this[c];
        if(child instanceof Control || child instanceof Backbone.View && child.quit){
          child.quit();
        }
      }
      this.stopListening();
    }
    syncWith(model:Backbone.Model,property:string,bothWays=false,myProperty?:string):void{
      myProperty = myProperty || property;
      this.listenTo(model,'change:'+property,(model,value)=>{
        this.set(myProperty,value);
      });
      this.set(myProperty,model.get(property));
      if(bothWays){
        model.listenTo(this,'change:'+myProperty,(t,value)=>{
          model.set(property,value);
        });
      }
    }
    forwardEvent(source,name):void{
      this.listenTo(source,name,()=>{
        var args = _.toArray(arguments);
        args.unshift(name);
        this.trigger.apply(this,args);
      });
    }
  }
}
