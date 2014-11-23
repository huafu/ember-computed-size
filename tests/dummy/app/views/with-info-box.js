import Ember from 'ember';
import WithComputedSizeMixin from 'ember-computed-size/mixins/with-computed-size';

export default Ember.View.extend(WithComputedSizeMixin, {
  attributeBindings: ['style'],
  layoutName: 'with-info-box',
  classNames: ['with-info-box']
});
