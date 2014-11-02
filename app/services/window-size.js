import Ember from 'ember';

var WindowSizeService = Ember.Object.extend({

  innerWidth: Ember.computed(function () {
    return Ember.$(window).innerWidth();
  }).readOnly(),

  innerHeight: Ember.computed(function () {
    return Ember.$(window).innerHeight();
  }).readOnly(),

  scheduleSyncWindowSize: Ember.on('init', function () {
    Ember.run.debounce(this, 'syncWindowSize', 100);
  }),

  syncWindowSize: function () {
    if (this.isDestroyed || this.isDestroying) {
      return;
    }
    Ember.run(this, function () {
      this.notifyPropertyChange('innerWidth');
      this.notifyPropertyChange('innerHeight');
    });
  },

  setupWindowSize: Ember.on('init', function () {
    if (!this._handler) {
      this._handler = Ember.run.bind(this, 'scheduleSyncWindowSize');
      Ember.$(window).on('resize', this._handler);
    }
  }),

  teardownWindowSize: Ember.on('destroy', function () {
    if (this._handler) {
      Ember.$(window).off('resize', this._handler);
      this._handler = null;
    }
  })

});

export default WindowSizeService;
