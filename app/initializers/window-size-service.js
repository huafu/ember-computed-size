export function initialize(container, application) {
  application.inject('view', 'windowSizeService', 'service:window-size');
}

export default {
  name: 'window-size-service',
  initialize: initialize
};
