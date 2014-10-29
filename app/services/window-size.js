import Ember from 'ember';

var WindowSizeService = Ember.Object.extend({

  innerWidth: function () {
    return Ember.$(window).innerWidth();
  }.property().readOnly(),

  innerHeight: function () {
    return Ember.$(window).innerHeight();
  }.property().readOnly(),

  scheduleSyncWindowSize: function () {
    Ember.run.debounce(this, 'syncWindowSize', 100);
  }.on('init'),

  syncWindowSize: function () {
    if (this.isDestroyed || this.isDestroying) {
      return;
    }
    Ember.run(this, function () {
      this.notifyPropertyChange('innerWidth');
      this.notifyPropertyChange('innerHeight');
    });
  },

  setupWindowSize: function () {
    if (!this._handler) {
      this._handler = Ember.run.bind(this, 'scheduleSyncWindowSize');
      Ember.$(window).on('resize', this._handler);
    }
  }.on('init'),

  teardownWindowSize: function () {
    if (this._handler) {
      Ember.$(window).on('resize', this._handler);
      this._handler = null;
    }
  }.on('destroy')

});

export default WindowSizeService;
