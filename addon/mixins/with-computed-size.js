import Ember from 'ember';

function canComputeSize(view) {
  return view._state === 'inDOM' && !view.isDestroyed && !view.isDestroying;
}

var ComputedSizeMixin = Ember.Mixin.create({

  computedWidth: function () {
    if (canComputeSize(this)) {
      return this.$().outerWidth();
    }
  }.property('windowSizeService.innerWidth').readOnly(),

  computedHeight: function () {
    if (canComputeSize(this)) {
      return this.$().outerHeight();
    }
  }.property('windowSizeService.innerHeight').readOnly(),

  syncComputedSize: function () {
    if (canComputeSize(this)) {
      this.notifyPropertyChange('computedWidth');
      this.notifyPropertyChange('computedHeight');
    }
  },

  scheduleSyncComputedSize: function () {
    if (canComputeSize(this)) {
      Ember.run.scheduleOnce('afterRender', this, 'syncComputedSize');
    }
  }.on('didInsertElement').on('willClearRender'),

  setupWithComputedSizeMixin: function () {
    if (!this._domSubtreeChangedListener) {
      this._domSubtreeListener = Ember.run.bind(this, 'scheduleSyncComputedSize');
      this.$().on('DOMSubtreeModified propertychange', this._domSubtreeListener);
    }
  }.on('didInsertElement'),

  teardownWithComputedSizeMixin: function () {
    if (this._domSubtreeListener) {
      this.$().off('DOMSubtreeModified propertychange', this._domSubtreeListener);
      this._domSubtreeListener = null;
    }
  }.on('willDestroyElement')

});


export default ComputedSizeMixin;
