# ember-computed-size

Need to have some properties on your views with the current width and height of their main element?
Here is the mixin which does this for you.

It also provide a `windowSizeService` accessible on the
views so that you can bind some properties on `windowSizeService.innerWidth` and
`windowSizeService.innerHeight`. For the elements, it uses this service in the `WithComputedSizeMixin`
as well as listening for `DOMSubtreeModified` (and `propertychange` for IE) to schedule the update of
`computedWidth` and `computedHeight` of your views.


## Installation

* `npm install --save-dev ember-computed-size`
* Use the mixin in your views:

    ```js
    import Ember from 'ember';
    import WithComputedSizeMixin from 'ember-computed-size/mixins/with-computed-size';
    
    export default Ember.View.extend(WithComputedSizeMixin, {
      // here you have now 2 properties `computedWidth` and `computedHeight` which
      // are updated when needed, corresponding to the outerWidth and outerHeight of
      // your view main element.
      
      // there is also an option to get the **real** computed `width` and `height`,
      // say if you had set some `width` and/or `height` in CSS. For that, set the
      // `useRealSize` property to true, and this addon will reset CSS `width` and
      // `height` to `auto` before computing them, after what it'd reset the override.
      //useRealSize: true
    });
    ```

## Authors

* ![Huafu Gandon](https://s.gravatar.com/avatar/950590a0d4bc96f4a239cac955112eeb?s=24) [Huafu Gandon](https://github.com/huafu)
