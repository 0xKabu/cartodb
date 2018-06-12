const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone');
const CoreView = require('backbone/core-view');
const LocalStorage = require('dashboard/helpers/local-storage');
const PagesSubheader = require('dashboard/components/pages-subheader/pages-subheader.js');
const AccountFormView = require('./account-form-view');
const ModalsServiceModel = require('builder/components/modals/modals-service-model');
const template = require('./account-content.tpl');
const checkAndBuildOpts = require('builder/helpers/required-opts');

const errorsStorage = new LocalStorage('carto-errors');

const REQUIRED_OPTS = [
  'userModel',
  'configModel',
  'flashMessageModel',
  'client'
];

module.exports = CoreView.extend({
  initialize: function (options) {
    checkAndBuildOpts(options, REQUIRED_OPTS, this);

    this._initModels();
    this._initBinds();
  },

  _initBinds: function () {
    this.listenTo(this.model, 'change:isLoading change:errors', this.render);
  },

  render: function () {
    this.clearSubViews();
    this.$el.html(template());
    this._initViews();
    this._showPreviousErrors();

    return this;
  },

  _initModels: function () {
    this.model = new Backbone.Model();
    this.modals = new ModalsServiceModel();
  },

  _initViews: function () {
    const pagesSubheader = new PagesSubheader({
      userModel: this._userModel,
      configModel: this._configModel
    });
    this.$('.js-SideMenu').append(pagesSubheader.render().el);
    this.addView(pagesSubheader);

    const accountFormView = new AccountFormView({
      userModel: this._userModel,
      renderModel: this.model,
      configModel: this._configModel,
      modals: this.modals,
      setLoading: this._setLoading.bind(this),
      onSuccess: this._showSuccess.bind(this),
      onError: this._showErrors.bind(this),
      client: this._client,
      errors: this.model.get('errors')
    });

    this.$('.js-AccountContent').append(accountFormView.render().el);
    this.addView(accountFormView);
  },

  _showPreviousErrors: function () {
    const lockoutError = errorsStorage.get('lockout');

    if (lockoutError) {
      this._showErrors(lockoutError);
      errorsStorage.remove('lockout');
    }
  },

  _setLoading: function (message) {
    this._flashMessageModel.hide();

    this.model.set({
      isLoading: !!message,
      loadingText: message,
      errors: []
    });
  },

  _setFlashMessage: function (data, message, type) {
    this._setLoading('');

    const jsonData = data && data.responseJSON || {};
    const errors = jsonData.errors;
    let flashMessage = jsonData.message;

    if (errors) {
      this.model.set({ errors });
    }

    if (!flashMessage) {
      flashMessage = message;
    }

    this._flashMessageModel.show(flashMessage, type);
  },

  _showSuccess: function (data) {
    $(window).scrollTop(0);

    _.extend(
      this._userModel.attributes,
      data.user_data,
      { should_display_old_password: data.should_display_old_password }
    );

    this._setFlashMessage(data, _t('account.flash_messages.save_changes.success'), 'success');
  },

  _showErrors: function (data) {
    $(window).scrollTop(0);
    this._setFlashMessage(data, _t('account.flash_messages.save_changes.error'), 'error');
  }
});
