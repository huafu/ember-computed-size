import Ember from 'ember';

function canComputeSize(view) {
  return view._state === 'inDOM' && !view.isDestroyed && !view.isDestroying;
}

/**
 * @mixin ComputedSizeMixin
 */
var ComputedSizeMixin = Ember.Mixin.create({
  /**
   * Whether to reset the dimensions before computing the width and height
   * @property useRealSize
   * @type Boolean
   */
  useRealSize: false,

  /**
   * Wrap size calculations so that the CSS dimensions are reset first if necessary
   *
   * @method wrapComputedSizeCalculation
   * @param {Function} method
   * @returns {*}
   */
  wrapComputedSizeCalculation: function (method) {
    var saved, value;
    if (canComputeSize(this)) {
      if (this.get('computedSizeResetDimensionsFirst')) {
        saved = this.$().css(['width', 'height']);
        this.$().css({width: 'auto', height: 'auto'});
        value = method.apply(this);
        this.$().css(saved);
      }
      else {
        value = method.apply(this);
      }
      return value;
    }
  },

  /**
   * @property computedWidth
   * @type Number
   */
  computedWidth: Ember.computed(
    'windowSizeService.innerWidth', 'computedSizeResetDimensionsFirst', function () {
      return this.wrapComputedSizeCalculation(function () {
        return this.$().width();
      });
    }
  ).readOnly(),

  /**
   * @property computedHeight
   * @type Number
   */
  computedHeight: Ember.computed(
    'windowSizeService.innerHeight', 'computedSizeResetDimensionsFirst', function () {
      return this.wrapComputedSizeCalculation(function () {
        return this.$().height();
      });
    }
  ).readOnly(),

  /**
   * Synchronize the computed size properties
   *
   * @method syncComputedSize
   */
  syncComputedSize: function () {
    if (canComputeSize(this)) {
      this.notifyPropertyChange('computedWidth');
      this.notifyPropertyChange('computedHeight');
    }
  },

  /**
   * Schedule a synchronization of the computed size properties
   *
   * @method scheduleSyncComputedSize
   */
  scheduleSyncComputedSize: Ember.on('didInsertElement', 'willClearRender', function () {
    if (canComputeSize(this)) {
      Ember.run.scheduleOnce('afterRender', this, 'syncComputedSize');
    }
  }),

  /**
   * Initialize our mixin
   *
   * @method setupWithComputedSizeMixin
   */
  setupWithComputedSizeMixin: Ember.on('didInsertElement', function () {
    if (!this._domSubtreeListener) {
      this._domSubtreeListener = Ember.run.bind(this, 'scheduleSyncComputedSize');
      this.$().on('DOMSubtreeModified propertychange', this._domSubtreeListener);
    }
  }),

  /**
   * Terminate our mixin
   *
   * @method teardownWithComputedSizeMixin
   */
  teardownWithComputedSizeMixin: Ember.on('willDestroyElement', function () {
    if (this._domSubtreeListener) {
      this.$().off('DOMSubtreeModified propertychange', this._domSubtreeListener);
      this._domSubtreeListener = null;
    }
  })

});


export default ComputedSizeMixin;
