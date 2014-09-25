var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="../externals/backbone.d.ts"/>
///<reference path="../externals/underscore.d.ts"/>
var Tutorial;
(function (Tutorial) {
    var Control = (function (_super) {
        __extends(Control, _super);
        function Control() {
            _super.apply(this, arguments);
        }
        Control.prototype.getEl = function () {
            return this.view.$el;
        };
        Control.prototype.quit = function () {
            for (var c in this) {
                var child = this[c];
                if (child instanceof Control || child instanceof Backbone.View && child.quit) {
                    child.quit();
                }
            }
            this.stopListening();
        };
        Control.prototype.syncWith = function (model, property, bothWays, myProperty) {
            if (typeof bothWays === "undefined") { bothWays = false; }
            var _this = this;
            myProperty = myProperty || property;
            this.listenTo(model, 'change:' + property, function (model, value) {
                _this.set(myProperty, value);
            });
            this.set(myProperty, model.get(property));
            if (bothWays) {
                model.listenTo(this, 'change:' + myProperty, function (t, value) {
                    model.set(property, value);
                });
            }
        };
        Control.prototype.forwardEvent = function (source, name) {
            var _this = this;
            this.listenTo(source, name, function () {
                var args = _.toArray(arguments);
                args.unshift(name);
                _this.trigger.apply(_this, args);
            });
        };
        return Control;
    })(Backbone.Model);
    Tutorial.Control = Control;
})(Tutorial || (Tutorial = {}));
///<reference path="control.ts"/>
///<reference path="../externals/jquery.d.ts"/>
var Tutorial;
(function (Tutorial) {
    var ElementPositionObserver = (function (_super) {
        __extends(ElementPositionObserver, _super);
        function ElementPositionObserver() {
            _super.apply(this, arguments);
            this.timer = null;
        }
        ElementPositionObserver.prototype.defaults = function () {
            return {
                element: null,
                width: 0,
                height: 0,
                top: 0,
                left: 0
            };
        };
        ElementPositionObserver.prototype.updatePosition = function () {
            var element = $(this.get('element'));
            if (element.length == 1) {
                this.set(_.extend({
                    width: element.outerWidth(),
                    height: element.outerHeight()
                }, element.offset()));
            } else {
                this.set('left', this.get('left') + this.get('width') / 2);
                this.set('width', 0);
                this.set('top', this.get('top') + this.get('height') / 2);
                this.set('height', 0);
            }
        };
        ElementPositionObserver.prototype.initialize = function () {
            var _this = this;
            this.timer = setInterval(function () {
                return _this.updatePosition();
            }, 100);
            this.listenTo(this, 'change:element', this.updatePosition);
            this.updatePosition();
        };
        ElementPositionObserver.prototype.quit = function () {
            window.clearInterval(this.timer);
        };
        return ElementPositionObserver;
    })(Tutorial.Control);
    Tutorial.ElementPositionObserver = ElementPositionObserver;
})(Tutorial || (Tutorial = {}));
///<reference path="control.ts"/>
var Tutorial;
(function (Tutorial) {
    var BackgroundMaskView = (function (_super) {
        __extends(BackgroundMaskView, _super);
        function BackgroundMaskView() {
            _super.apply(this, arguments);
        }
        BackgroundMaskView.prototype.className = function () {
            return 'background_mask_control';
        };
        BackgroundMaskView.prototype.events = function () {
            var _this = this;
            return {
                'click': function () {
                    return _this.trigger('clicked');
                }
            };
        };
        BackgroundMaskView.prototype.initialize = function () {
            this.listenTo(this.model, 'change', this.updatePosition);
        };
        BackgroundMaskView.prototype.getCentralElement = function () {
            return this.$('.central');
        };
        BackgroundMaskView.prototype.updatePosition = function () {
            this.$el.toggleClass('hidden', !this.model.get('visible'));
            var margin = this.model.get('margin');
            var left = this.model.get('left') - margin;
            var top = this.model.get('top') - margin;
            var width = this.model.get('width') + 2 * margin;
            var height = this.model.get('height') + 2 * margin;
            var right = left + width;
            var bottom = top + height;
            this.$('.left, .right, .central').css({
                top: top,
                height: height
            });
            this.$('.left').css({ width: left });
            this.$('.right').css({ left: right });
            this.$('.top').css({ height: top });
            this.$('.bottom').css({ top: bottom });
            this.$('.central').css({
                left: left,
                width: width
            });
        };
        BackgroundMaskView.prototype.render = function () {
            var html = '<div class="top"></div>' + '<div class="left"></div>' + '<div class="right"></div>' + '<div class="bottom"></div>' + '<div class="central">' + '  <div class="clipper">' + '    <div class="rounded"></div>' + '  </div>' + '</div>';
            this.$el.html(html);
            this.updatePosition();
            return this;
        };
        return BackgroundMaskView;
    })(Backbone.View);
    Tutorial.BackgroundMaskView = BackgroundMaskView;
    var BackgroundMaskControl = (function (_super) {
        __extends(BackgroundMaskControl, _super);
        function BackgroundMaskControl() {
            _super.apply(this, arguments);
        }
        BackgroundMaskControl.prototype.defaults = function () {
            return {
                visible: false,
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                margin: 10
            };
        };
        BackgroundMaskControl.prototype.getCentralElement = function () {
            return this.view.getCentralElement();
        };
        BackgroundMaskControl.prototype.initialize = function () {
            var _this = this;
            this.view = new BackgroundMaskView({ model: this });
            this.view.render();
            this.listenTo(this.view, 'clicked', function () {
                return _this.trigger('clicked');
            });
        };
        return BackgroundMaskControl;
    })(Tutorial.Control);
    Tutorial.BackgroundMaskControl = BackgroundMaskControl;
})(Tutorial || (Tutorial = {}));
///<reference path="control.ts"/>
///<reference path="../externals/jquery.d.ts"/>
var Tutorial;
(function (Tutorial) {
    var TutorialHintView = (function (_super) {
        __extends(TutorialHintView, _super);
        function TutorialHintView() {
            _super.apply(this, arguments);
        }
        TutorialHintView.prototype.className = function () {
            return 'tutorial_hint_control ' + this.model.get('css_class');
        };
        TutorialHintView.prototype.events = function () {
            var _this = this;
            return {
                'click .next': function () {
                    return _this.trigger('next');
                },
                'click .prev': function () {
                    return _this.trigger('prev');
                },
                'click .exit': function () {
                    return _this.trigger('exit');
                }
            };
        };
        TutorialHintView.prototype.initialize = function () {
            this.listenTo(this.model, 'change', this.render);
        };
        TutorialHintView.prototype.render = function () {
            var template = '<p class="body"><%= d.html %></p>' + '<div class="buttons">' + '<button class="btn btn-default prev"><%- d.prevLabel %></button>' + '<button class="btn btn-primary next"><%- d.nextLabel %></button>' + '<button class="btn btn-success exit"><%- d.exitLabel %></button>' + '</div>';

            this.$el.html(_.template(template, { variable: 'd' })(this.model.toJSON()));
            this.$el.attr('class', this.className());
            return this;
        };
        return TutorialHintView;
    })(Backbone.View);
    Tutorial.TutorialHintView = TutorialHintView;
    var TutorialHintControl = (function (_super) {
        __extends(TutorialHintControl, _super);
        function TutorialHintControl() {
            _super.apply(this, arguments);
        }
        TutorialHintControl.prototype.defaults = function () {
            return {
                html: "",
                css_class: "side-E"
            };
        };
        TutorialHintControl.prototype.initialize = function () {
            this.view = new TutorialHintView({ model: this });
            this.view.render();
            this.forwardEvent(this.view, 'next');
            this.forwardEvent(this.view, 'prev');
            this.forwardEvent(this.view, 'exit');
        };
        return TutorialHintControl;
    })(Tutorial.Control);
    Tutorial.TutorialHintControl = TutorialHintControl;
})(Tutorial || (Tutorial = {}));
///<reference path="element_position_observer.ts"/>
///<reference path="background_mask_control.ts"/>
///<reference path="tutorial_hint_control.ts"/>
var Tutorial;
(function (Tutorial) {
    var TutorialView = (function (_super) {
        __extends(TutorialView, _super);
        function TutorialView() {
            _super.apply(this, arguments);
        }
        TutorialView.prototype.initialize = function () {
        };
        TutorialView.prototype.quit = function () {
            this.model.background_mask_control.getEl().remove();
        };
        TutorialView.prototype.render = function () {
            this.model.background_mask_control.getCentralElement().append(this.model.tutorial_hint_control.getEl());
            $(document.body).append(this.model.background_mask_control.getEl());
            return this;
        };
        return TutorialView;
    })(Backbone.View);
    Tutorial.TutorialView = TutorialView;
    var TutorialControl = (function (_super) {
        __extends(TutorialControl, _super);
        function TutorialControl() {
            _super.apply(this, arguments);
        }
        TutorialControl.prototype.defaults = function () {
            return {
                visible: false,
                element: null,
                css_class: "side-E",
                html: ""
            };
        };
        TutorialControl.prototype.initialize = function () {
            var _this = this;
            this.element_position_observer = new Tutorial.ElementPositionObserver();
            this.element_position_observer.syncWith(this, 'element');

            this.background_mask_control = new Tutorial.BackgroundMaskControl();
            _.each(['left', 'top', 'width', 'height'], function (prop) {
                _this.background_mask_control.syncWith(_this.element_position_observer, prop);
            });
            this.background_mask_control.syncWith(this, 'visible');

            this.tutorial_hint_control = new Tutorial.TutorialHintControl();

            _.each(['css_class', 'html', 'prevLabel', 'nextLabel', 'exitLabel'], function (prop) {
                _this.tutorial_hint_control.syncWith(_this, prop);
            });

            this.view = new TutorialView({ model: this });
            this.view.render();

            this.forwardEvent(this.tutorial_hint_control, 'next');
            this.forwardEvent(this.tutorial_hint_control, 'prev');
            this.forwardEvent(this.tutorial_hint_control, 'exit');

            this.listenTo(this, 'change:element', function (model, element) {
                var current = $(element);
                var old = $('.tutorial_highlight');
                old.removeClass('tutorial_highlight');
                current.addClass('tutorial_highlight');
            });
        };
        return TutorialControl;
    })(Tutorial.Control);
    Tutorial.TutorialControl = TutorialControl;
})(Tutorial || (Tutorial = {}));
///<reference path="tutorial_control.ts"/>
var Tutorial;
(function (Tutorial) {
    var TutorialPlayerControl = (function (_super) {
        __extends(TutorialPlayerControl, _super);
        function TutorialPlayerControl() {
            _super.apply(this, arguments);
        }
        TutorialPlayerControl.prototype.defaults = function () {
            return {
                step: 0,
                steps: [],
                prevLabel: 'Back',
                nextLabel: 'Next',
                exitLabel: 'Exit'
            };
        };
        TutorialPlayerControl.prototype.updateTutorial = function () {
            var step = this.get('step');
            var steps = this.get('steps');
            if (step < steps.length) {
                var merged = _.extend(this.pick(['prevLabel', 'nextLabel', 'exitLabel']), this.tutorial_control.defaults(), { visible: true }, steps[step]);
                this.tutorial_control.set(merged);
            } else {
                this.end();
            }
        };
        TutorialPlayerControl.prototype.end = function () {
            if (this.tutorial_control) {
                this.tutorial_control.quit();
                this.tutorial_control = null;
            }
        };
        TutorialPlayerControl.prototype.isRunning = function () {
            return this.tutorial_control && this.tutorial_control.get('visible');
        };
        TutorialPlayerControl.prototype.initialize = function () {
            var _this = this;
            this.tutorial_control = new Tutorial.TutorialControl();
            this.listenTo(this.tutorial_control, "next", function () {
                var step = Math.min(_this.get('steps').length, _this.get('step') + 1);
                _this.set('step', step);
            });
            this.listenTo(this.tutorial_control, "prev", function () {
                var step = _this.get('step') - 1;
                if (0 <= step) {
                    _this.set('step', step);
                }
            });
            this.listenTo(this.tutorial_control, "exit", function () {
                _this.end();
            });
            this.listenTo(this, 'change:step', this.updateTutorial);
            this.updateTutorial();
        };
        return TutorialPlayerControl;
    })(Tutorial.Control);
    Tutorial.TutorialPlayerControl = TutorialPlayerControl;
})(Tutorial || (Tutorial = {}));
