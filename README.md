a Tutorial
==========

This library was extracted from my project, in which I've originaly used a very nice library called IntroJS, but eventually had to switch to my own solution because there was too many things I needed to change in the original.

What makes my library different:

- it is written in TypeScript, but you can use the compiled tutorial.js version
- it requires Backbone (and underscore and jQuery) 
- it delegates most of the work to Backbone, jQuery and CSS
  - in particular almost all positioning is done in CSS
  - hiding/enabling controls is also done in CSS
  - also, this means that you can rely on jQuery's ability to measure things correctly, 
  - and Backbone's ability to synchronize changes in GUI with model, for example when element changes position/size dynamically, or you decide to change the text
- instead of using z-index tricks to make the focused control appear to be above the dark background, I've simply made a whole in the darkness through which you can see the control. This way there is less hacks you have to implement to resolve the z-index nightmare (I had a lot of issues with transforms, scales, visibility and z-index)
- it is not a singleton - you can have as many instances as you want. It is up to you though to start and stop them in the correct order
- if an element for a particular step is missing the tutorial waits for it, instead of progressing forward, which makes it easier to have a dynamically generated elements in the tutorial

I think it is also quite easy to style yourself.
You don't need Bootstrap for it to work, but if you do use Bootstrap, then buttons gain some default styles, though.

You can also change the step of the tutorial programatically.
Check for example.html what I do for `#two` - 
by using `no_next no_prev no_exit` in `css_class` I hide the buttons,
by assigning `"glow_when_tutorial_highlight"` to the element class I make it glow when it is active,
and by using `set('step',2)` in the onclick handler I force the tutorial to progress when the element is clicked.
