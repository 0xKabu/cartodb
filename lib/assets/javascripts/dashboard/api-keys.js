
const Polyglot = require('node-polyglot');
const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone');
const Locale = require('../locale/index');
const UserModel = require('dashboard/data/user-model');
const ConfigModel = require('dashboard/data/config-model');
const DashboardHeaderView = require('dashboard/components/dashboard-header-view');
const SupportView = require('dashboard/components/support-view');
const HeaderViewModel = require('dashboard/views/api-keys/header-view-model');
const UpgradeMessageView = require('dashboard/components/upgrade-message-view');
const UserNotificationView = require('dashboard/components/user-notification/user-notification-view');
const ApiKeysListView = require('dashboard/views/api-keys/api-keys-list-view');
const ApiKeysFormView = require('dashboard/views/api-keys/api-keys-form-view');
const StackLayoutView = require('cartodb3/components/stack-layout/stack-layout-view');
const UserNotificationModel = require('dashboard/components/user-notification/user-notification-model');

const ACTIVE_LOCALE = window.ACTIVE_LOCALE || 'en';
const polyglot = new Polyglot({
  locale: ACTIVE_LOCALE, // Needed for pluralize behaviour
  phrases: Locale[ACTIVE_LOCALE]
});
window._t = polyglot.t.bind(polyglot);

const configModel = new ConfigModel(
  _.defaults(
    {
      base_url: window.base_url
    },
    window.config
  )
);

if (window.trackJs) {
  window.trackJs.configure({
    userId: window.user_data.username
  });
}

/**
 * Entry point for the new keys, bootstraps all dependency models and application.
 */
$(function () {
  const userModel = new UserModel(window.user_data, { configModel });

  const headerView = new DashboardHeaderView({
    el: $('#header'), // pre-rendered in DOM by Rails app
    model: userModel,
    configModel: configModel,
    viewModel: new HeaderViewModel()
  });
  headerView.render();

  const upgradeMessage = new UpgradeMessageView({
    configModel: configModel,
    userModel: userModel
  });

  $('.Header').after(upgradeMessage.render().el);

  const supportView = new SupportView({
    el: $('#support-banner'),
    userModel: userModel
  });
  supportView.render();

  const stackLayoutCollection = new Backbone.Collection([
    {
      createStackView: (stackLayoutModel) =>
        new ApiKeysListView({ userModel, stackLayoutModel })
    },
    {
      createStackView: (stackLayoutModel, [apiKeyModel, ...other]) =>
        new ApiKeysFormView({ stackLayoutModel, apiKeyModel })
    }
  ]);

  const stackLayout = new StackLayoutView({
    collection: stackLayoutCollection
  });

  $('.js-api-keys-new').append(stackLayout.render().el);

  if (!userModel.get('cartodb_com_hosted')) {
    if (userModel.get('actions').builder_enabled && userModel.get('show_builder_activated_message') &&
        _.isEmpty(window.dashboard_notifications)) {
      const userNotificationModel = new UserNotificationModel(window.dashboard_notifications, {
        key: 'dashboard',
        configModel: configModel
      });

      const dashboardNotification = new UserNotificationView({
        notification: userNotificationModel
      });

      window.dashboardNotification = dashboardNotification;
    }
  }
});
