import Ember from 'ember';

function canComputeSize(view) {
  return view._state === 'inDOM' && !view.isDestroyed && !view.isDestroying;
}

var ComputedSizeMixin = Ember.Mixin.create({

  computedWidth: Ember.computed('windowSizeService.innerWidth', function () {
    if (canComputeSize(this)) {
      return this.$().outerWidth();
    }
  }).readOnly(),

  computedHeight: Ember.computed('windowSizeService.innerHeight', function () {
    if (canComputeSize(this)) {
      return this.$().outerHeight();
    }
  }).readOnly(),

  syncComputedSize: function () {
    if (canComputeSize(this)) {
      this.notifyPropertyChange('computedWidth');
      this.notifyPropertyChange('computedHeight');
    }
  },

  scheduleSyncComputedSize: Ember.on('didInsertElement', 'willClearRender', function () {
    if (canComputeSize(this)) {
      Ember.run.scheduleOnce('afterRender', this, 'syncComputedSize');
    }
  }),

  setupWithComputedSizeMixin: Ember.on('didInsertElement', function () {
    if (!this._domSubtreeChangedListener) {
      this._domSubtreeListener = Ember.run.bind(this, 'scheduleSyncComputedSize');
      this.$().on('DOMSubtreeModified propertychange', this._domSubtreeListener);
    }
  }),

  teardownWithComputedSizeMixin: Ember.on('willDestroyElement', function () {
    if (this._domSubtreeListener) {
      this.$().off('DOMSubtreeModified propertychange', this._domSubtreeListener);
      this._domSubtreeListener = null;
    }
  })

});


export default ComputedSizeMixin;
